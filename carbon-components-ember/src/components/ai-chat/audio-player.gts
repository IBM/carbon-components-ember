/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import { modifier as eModifier } from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import { detectAudioSource, AudioSource } from './-audio-player/url-detector.ts';
import type { BaseProvider } from './-audio-player/base-provider.ts';
import { NativeAudioProvider } from './-audio-player/native-audio-provider.ts';
import { SoundCloudProvider } from './-audio-player/soundcloud-provider.ts';

const LOADING_TIMEOUT_MS = 10000;

export type Args = {
  /** Audio source URL (required). */
  source: string;
  /** Defaults to `'Audio player'`. */
  ariaLabel?: string;
  /** Whether the audio should be playing. Only reacted to on later change - the initial value is applied via provider autoplay. */
  playing?: boolean;
  /** Generic error message shown/reported regardless of the actual failure. Defaults to `'Failed to load audio'`. */
  errorMessage?: string;
  /** Defaults to `'Audio player loading'`. */
  loadingStatusMessage?: string;
  /** Defaults to `'Audio player ready'`. */
  readyStatusMessage?: string;
  /** Defaults to `'Loading'`. */
  loadingLabel?: string;
  /** Defaults to `'Ready'`. */
  readyLabel?: string;
  /** Defaults to `'Error'`. */
  errorLabel?: string;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (detail: { message: string }) => void;
};

export interface AudioPlayerSignature {
  Element: HTMLDivElement;
  Args: Args;
}

/**
 * Audio player supporting native `<audio>` files and SoundCloud URLs.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-audio-player`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/audio-player).
 * Doesn't collide with any Carbon React component name, so it stays
 * unprefixed.
 *
 * `@source` drives a real provider abstraction (`BaseProvider` and its
 * `NativeAudioProvider`/`SoundCloudProvider` subclasses, both ported
 * verbatim from upstream) exactly like upstream: a `<div>` provider
 * container is handed to whichever provider `detectAudioSource` selects,
 * and that provider owns everything appended inside it imperatively -
 * mirroring the same "hand a runtime library an empty container it alone
 * reparents/manages" pattern already established by `Carousel`'s
 * `attachCarousel` modifier. An unrecognized URL (`AudioSource.UNKNOWN`)
 * still surfaces through `@errorMessage`/`@onError`, matching upstream -
 * it is never silently ignored.
 *
 * Upstream's shared `shared/media-utils/script-loader.ts` (`ScriptLoader`,
 * `-media/script-loader.ts` here) is ported verbatim and reused by
 * `VideoPlayer`'s SDK-backed providers too - the reason these two
 * components were ported together rather than separately.
 *
 * Upstream's `shared/dynamic-css-var-sheet.ts` is deliberately NOT used
 * here (`AudioPlayer` has no dynamic CSS custom property to write) - see
 * `VideoPlayer`'s class doc for why it's skipped there too.
 *
 * Upstream's sibling `cds-aichat-transcript` element (a separate,
 * independently-invoked widget rendering markdown text in a disclosure)
 * is out of scope: `audio-player.ts` itself never imports or renders it,
 * so porting it isn't required to port `AudioPlayer` faithfully. Left for
 * a follow-up.
 *
 * Upstream's `rounded-modifiers` SCSS mixins (`data-rounded`/`data-stacked`
 * host attributes) are also skipped - they're driven by a message-list
 * orchestration layer this addon hasn't ported (same scope cut already
 * established for `ChatShell`'s `ResizeObserverManager`).
 */
export default class AudioPlayer extends Component<AudioPlayerSignature> {
  @tracked isLoading = true;
  @tracked hasError = false;
  @tracked isReady = false;
  @tracked audioSourceType: AudioSource | null = null;
  @tracked statusMessage = '';

  private provider: BaseProvider | null = null;
  private loadingTimeout: ReturnType<typeof setTimeout> | null = null;
  private loadGeneration = 0;
  // The `@source` last (re)loaded - see `attachProvider` below for why this
  // explicit diff is required rather than trusting the modifier's own
  // re-invocation to mean `@source` itself changed.
  private lastLoadedSource: string | undefined;
  // Plain (non-tracked) shadow of `isReady`, read by `syncPlaying` below.
  // Reading the real `@tracked isReady` from inside that modifier would
  // auto-entangle it as a dependency, rerunning the modifier (and calling
  // `provider.play()`/`pause()`) the instant the provider becomes ready -
  // not just when `@playing` itself changes, which is the only thing that
  // modifier's positional arg is meant to react to.
  private providerReady = false;
  // The `@playing` value last acted on, seeded once the provider becomes
  // ready (see `handleReady`). `syncPlaying` diffs the incoming value
  // against this rather than trusting that every modifier re-invocation
  // means `@playing` itself changed - empirically, a render triggered by
  // unrelated tracked state (e.g. `isReady`/`statusMessage` flipping) can
  // still re-run this modifier with the same `@playing` value, and upstream's
  // own `changedProperties.has('playing')` check (Lit's dirty-checking) is
  // exactly this kind of explicit before/after diff, not "was this render
  // caused by a playing-arg change."
  private lastSyncedPlaying = false;

  constructor(owner: Owner, args: AudioPlayerSignature['Args']) {
    super(owner, args);
    registerDestructor(this, () => this.teardownProvider());
  }

  get ariaLabel(): string {
    return this.args.ariaLabel ?? 'Audio player';
  }

  get errorMessage(): string {
    return this.args.errorMessage ?? 'Failed to load audio';
  }

  get containerClasses(): string {
    const classes = ['cds-aichat-audio-player__container'];
    if (this.audioSourceType === AudioSource.SOUNDCLOUD) {
      classes.push('cds-aichat-audio-player__container--soundcloud');
    }
    return classes.join(' ');
  }

  get providerClasses(): string {
    const classes = ['cds-aichat-audio-player__provider'];
    if (this.hasError) {
      classes.push('cds-aichat-audio-player__provider--hidden');
    }
    if (this.isReady) {
      classes.push('cds-aichat-audio-player__provider--ready');
    }
    return classes.join(' ');
  }

  private createProvider(audioSourceType: AudioSource): BaseProvider | null {
    switch (audioSourceType) {
      case AudioSource.SOUNDCLOUD:
        return new SoundCloudProvider();
      case AudioSource.NATIVE:
        return new NativeAudioProvider();
      default:
        return null;
    }
  }

  private teardownProvider(): void {
    this.providerReady = false;
    this.loadGeneration++;
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
    if (this.provider) {
      this.provider.teardown();
      this.provider = null;
    }
  }

  private handleReady(): void {
    this.isLoading = false;
    this.isReady = true;
    this.providerReady = true;
    this.lastSyncedPlaying = this.args.playing ?? false;
    this.statusMessage = this.args.readyStatusMessage ?? 'Audio player ready';
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
    this.args.onReady?.();
  }

  private handlePlay(): void {
    this.args.onPlay?.();
  }

  private handlePause(): void {
    this.args.onPause?.();
  }

  private handleError(): void {
    this.isLoading = false;
    this.hasError = true;
    this.statusMessage = '';
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
    this.args.onError?.({ message: this.errorMessage });
  }

  private async loadAudio(
    container: HTMLDivElement,
    source: string,
  ): Promise<void> {
    const generation = ++this.loadGeneration;

    const audioSourceType = detectAudioSource(source);
    this.audioSourceType = audioSourceType;
    this.isLoading = true;
    this.hasError = false;
    this.isReady = false;
    this.statusMessage = this.args.loadingStatusMessage ?? 'Audio player loading';

    this.loadingTimeout = setTimeout(() => {
      if (generation === this.loadGeneration && this.isLoading) {
        this.handleError();
      }
    }, LOADING_TIMEOUT_MS);

    const provider = this.createProvider(audioSourceType);
    if (!provider) {
      this.handleError();
      return;
    }
    this.provider = provider;

    provider.onReady(() => {
      if (generation === this.loadGeneration) {
        this.handleReady();
      }
    });
    provider.onPlay(() => {
      if (generation === this.loadGeneration) {
        this.handlePlay();
      }
    });
    provider.onPause(() => {
      if (generation === this.loadGeneration) {
        this.handlePause();
      }
    });
    provider.onError(() => {
      if (generation === this.loadGeneration) {
        this.handleError();
      }
    });

    try {
      await provider.initialize(container, {
        ariaLabel: this.ariaLabel,
        playing: this.args.playing ?? false,
        errorMessage: this.errorMessage,
        loadingLabel: this.args.loadingLabel ?? 'Loading',
        readyLabel: this.args.readyLabel ?? 'Ready',
        errorLabel: this.args.errorLabel ?? 'Error',
      });
      // Teardown may have destroyed this same provider instance while the
      // await above was pending (a fast `@source` change, or unmount) -
      // bail without touching it further, matching the destroy-while-
      // awaiting guard already established for PromptLine's rich-editor
      // upgrade.
      if (generation !== this.loadGeneration) {
        return;
      }
      await provider.load(source);
    } catch {
      if (generation === this.loadGeneration) {
        this.handleError();
      }
    }
  }

  // Loads (tearing down any previous provider first) only when `@source`
  // itself actually changed, mirroring upstream's `updated()` reload-on-
  // source-change check plus its `firstUpdated()` initial load in one path.
  //
  // This modifier's own re-invocation is NOT a reliable "source changed"
  // signal: `ember-modifier` reruns a functional modifier's install/cleanup
  // pair on any render that touches this element's render node - which
  // includes renders caused by this very component's OWN tracked writes
  // inside `loadAudio` (`isLoading`/`isReady`/`statusMessage`, all read by
  // the template) - not only when `[source]` differs. Relying on
  // reinvocation alone would tear down and reload the whole provider on
  // every such unrelated render, discarding playback position and
  // re-fetching the source. `lastLoadedSource` makes the actual reload
  // decision explicit, the same fix already needed for `syncPlaying` below.
  attachProvider = eModifier<{
    Element: HTMLDivElement;
    Args: { Positional: [string] };
  }>((element, [source]) => {
    if (source === this.lastLoadedSource) {
      return;
    }
    this.lastLoadedSource = source;
    this.teardownProvider();
    void this.loadAudio(element, source);
  });

  // Only reacts to a *change* in `@playing` after mount - the initial
  // value is threaded through `provider.initialize()`'s `playing` config instead
  // (matches upstream's own `changedProperties.has('playing')` gate, which
  // likewise never fires on first render).
  syncPlaying = eModifier<{
    Element: HTMLDivElement;
    Args: { Positional: [boolean | undefined] };
  }>((_element, [playing]) => {
    if (!this.provider || !this.providerReady) {
      return;
    }
    const next = playing ?? false;
    if (next === this.lastSyncedPlaying) {
      return;
    }
    this.lastSyncedPlaying = next;
    if (next) {
      this.provider.play();
    } else {
      this.provider.pause();
    }
  });

  <template>
    <div
      class='cds-aichat-audio-player'
      role='region'
      aria-label={{this.ariaLabel}}
      ...attributes
    >
      {{#if this.statusMessage}}
        <div
          class='cds-aichat-audio-player__status'
          role='status'
          aria-live='polite'
          aria-atomic='true'
        >{{this.statusMessage}}</div>
      {{/if}}
      <div class={{this.containerClasses}}>
        {{#if this.hasError}}
          <div
            class='cds-aichat-audio-player__error'
            role='alert'
            aria-live='assertive'
          >
            <p class='cds-aichat-audio-player__error-message'>{{this.errorMessage}}</p>
          </div>
        {{/if}}
        <div
          class={{this.providerClasses}}
          {{this.attachProvider @source}}
          {{this.syncPlaying @playing}}
        ></div>
      </div>
    </div>
  </template>
}
