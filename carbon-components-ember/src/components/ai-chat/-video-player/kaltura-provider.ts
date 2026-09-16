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

const SDK_URL = 'https://cdn.embed.ly/player-0.1.0.min.js';

declare global {
  interface Window {
    playerjs: any;
  }
}

/**
 * Ember port of `@carbon/ai-chat-components`' `KalturaProvider`, ported
 * verbatim. Kaltura uses the player.js standard for iframe communication,
 * loaded via the shared `ScriptLoader`.
 */
export class KalturaProvider extends BaseProvider {
  private player: any = null;
  private iframe: HTMLIFrameElement | null = null;
  private isReady = false;

  protected updateAriaAttributes(
    element: HTMLElement,
    state: 'loading' | 'ready' | 'error',
  ): void {
    element.setAttribute('aria-label', this.getStateLabel(state));
    element.setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');
  }

  async initialize(container: HTMLElement, config: ProviderConfig): Promise<void> {
    await super.initialize(container, config);

    if (!this.container) {
      throw new Error('Container element is required');
    }

    this.iframe = document.createElement('iframe');
    this.iframe.setAttribute('frameborder', '0');
    this.iframe.setAttribute('scrolling', 'no');
    this.iframe.setAttribute('allow', 'encrypted-media; autoplay; fullscreen;');
    this.iframe.setAttribute(
      'sandbox',
      'allow-scripts allow-downloads allow-forms allow-popups allow-same-origin',
    );
    this.iframe.setAttribute('referrer-policy', 'origin');
    this.iframe.setAttribute('role', 'application');

    if (config.ariaLabel) {
      this.updateAriaAttributes(this.iframe, 'loading');
    }

    this.container.appendChild(this.iframe);

    await this.loadPlayerJS();
  }

  private async loadPlayerJS(): Promise<void> {
    if (window.playerjs?.Player) {
      return;
    }

    await ScriptLoader.load(SDK_URL);

    return new Promise((resolve, reject) => {
      const checkPlayerJS = () => {
        if (window.playerjs?.Player) {
          resolve();
        } else {
          setTimeout(checkPlayerJS, 100);
        }
      };
      checkPlayerJS();

      setTimeout(() => {
        if (!window.playerjs?.Player) {
          reject(new Error('player.js API failed to load'));
        }
      }, 5000);
    });
  }

  async load(url: string): Promise<void> {
    if (!this.iframe) {
      throw new Error('Iframe not initialized');
    }

    if (!window.playerjs?.Player) {
      await this.loadPlayerJS();
    }

    this.iframe.src = url;

    await new Promise<void>((resolve) => {
      if (this.iframe) {
        this.iframe.onload = () => resolve();
      }
    });

    this.player = new window.playerjs.Player(this.iframe);

    this.player.on('ready', () => {
      // Arbitrary timeout required for event listeners to work, matching
      // upstream (player.js docs call this out as a known quirk).
      setTimeout(() => {
        if (this.iframe) {
          this.updateAriaAttributes(this.iframe, 'ready');
        }
        this.isReady = true;
        this.addListeners();
        this.triggerReady();
      }, 500);
    });
  }

  private addListeners(): void {
    if (!this.player) {
      return;
    }

    this.player.on('play', () => {
      this.triggerPlay();
    });

    this.player.on('pause', () => {
      this.triggerPause();
    });

    this.player.on('ended', () => {
      this.triggerPause();
    });

    this.player.on('error', () => {
      if (this.iframe) {
        this.updateAriaAttributes(this.iframe, 'error');
      }
      this.triggerError(
        new Error(this.config.errorMessage || 'Failed to load video'),
      );
    });
  }

  play(): void {
    if (this.player && this.isReady) {
      this.player.play();
    }
  }

  pause(): void {
    if (this.player && this.isReady) {
      this.player.pause();
    }
  }

  teardown(): void {
    this.player = null;
    this.iframe = null;
    this.isReady = false;
    super.teardown();
  }
}
