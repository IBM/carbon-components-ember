/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ember port of `@carbon/ai-chat-components`' `video-player/src/providers/
 * base-provider.ts`, ported verbatim. Kept as its own copy rather than
 * shared with `-audio-player/base-provider.ts` - see that file's doc
 * comment for why.
 */
export interface SubtitleTrack {
  src: string;
  language: string;
  label: string;
  kind?: 'subtitles' | 'captions' | 'descriptions';
  default?: boolean;
}

export interface ProviderConfig {
  ariaLabel?: string;
  playing?: boolean;
  subtitleTracks?: SubtitleTrack[];
  errorMessage?: string;
  loadingLabel?: string;
  readyLabel?: string;
  errorLabel?: string;
}

export abstract class BaseProvider {
  protected container: HTMLElement | null = null;
  protected config: ProviderConfig = {};
  protected readyCallback: (() => void) | null = null;
  protected playCallback: (() => void) | null = null;
  protected pauseCallback: (() => void) | null = null;
  protected errorCallback: ((error: Error) => void) | null = null;

  // eslint-disable-next-line @typescript-eslint/require-await -- overridden by every subclass with a real await; kept async here so `super.initialize()` composes uniformly.
  async initialize(container: HTMLElement, config: ProviderConfig): Promise<void> {
    this.container = container;
    this.config = config;
  }

  abstract load(url: string): Promise<void>;
  abstract play(): void;
  abstract pause(): void;

  onReady(callback: () => void): void {
    this.readyCallback = callback;
  }

  onPlay(callback: () => void): void {
    this.playCallback = callback;
  }

  onPause(callback: () => void): void {
    this.pauseCallback = callback;
  }

  onError(callback: (error: Error) => void): void {
    this.errorCallback = callback;
  }

  protected abstract updateAriaAttributes(
    element: HTMLElement,
    state: 'loading' | 'ready' | 'error',
  ): void;

  protected getStateLabel(state: 'loading' | 'ready' | 'error'): string {
    const baseLabel = this.config.ariaLabel || 'Video player';
    const stateLabels = {
      loading: this.config.loadingLabel || 'Loading',
      ready: this.config.readyLabel || 'Ready',
      error: this.config.errorLabel || 'Error',
    };
    return `${baseLabel} - ${stateLabels[state]}`;
  }

  teardown(): void {
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
    this.readyCallback = null;
    this.playCallback = null;
    this.pauseCallback = null;
    this.errorCallback = null;
  }

  protected triggerReady(): void {
    this.readyCallback?.();
  }

  protected triggerPlay(): void {
    this.playCallback?.();
  }

  protected triggerPause(): void {
    this.pauseCallback?.();
  }

  protected triggerError(error: Error): void {
    this.errorCallback?.(error);
  }
}
