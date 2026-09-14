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
 * Ember port of `@carbon/ai-chat-components`' `NativeVideoProvider`, ported
 * verbatim including `crossOrigin = 'anonymous'` (see the same note on
 * `NativeAudioProvider`) and WebVTT `<track>` support for `subtitleTracks`.
 */
export class NativeVideoProvider extends BaseProvider {
  private videoElement: HTMLVideoElement | null = null;

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

    this.videoElement = document.createElement('video');
    this.videoElement.controls = true;
    this.videoElement.setAttribute('controlsList', 'nodownload');
    this.videoElement.playsInline = true;
    this.videoElement.crossOrigin = 'anonymous';

    if (config.ariaLabel) {
      this.updateAriaAttributes(this.videoElement, 'loading');
    }

    const videoElement = this.videoElement;
    if (config.subtitleTracks && config.subtitleTracks.length > 0) {
      config.subtitleTracks.forEach((track) => {
        const trackElement = document.createElement('track');
        trackElement.kind = track.kind || 'subtitles';
        trackElement.src = track.src;
        trackElement.srclang = track.language;
        trackElement.label = track.label;
        if (track.default) {
          trackElement.default = true;
        }
        videoElement.appendChild(trackElement);
      });
    }

    this.videoElement.addEventListener('loadedmetadata', () => {
      if (this.videoElement) {
        this.updateAriaAttributes(this.videoElement, 'ready');
      }
      this.triggerReady();
    });

    this.videoElement.addEventListener('play', () => {
      this.triggerPlay();
    });

    this.videoElement.addEventListener('pause', () => {
      this.triggerPause();
    });

    this.videoElement.addEventListener('error', () => {
      if (this.videoElement) {
        this.updateAriaAttributes(this.videoElement, 'error');
      }
      this.triggerError(
        new Error(this.config.errorMessage || 'Failed to load video'),
      );
    });

    this.container.appendChild(this.videoElement);
  }

  async load(url: string): Promise<void> {
    if (!this.videoElement) {
      throw new Error('Video element not initialized');
    }

    this.videoElement.src = url;
    this.videoElement.load();

    if (this.config.playing) {
      try {
        await this.videoElement.play();
      } catch {
        // Auto-play might be blocked by the browser.
      }
    }
  }

  play(): void {
    this.videoElement?.play().catch(() => {
      // Play might be blocked by the browser.
    });
  }

  pause(): void {
    this.videoElement?.pause();
  }

  teardown(): void {
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.removeAttribute('src');
      this.videoElement.load();

      if (this.videoElement.parentElement) {
        this.videoElement.parentElement.removeChild(this.videoElement);
      }

      this.videoElement = null;
    }

    super.teardown();
  }
}
