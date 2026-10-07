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

import { BaseProvider } from './base-provider.ts';
import type { ProviderConfig } from './base-provider.ts';
import { ScriptLoader } from '../-media/script-loader.ts';

const SDK_URL = 'https://player.vimeo.com/api/player.js';

/** The parts of the Vimeo Player SDK this provider uses. */
export interface VimeoPlayer {
  ready(): Promise<void>;
  on(
    event: 'loaded' | 'play' | 'pause' | 'ended' | 'error',
    callback: () => void,
  ): void;
  play(): Promise<void>;
  pause(): Promise<void>;
  destroy(): Promise<void>;
}

export interface VimeoSDK {
  Player: new (
    element: HTMLElement,
    options: {
      url: string;
      autoplay: boolean;
      controls: boolean;
      playsinline: boolean;
    },
  ) => VimeoPlayer;
}

declare global {
  interface Window {
    Vimeo?: VimeoSDK;
  }
}

function cleanUrl(url: string): string {
  return url.replace('/manage/videos', '');
}

/**
 * Ember port of `@carbon/ai-chat-components`' `VimeoProvider`, ported
 * verbatim. Loads the Vimeo Player API via the shared `ScriptLoader` and
 * drives it through `window.Vimeo.Player`.
 */
export class VimeoProvider extends BaseProvider {
  private player: VimeoPlayer | null = null;
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

  async initialize(
    container: HTMLElement,
    config: ProviderConfig,
  ): Promise<void> {
    await super.initialize(container, config);

    if (!this.container) {
      throw new Error('Container element is required');
    }

    this.playerContainer = document.createElement('div');
    this.container.appendChild(this.playerContainer);

    await this.loadVimeoAPI();
  }

  private async loadVimeoAPI(): Promise<void> {
    if (window.Vimeo?.Player) {
      return;
    }

    await ScriptLoader.load(SDK_URL);

    return new Promise((resolve, reject) => {
      const checkVimeo = () => {
        if (window.Vimeo?.Player) {
          resolve();
        } else {
          setTimeout(checkVimeo, 100);
        }
      };
      checkVimeo();

      setTimeout(() => {
        if (!window.Vimeo?.Player) {
          reject(new Error('Vimeo Player API failed to load'));
        }
      }, 5000);
    });
  }

  async load(url: string): Promise<void> {
    if (!this.playerContainer) {
      throw new Error('Player container not initialized');
    }

    if (!window.Vimeo?.Player) {
      await this.loadVimeoAPI();
    }

    const cleanedUrl = cleanUrl(url);

    const { Vimeo } = window;
    if (!Vimeo) {
      this.handleError();
      return;
    }

    try {
      const player = new Vimeo.Player(this.playerContainer, {
        url: cleanedUrl,
        autoplay: this.config.playing || false,
        controls: true,
        playsinline: true,
      });
      this.player = player;

      await player.ready();

      this.iframe = this.playerContainer.querySelector('iframe');
      if (this.iframe) {
        this.updateAriaAttributes(this.iframe, 'loading');
      }

      player.on('loaded', () => {
        if (this.iframe) {
          this.updateAriaAttributes(this.iframe, 'ready');
        }
        this.isReady = true;
        this.triggerReady();
      });

      player.on('play', () => {
        this.triggerPlay();
      });

      player.on('pause', () => {
        this.triggerPause();
      });

      player.on('ended', () => {
        this.triggerPause();
      });

      player.on('error', () => {
        this.handleError();
      });
    } catch {
      this.handleError();
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
      this.player.play().catch(() => {
        // Play might be blocked by the browser.
      });
    }
  }

  pause(): void {
    if (this.player && this.isReady) {
      this.player.pause().catch(() => {
        // Pause might reject if the player was already destroyed.
      });
    }
  }

  teardown(): void {
    if (this.player) {
      this.player.destroy().catch(() => {
        // Destroy might reject if the player was already torn down.
      });
      this.player = null;
    }
    this.playerContainer = null;
    this.isReady = false;
    super.teardown();
  }
}
