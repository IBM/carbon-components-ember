/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Portions of this code are derived from react-player
 * Copyright (c) 2017 Pete Cook
 * Licensed under the MIT License
 * https://github.com/cookpete/react-player/blob/v2.15.1/LICENSE
 */

import { BaseProvider, type ProviderConfig } from './base-provider.ts';
import { ScriptLoader } from '../-media/script-loader.ts';

const SDK_URL = 'https://www.youtube.com/iframe_api';
const MATCH_URL_YOUTUBE =
  /(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})/;

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

/**
 * Ember port of `@carbon/ai-chat-components`' `YouTubeProvider`, ported
 * verbatim. Loads the YouTube IFrame API via the shared `ScriptLoader` and
 * drives it through `window.YT.Player`.
 */
export class YouTubeProvider extends BaseProvider {
  private player: any = null;
  private playerContainer: HTMLDivElement | null = null;
  private iframe: HTMLIFrameElement | null = null;
  private isReady = false;

  protected updateAriaAttributes(
    element: HTMLElement,
    state: 'loading' | 'ready' | 'error',
  ): void {
    element.setAttribute('aria-label', this.getStateLabel(state));
    element.setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');
  }

  private getVideoId(url: string): string | null {
    const match = url.match(MATCH_URL_YOUTUBE);
    return match ? (match[1] ?? null) : null;
  }

  async initialize(container: HTMLElement, config: ProviderConfig): Promise<void> {
    await super.initialize(container, config);

    if (!this.container) {
      throw new Error('Container element is required');
    }

    this.playerContainer = document.createElement('div');
    this.container.appendChild(this.playerContainer);

    await this.loadYouTubeAPI();
  }

  private async loadYouTubeAPI(): Promise<void> {
    if (window.YT?.Player) {
      return;
    }

    return new Promise((resolve, reject) => {
      const originalCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        originalCallback?.();
        resolve();
      };

      ScriptLoader.load(SDK_URL).catch((error: unknown) => {
        reject(error instanceof Error ? error : new Error(String(error)));
      });
    });
  }

  async load(url: string): Promise<void> {
    const videoId = this.getVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    if (!this.playerContainer) {
      throw new Error('Player container not initialized');
    }

    if (!window.YT?.Player) {
      await this.loadYouTubeAPI();
    }

    if (this.isReady && this.player) {
      this.player.loadVideoById(videoId);
    } else {
      this.player = new window.YT.Player(this.playerContainer, {
        width: '100%',
        height: '100%',
        videoId,
        playerVars: {
          autoplay: this.config.playing ? 1 : 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            this.iframe = this.playerContainer?.querySelector(
              'iframe',
            ) as HTMLIFrameElement;
            if (this.iframe) {
              this.updateAriaAttributes(this.iframe, 'ready');
            }
            this.isReady = true;
            this.triggerReady();
          },
          onStateChange: (event: any) => {
            this.handleStateChange(event);
          },
          onError: () => {
            this.handleError();
          },
        },
      });

      setTimeout(() => {
        this.iframe = this.playerContainer?.querySelector(
          'iframe',
        ) as HTMLIFrameElement;
        if (this.iframe) {
          this.updateAriaAttributes(this.iframe, 'loading');
        }
      }, 100);
    }
  }

  private handleStateChange(event: any): void {
    const { YT } = window;
    if (!YT) {
      return;
    }

    switch (event.data) {
      case YT.PlayerState.PLAYING:
        this.triggerPlay();
        break;
      case YT.PlayerState.PAUSED:
      case YT.PlayerState.ENDED:
        this.triggerPause();
        break;
    }
  }

  private handleError(): void {
    if (this.iframe) {
      this.updateAriaAttributes(this.iframe, 'error');
    }
    this.triggerError(
      new Error(this.config.errorMessage || 'Failed to load video'),
    );
  }

  play(): void {
    if (this.player && this.isReady) {
      this.player.playVideo();
    }
  }

  pause(): void {
    if (this.player && this.isReady) {
      this.player.pauseVideo();
    }
  }

  teardown(): void {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
    this.playerContainer = null;
    this.isReady = false;
    super.teardown();
  }
}
