/**
 * Resolves a real custom element's *composed* (shadow-DOM-flattened) tree
 * into a plain, detached DOM subtree, so `normalizeElement` (see
 * normalize-dom.mjs) - which only ever walks `.childNodes`/`.classList` and
 * never crosses a shadow boundary or resolves a `<slot>` on its own - can be
 * reused completely unmodified against it.
 *
 * This mirrors the browser's own "flattened tree" used for rendering: a
 * shadow host's light-DOM children are replaced by its shadow root's
 * rendered content, and a `<slot>` within that content is replaced by
 * whatever it assigns (or its own fallback content, when nothing is
 * assigned) - resolved recursively, since assigned/fallback content can
 * itself be a custom element with its own shadow root (e.g. a
 * `cds-aichat-reasoning-step` slotted into `cds-aichat-reasoning-steps`).
 *
 * One extra step beyond a literal "flattened tree", specific to comparing
 * against this addon's Ember port: every `@carbon/ai-chat-components`
 * component is its own light-DOM custom-element *host* wrapping a shadow
 * root, where the Ember port has no such wrapper at all - a ported
 * component's own template root directly *is* the comparable node (see
 * AGENTS.md's "Porting Carbon AI Chat" section; Ember has no light-DOM
 * custom-element concept to mirror). So whenever flattening reaches an
 * element with a shadow root - not just at the very top - it is unwrapped:
 * replaced by its shadow root's own single rendered root element. Without
 * this, comparing a nested step would fail on `tag` alone
 * (`cds-aichat-reasoning-step` vs. Ember's `div`) before ever reaching the
 * interesting content inside.
 *
 * The host element's *own* light-DOM attributes are deliberately dropped,
 * not folded onto the unwrapped root - a first version tried merging them
 * in, and it produced false positives, not real coverage: an attribute set
 * purely to *configure* the element (e.g. this test's own
 * `host.setAttribute('title', ...)`, or a Lit `@property({reflect: true})`
 * like `reasoning-steps`' `open`/`controlled`) remains a literal light-DOM
 * attribute on the host regardless of whether the component's own render
 * output uses it, and is indistinguishable, via plain DOM APIs, from a
 * genuine output attribute the component sets on itself imperatively
 * (`reasoning-step`'s `connectedCallback`-applied `role="listitem"`).
 * Ember never reflects an arg onto its rendered root as a DOM attribute
 * either way, so merging host attributes made every configuration input
 * look like a spurious extra attribute on the Ember side. The one real
 * cost of dropping this entirely: a host-imperative attribute like
 * `reasoning-step`'s `role="listitem"` is no longer checked by this
 * harness (verified by hand instead, when each variant was added) - a
 * narrower guarantee than the `react` source's, documented here rather
 * than silently assumed.
 *
 * Only standard DOM APIs are used, matching normalize-dom.mjs's own
 * constraint - this file is meant to run in a real browser (Playwright/
 * Chromium, via test-app's QUnit suite), not jsdom, since it depends on
 * `assignedNodes()`/shadow DOM being live and connected to a document.
 */

function isElement(node) {
  return node != null && node.nodeType === 1;
}

function isFragmentLike(node) {
  // DocumentFragment (11) and ShadowRoot (also nodeType 11) both expose
  // .childNodes with no element/attributes of their own to preserve.
  return node != null && node.nodeType === 11;
}

function flattenChildren(parent, target) {
  for (const child of Array.from(parent.childNodes)) {
    const flattened = flattenComposedTree(child);
    if (flattened) target.appendChild(flattened);
  }
}

function firstAndOnlyElementChild(fragment, describeFor) {
  const elementChildren = Array.from(fragment.childNodes).filter(isElement);
  if (elementChildren.length > 1) {
    throw new Error(
      `flattenComposedTree: expected exactly one rendered root element in ${describeFor}'s ` +
        `shadow root, got ${elementChildren.length}`,
    );
  }
  return elementChildren[0] ?? null;
}

/**
 * @param {Node} node - an Element, ShadowRoot, DocumentFragment, Text, or
 *   Comment node from a live, connected document.
 * @returns {Node | null} a detached clone with shadow content/slots already
 *   resolved, or `null` for a node type normalizeElement would ignore
 *   anyway (kept simple here rather than filtered, since normalizeNode
 *   already drops non-text/non-element nodes on its own), or when an
 *   unwrapped shadow host rendered nothing at all.
 */
export function flattenComposedTree(node) {
  if (node.nodeType === 3 || node.nodeType === 8) {
    // Text / comment: no shadow content or slots to resolve.
    return node.cloneNode(true);
  }

  if (isFragmentLike(node)) {
    const fragment = document.createDocumentFragment();
    flattenChildren(node, fragment);
    return fragment;
  }

  if (!isElement(node)) return null;

  const tagName = node.tagName.toLowerCase();

  if (tagName === 'slot') {
    const assigned = node.assignedNodes({ flatten: true });
    const fragment = document.createDocumentFragment();
    if (assigned.length > 0) {
      for (const assignedNode of assigned) {
        const flattened = flattenComposedTree(assignedNode);
        if (flattened) fragment.appendChild(flattened);
      }
    } else {
      // Nothing assigned - fall back to the <slot>'s own fallback content.
      flattenChildren(node, fragment);
    }
    return fragment;
  }

  if (node.shadowRoot) {
    const shadowContent = flattenComposedTree(node.shadowRoot);
    return firstAndOnlyElementChild(shadowContent, tagName);
  }

  const clone = node.cloneNode(false); // tag + attributes only, no children
  flattenChildren(node, clone);
  return clone;
}

/**
 * Collects every custom element (host tag containing a hyphen) reachable
 * from `root` - through light-DOM children, shadow roots, and already-
 * resolved `<slot>` assignments alike - so their upgrade/render can be
 * awaited before normalizing. `root` itself is included when it qualifies.
 */
function collectCustomElements(root, seen = new Set()) {
  const visit = (node) => {
    if (!node || seen.has(node)) return;
    if (isElement(node)) {
      if (node.tagName.includes('-')) seen.add(node);
      if (node.shadowRoot) for (const child of node.shadowRoot.childNodes) visit(child);
      for (const child of node.childNodes) visit(child);
    } else if (isFragmentLike(node)) {
      for (const child of node.childNodes) visit(child);
    }
  };
  visit(root);
  return Array.from(seen);
}

/**
 * Waits for every custom element in `root`'s composed tree to be defined
 * and, for Lit elements, for its first render to settle - repeating until
 * the set of discovered custom elements stops growing, since an element's
 * own first render can be what introduces further nested custom elements
 * (e.g. `cds-aichat-launcher` rendering a `cds-aichat-chat-button` into its
 * own shadow content only becomes visible in the DOM after its first
 * `updateComplete`).
 *
 * Bounded at 10 passes so a genuine bug (an element that never settles)
 * fails the test loudly instead of hanging the suite.
 */
export async function waitForCustomElementsReady(root) {
  let previousCount = -1;
  for (let pass = 0; pass < 10; pass++) {
    const elements = collectCustomElements(root);
    await Promise.all(
      elements.map((element) => customElements.whenDefined(element.tagName.toLowerCase())),
    );
    await Promise.all(
      elements
        .filter((element) => typeof element.updateComplete?.then === 'function')
        .map((element) => element.updateComplete),
    );
    if (elements.length === previousCount) return;
    previousCount = elements.length;
  }
  throw new Error(
    'waitForCustomElementsReady: custom element set kept growing after 10 passes - ' +
      'likely a genuinely unsettled element rather than nested lazy registration.',
  );
}
