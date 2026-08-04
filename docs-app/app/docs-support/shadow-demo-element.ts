const STYLESHEET_SELECTOR = 'link[rel="stylesheet"]';
const TAG_NAME = 'carbon-shadow-demo';

/**
 * Style-isolates a live glimdown demo in its own shadow root, importing the
 * app's stylesheets (mirroring ember-primitives' `<Shadowed includeStyles>`)
 * so the isolated demo still picks up Carbon's styling.
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
