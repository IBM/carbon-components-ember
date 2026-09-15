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

/**
 * Ember port of `@carbon/ai-chat-components`' `NativeAudioProvider`, ported
 * verbatim including `crossOrigin = 'anonymous'` - a real behavioral
 * choice, not an oversight: it lets the audio element expose CORS-safe
 * timing/error info to the page, but it also means a source hosted without
 * `Access-Control-Allow-Origin` won't play. Any docs demo using this
 * provider needs an asset served with CORS headers.
 */
export class NativeAudioProvider extends BaseProvider {
  private audioElement: HTMLAudioElement | null = null;

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

    this.audioElement = document.createElement('audio');
    this.audioElement.controls = true;
    this.audioElement.setAttribute('controlsList', 'nodownload');
    this.audioElement.crossOrigin = 'anonymous';

    if (config.ariaLabel) {
      this.updateAriaAttributes(this.audioElement, 'loading');
    }

    this.audioElement.addEventListener('loadedmetadata', () => {
      if (this.audioElement) {
        this.updateAriaAttributes(this.audioElement, 'ready');
      }
      this.triggerReady();
    });

    this.audioElement.addEventListener('play', () => {
      this.triggerPlay();
    });

    this.audioElement.addEventListener('pause', () => {
      this.triggerPause();
    });

    this.audioElement.addEventListener('error', () => {
      if (this.audioElement) {
        this.updateAriaAttributes(this.audioElement, 'error');
      }
      this.triggerError(new Error(this.config.errorMessage));
    });

    this.container.appendChild(this.audioElement);
  }

  async load(url: string): Promise<void> {
    if (!this.audioElement) {
      throw new Error('Audio element not initialized');
    }

    this.audioElement.src = url;
    this.audioElement.load();

    if (this.config.playing) {
      try {
        await this.audioElement.play();
      } catch {
        // Auto-play might be blocked by the browser.
      }
    }
  }

  play(): void {
    this.audioElement?.play().catch(() => {
      // Play might be blocked by the browser.
    });
  }

  pause(): void {
    this.audioElement?.pause();
  }

  teardown(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.removeAttribute('src');
      this.audioElement.load();

      if (this.audioElement.parentElement) {
        this.audioElement.parentElement.removeChild(this.audioElement);
      }

      this.audioElement = null;
    }

    super.teardown();
  }
}
