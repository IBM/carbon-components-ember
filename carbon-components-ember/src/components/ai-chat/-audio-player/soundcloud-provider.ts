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

const SDK_URL = 'https://w.soundcloud.com/player/api.js';

/** The parts of the SoundCloud Widget API this provider uses. */
export interface SoundCloudWidget {
  bind(
    event: string,
    listener: (event: { currentPosition: number }) => void,
  ): void;
  unbind(event: string): void;
  load(
    url: string,
    options: { auto_play: boolean; callback: () => void },
  ): void;
  getDuration(callback: (duration: number) => void): void;
  play(): void;
  pause(): void;
}

export interface SoundCloudSDK {
  Widget: ((iframe: HTMLIFrameElement) => SoundCloudWidget) & {
    Events: Record<
      'PLAY' | 'PLAY_PROGRESS' | 'PAUSE' | 'FINISH' | 'ERROR',
      string
    >;
  };
}

declare global {
  interface Window {
    SC?: SoundCloudSDK;
  }
}

/**
 * Ember port of `@carbon/ai-chat-components`' `SoundCloudProvider`, ported
 * verbatim. Loads the SoundCloud Widget API via the shared `ScriptLoader`
 * and drives an `<iframe>` through `window.SC.Widget`.
 */
export class SoundCloudProvider extends BaseProvider {
  private player: SoundCloudWidget | null = null;
  private iframe: HTMLIFrameElement | null = null;
  private isReady = false;
  private duration = 0;
  private currentTime = 0;

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

    this.iframe = document.createElement('iframe');
    this.iframe.setAttribute('frameborder', '0');
    this.iframe.setAttribute('allow', 'autoplay');
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

    await this.loadSoundCloudAPI();
  }

  private async loadSoundCloudAPI(): Promise<void> {
    if (window.SC?.Widget) {
      return;
    }

    await ScriptLoader.load(SDK_URL);

    return new Promise((resolve, reject) => {
      const checkSC = () => {
        if (window.SC?.Widget) {
          resolve();
        } else {
          setTimeout(checkSC, 100);
        }
      };
      checkSC();

      setTimeout(() => {
        if (!window.SC?.Widget) {
          reject(new Error(this.config.errorMessage));
        }
      }, 5000);
    });
  }

  async load(url: string): Promise<void> {
    if (!this.iframe) {
      throw new Error('Iframe not initialized');
    }

    if (!window.SC?.Widget) {
      await this.loadSoundCloudAPI();
    }

    const { SC } = window;
    if (!SC) {
      throw new Error(this.config.errorMessage);
    }
    const { PLAY, PLAY_PROGRESS, PAUSE, FINISH, ERROR } = SC.Widget.Events;

    this.iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`;

    await new Promise<void>((resolve) => {
      if (this.iframe) {
        this.iframe.onload = () => resolve();
      }
    });

    const player = SC.Widget(this.iframe);
    this.player = player;

    player.bind(PLAY, () => {
      this.triggerPlay();
    });

    player.bind(PAUSE, () => {
      const remaining = this.duration - this.currentTime;
      if (remaining >= 0.05) {
        this.triggerPause();
      }
    });

    player.bind(PLAY_PROGRESS, (e) => {
      this.currentTime = e.currentPosition / 1000;
    });

    player.bind(FINISH, () => {
      this.triggerPause();
    });

    player.bind(ERROR, () => {
      if (this.iframe) {
        this.updateAriaAttributes(this.iframe, 'error');
      }
      this.triggerError(new Error(this.config.errorMessage));
    });

    player.load(url, {
      auto_play: this.config.playing || false,
      callback: () => {
        player.getDuration((duration) => {
          this.duration = duration / 1000;
          this.isReady = true;
          if (this.iframe) {
            this.updateAriaAttributes(this.iframe, 'ready');
          }
          this.triggerReady();
        });
      },
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
    if (this.player) {
      if (window.SC?.Widget?.Events) {
        const { PLAY, PLAY_PROGRESS, PAUSE, FINISH, ERROR } =
          window.SC.Widget.Events;
        this.player.unbind(PLAY);
        this.player.unbind(PLAY_PROGRESS);
        this.player.unbind(PAUSE);
        this.player.unbind(FINISH);
        this.player.unbind(ERROR);
      }
      this.player = null;
    }
    this.iframe = null;
    this.isReady = false;
    super.teardown();
  }
}
