/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ember port of `@carbon/ai-chat-components`' shared
 * `shared/media-utils/script-loader.ts`, used by every third-party
 * embed provider (`SoundCloudProvider`, `YouTubeProvider`, `VimeoProvider`,
 * `KalturaProvider`) to lazily inject that provider's SDK `<script>` tag at
 * runtime - none of these SDKs are npm dependencies. Ported verbatim; this
 * is plain DOM/Promise code with nothing Lit-specific to translate.
 */
export class ScriptLoader {
  private static loadedScripts = new Map<string, Promise<void>>();

  /**
   * Load a script from the given URL.
   * Returns a promise that resolves when the script is loaded.
   * If the script is already loaded or loading, returns the existing promise.
   */
  static load(url: string): Promise<void> {
    const existing = this.loadedScripts.get(url);
    if (existing) {
      return existing;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${url}"]`);

      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = url;
      script.async = true;

      script.onload = () => {
        resolve();
      };

      script.onerror = () => {
        this.loadedScripts.delete(url);
        reject(new Error(`Failed to load script: ${url}`));
      };

      document.head.appendChild(script);
    });

    this.loadedScripts.set(url, promise);
    return promise;
  }

  static isLoaded(url: string): boolean {
    return this.loadedScripts.has(url);
  }

  /**
   * Clear the cache of loaded scripts. Tests that pre-seed a provider's
   * global SDK object (`window.YT`, `window.Vimeo`, ...) and a matching
   * `<script>` tag to avoid a real network request must call this in
   * `afterEach` - otherwise a later test silently inherits an earlier
   * test's resolved promise instead of exercising its own setup.
   */
  static clearCache(): void {
    this.loadedScripts.clear();
  }
}
