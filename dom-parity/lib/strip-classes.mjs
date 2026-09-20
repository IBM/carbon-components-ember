/**
 * Returns a deep copy of a tree produced by normalize-dom.mjs's
 * `normalizeElement` with every node's `classes` array replaced by `[]` and
 * its `part` attribute (if any) removed.
 *
 * Only used for the `carbon-ai-chat` DOM-parity source (see
 * test-app/tests/components/ai-chat/dom-parity-test.gts), not the `react`
 * one - both `classes` and `part` are shadow-DOM-specific styling hooks
 * with no Ember equivalent, not real structural/semantic differences:
 *
 * - `@carbon/ai-chat-components` renders into shadow DOM, so its class
 *   names are a locally-scoped styling implementation detail its own
 *   shadow-root stylesheet selects on (e.g. `.dots`); this addon renders in
 *   light DOM, so the Ember port intentionally uses unrelated, globally-
 *   scoped BEM class names instead (e.g. `cds-aichat-processing__dots`),
 *   since it has no shadow boundary to scope styles within - see
 *   AGENTS.md's "Porting Carbon AI Chat" section, point 3.
 * - `part="..."` is a CSS Shadow Parts hook (`::part()`), letting a page
 *   outside the shadow root style specific elements inside it. Ember has no
 *   shadow boundary to pierce, so it never needs (or renders) one.
 *
 * A literal diff on either would flag every element carrying one as a
 * failure, none of which are bugs - so both are excluded here. Tag
 * structure, every other attribute (role, aria-*, id references,
 * disabled/hidden/inert, ...), text, and SVG geometry are still compared
 * in full; a regression in the Ember port's own class names is covered by
 * that component's own style-snapshot/rendering tests instead, not by this
 * harness.
 */
export function stripClasses(tree) {
  if (!tree) return tree;
  if (tree.type === 'text') return tree;
  const { part, ...attributes } = tree.attributes;
  return {
    ...tree,
    classes: [],
    attributes,
    children: tree.children.map(stripClasses),
  };
}
