const TAG_NAME = 'carbon-shadow-demo';

/**
 * Style-isolates a live glimdown demo in its own shadow root.
 *
 * Nothing is imported into the shadow root on our behalf: this used to copy
 * the document's `<link rel="stylesheet">` tags in as `@import`s (mirroring
 * ember-primitives' `<Shadowed includeStyles>`), but that was dropped again
 * because the demos that need Carbon's CSS already inline it themselves --
 * they render `<ThemeSupport />` (see `theme-support.gts`), which emits a
 * `<style>` with the Carbon stylesheets *inside* the demo, and therefore
 * inside this shadow root. Theme tokens defined on `:root` reach here too,
 * since custom properties inherit through the shadow boundary.
 *
 * repl-sdk's gmd compiler renders each demo by `appendChild`-ing it into the
 * placeholder element some time after this element connects (see
 * `rehype-shadow-demo.ts`, which is what causes this element to exist in the
 * placeholder's place to begin with) - so children can't be assumed to exist
 * in `connectedCallback` and are instead re-parented into the shadow root as
 * they arrive, via `MutationObserver`.
 */
class CarbonShadowDemo extends HTMLElement {
  #observer?: MutationObserver;

  connectedCallback() {
    if (this.shadowRoot) return;

    const shadowRoot = this.attachShadow({ mode: 'open' });

    for (const child of [...this.childNodes]) {
      shadowRoot.appendChild(child);
    }

    this.#observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          shadowRoot.appendChild(node);
        }
      }
    });

    this.#observer.observe(this, { childList: true });
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#observer = undefined;
  }
}

export function registerShadowDemoElement() {
  if (customElements.get(TAG_NAME)) return;

  customElements.define(TAG_NAME, CarbonShadowDemo);
}
