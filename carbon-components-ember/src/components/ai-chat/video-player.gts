/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { rawTimeout, task } from 'ember-concurrency';
import style from 'ember-style-modifier';
import { registerDestructor } from '@ember/destroyable';
import {
  detectVideoSource,
  VideoSource,
} from './-video-player/url-detector.ts';
import type {
  BaseProvider,
  SubtitleTrack,
} from './-video-player/base-provider.ts';
import { NativeVideoProvider } from './-video-player/native-video-provider.ts';
import { YouTubeProvider } from './-video-player/youtube-provider.ts';
import { VimeoProvider } from './-video-player/vimeo-provider.ts';
import { KalturaProvider } from './-video-player/kaltura-provider.ts';
import { LOADING_TIMEOUT_MS } from './-media/loading-timeout.ts';
import './video-player.scss';

const DEFAULT_ASPECT_RATIO_PERCENTAGE = 56.25;

export type { SubtitleTrack };

export interface VideoPlayerSignature {
  Element: HTMLDivElement;
  Args: {
    /** Video source URL (required). */
    source: string;
    /** Defaults to `'Video player'`. */
    ariaLabel?: string;
    /** Whether the video should be playing. Only reacted to on later change - the initial value is applied via provider autoplay. */
    playing?: boolean;
    /** Aspect ratio as a padding-top percentage. Defaults to `56.25` (16:9). */
    aspectRatioPercentage?: number;
    /** WebVTT caption/subtitle tracks - only honored by the native `<video>` provider, ignored by embed providers (matches upstream). */
    subtitleTracks?: SubtitleTrack[];
    /** Generic error message shown/reported regardless of the actual failure. Defaults to `'Failed to load video'`. */
    errorMessage?: string;
    /** Defaults to `'Video player loading'`. */
    loadingStatusMessage?: string;
    /** Defaults to `'Video player ready'`. */
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
}

/**
 * Video player supporting native `<video>` files (with optional WebVTT
 * `@subtitleTracks`) plus YouTube, Vimeo, and Kaltura URLs.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-video-player`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/video-player).
 * Shares its provider/loading-state architecture and
 * `-media/script-loader.ts` (`ScriptLoader`) with `AudioPlayer` - see that
 * file's class doc for the shared-infra reasoning.
 *
 * An unrecognized URL (`VideoSource.UNKNOWN`) still surfaces through
 * `@errorMessage`/`@onError`, matching upstream - it is never silently
 * ignored.
 *
 * **`@aspectRatioPercentage` divergence, deliberate:** upstream writes a
 * per-instance `--video-player-aspect-ratio` through a constructable
 * stylesheet (`shared/dynamic-css-var-sheet.ts`). The `{{style}}` modifier
 * sets the padding through CSSOM instead, which a strict CSP allows too, so
 * that machinery isn't ported. `aspectRatioPercentage` below sanitizes the
 * value (a finite, positive number, or the same `56.25` fallback).
 *
 * Upstream's `rounded-modifiers` SCSS mixins are skipped for the same
 * reason documented on `AudioPlayer`.
 */
export default class VideoPlayer extends Component<VideoPlayerSignature> {
  @tracked isLoading = true;
  @tracked hasError = false;
  @tracked isReady = false;
  @tracked statusMessage = '';

  private provider: BaseProvider | null = null;
  private loadGeneration = 0;
  // The `@source` last (re)loaded - see AudioPlayer's identical field and
  // `attachProvider` below for why this explicit diff is required.
  private lastLoadedSource: string | undefined;
  // Plain (non-tracked) shadow of `isReady` - see AudioPlayer's identical
  // field for why `syncPlaying` must read this instead of the real
  // `@tracked isReady`.
  private providerReady = false;
  // The `@playing` value last acted on - see AudioPlayer's identical field
  // for why `syncPlaying` must diff against this explicitly rather than
  // trusting every re-invocation to mean `@playing` itself changed.
  private lastSyncedPlaying = false;

  constructor(owner: Owner, args: VideoPlayerSignature['Args']) {
    super(owner, args);
    registerDestructor(this, () => this.teardownProvider());
  }

  get ariaLabel(): string {
    return this.args.ariaLabel ?? 'Video player';
  }

  get errorMessage(): string {
    return this.args.errorMessage ?? 'Failed to load video';
  }

  get aspectRatioPercentage(): number {
    const value = this.args.aspectRatioPercentage;
    return typeof value === 'number' && Number.isFinite(value) && value > 0
      ? value
      : DEFAULT_ASPECT_RATIO_PERCENTAGE;
  }

  get containerPadding() {
    return `${this.aspectRatioPercentage}%`;
  }

  get providerClasses(): string {
    const classes = ['cds-aichat-video-player__provider'];
    if (this.hasError) {
      classes.push('cds-aichat-video-player__provider--hidden');
    }
    if (this.isReady) {
      classes.push('cds-aichat-video-player__provider--ready');
    }
    return classes.join(' ');
  }

  private createProvider(videoSourceType: VideoSource): BaseProvider | null {
    switch (videoSourceType) {
      case VideoSource.YOUTUBE:
        return new YouTubeProvider();
      case VideoSource.VIMEO:
        return new VimeoProvider();
      case VideoSource.KALTURA:
        return new KalturaProvider();
      case VideoSource.NATIVE:
        return new NativeVideoProvider();
      default:
        return null;
    }
  }

  private teardownProvider(): void {
    this.providerReady = false;
    this.loadGeneration++;
    void this.failIfStillLoading.cancelAll();
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
    this.statusMessage = this.args.readyStatusMessage ?? 'Video player ready';
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
    this.args.onError?.({ message: this.errorMessage });
  }

  // rawTimeout, not timeout: settled() mustn't wait out a load that never
  // finishes.
  private failIfStillLoading = task({ restartable: true }, async () => {
    await rawTimeout(LOADING_TIMEOUT_MS);
    if (this.isLoading) {
      this.handleError();
    }
  });

  private async loadVideo(
    container: HTMLDivElement,
    source: string,
  ): Promise<void> {
    const generation = ++this.loadGeneration;

    const videoSourceType = detectVideoSource(source);
    this.isLoading = true;
    this.hasError = false;
    this.isReady = false;
    this.statusMessage =
      this.args.loadingStatusMessage ?? 'Video player loading';

    void this.failIfStillLoading.perform();

    const provider = this.createProvider(videoSourceType);
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
        subtitleTracks: this.args.subtitleTracks,
        errorMessage: this.errorMessage,
        loadingLabel: this.args.loadingLabel ?? 'Loading',
        readyLabel: this.args.readyLabel ?? 'Ready',
        errorLabel: this.args.errorLabel ?? 'Error',
      });
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
  // itself actually changed - see AudioPlayer's identical modifier for why
  // this explicit diff is required instead of trusting the modifier's own
  // re-invocation.
  attachProvider = modifier<{
    Element: HTMLDivElement;
    Args: { Positional: [string] };
  }>((element, [source]) => {
    if (source === this.lastLoadedSource) {
      return;
    }
    this.lastLoadedSource = source;
    this.teardownProvider();
    void this.loadVideo(element, source);
  });

  syncPlaying = modifier<{
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
      class="cds-aichat-video-player"
      role="region"
      aria-label={{this.ariaLabel}}
      ...attributes
    >
      {{#if this.statusMessage}}
        <div
          class="cds-aichat-video-player__status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >{{this.statusMessage}}</div>
      {{/if}}
      <div
        class="cds-aichat-video-player__container"
        {{style paddingBlockStart=this.containerPadding}}
      >
        {{#if this.hasError}}
          <div
            class="cds-aichat-video-player__error"
            role="alert"
            aria-live="assertive"
          >
            <p
              class="cds-aichat-video-player__error-message"
            >{{this.errorMessage}}</p>
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
