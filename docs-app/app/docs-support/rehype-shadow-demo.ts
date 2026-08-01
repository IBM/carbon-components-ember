interface RawNode {
  type: 'raw';
  value: string;
}

interface LiveCodeEntry {
  placeholderId: string;
  meta?: string;
}

interface VFileLike {
  data?: { liveCode?: LiveCodeEntry[] };
}

// Matches the placeholder repl-sdk's gmd compiler emits (as raw HTML, via
// its internal `liveCodeExtraction` remark plugin) for each live demo, e.g.
// `<div id="repl_3" class="repl-sdk__demo"></div>`.
const PLACEHOLDER_PATTERN = /^<div id="([^"]+)" class="([^"]*)"><\/div>$/;

function isRawNode(node: unknown): node is RawNode {
  return (
    typeof node === 'object' &&
    node !== null &&
    (node as { type?: unknown }).type === 'raw' &&
    typeof (node as { value?: unknown }).value === 'string'
  );
}

function forEachRawNode(node: unknown, visit: (node: RawNode) => void) {
  if (isRawNode(node)) visit(node);

  const children = (node as { children?: unknown[] } | undefined)?.children;

  if (Array.isArray(children)) {
    for (const child of children) forEachRawNode(child, visit);
  }
}

/**
 * Opt-in rehype plugin that restores shadow-DOM style isolation for live
 * glimdown demos, without needing to patch repl-sdk itself.
 *
 * ember-repl 6.x used to wrap every live demo's invocation in a
 * `ShadowComponent`, but ember-repl 8.x's rewrite (via repl-sdk) grafts
 * compiled demos into a placeholder element as an independent step, with no
 * invocation left to wrap - dropping that isolation.
 *
 * Rather than teaching repl-sdk's compiler about shadow roots, this plugin
 * renames each live demo's placeholder tag to `<carbon-shadow-demo>` (a
 * custom element registered in `shadow-demo-element.ts`), which performs the
 * actual `attachShadow` + style-import once the demo's rendered element is
 * appended into it. Fences marked `no-shadow` are left as plain `<div>`s.
 */
export function rehypeShadowDemo() {
  return (tree: unknown, file: VFileLike) => {
    const liveCode = file.data?.liveCode ?? [];
    const shadowed = new Set(
      liveCode
        .filter((entry) => !entry.meta?.includes('no-shadow'))
        .map((entry) => entry.placeholderId)
    );

    if (shadowed.size === 0) return;

    forEachRawNode(tree, (node) => {
      const match = node.value.match(PLACEHOLDER_PATTERN);

      if (!match) return;

      const [, id, className] = match;

      if (!id || !shadowed.has(id)) return;

      node.value = `<carbon-shadow-demo id="${id}" class="${className}"></carbon-shadow-demo>`;
    });
  };
}
