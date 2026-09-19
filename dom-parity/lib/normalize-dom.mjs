/**
 * Normalizes a rendered DOM subtree into a plain, JSON-serializable shape so
 * a React render (Node/jsdom) and an Ember render (real browser, via
 * ember-qunit's `render()`) can be diffed for structural/attribute parity.
 *
 * Only standard DOM APIs are used (nodeType, attributes, childNodes,
 * classList) so this file works unmodified in both jsdom and a real
 * browser - do not import anything environment-specific here.
 */

// Attributes whose mere presence is the signal, not their string value.
// React omits `disabled={false}` entirely; Ember/HTML may render
// `disabled=""` or `disabled="disabled"` for a true value - normalize both
// sides to "attribute present" and drop it entirely when false/absent so
// the two conventions compare equal.
const BOOLEAN_ATTRIBUTES = new Set([
  'disabled',
  'checked',
  'required',
  'readonly',
  'hidden',
  'multiple',
  'selected',
  'autofocus',
]);

// Attributes that reference one or more `id` values elsewhere in the
// document. Their value is a (possibly space-separated) list of ids that
// must be rewritten through the same id -> canonical-token map as the ids
// themselves, so a real link (e.g. aria-describedby pointing at a live id)
// still compares equal even though the concrete generated id differs
// between frameworks.
const ID_REF_ATTRIBUTES = new Set([
  'aria-labelledby',
  'aria-describedby',
  'aria-controls',
  'aria-owns',
  'aria-activedescendant',
  'aria-flowto',
  'aria-details',
  'for',
  'list',
]);

function isElement(node) {
  return node && node.nodeType === 1;
}

function isText(node) {
  return node && node.nodeType === 3;
}

function parseStyle(styleValue) {
  const style = {};
  if (!styleValue) return style;
  for (const decl of styleValue.split(';')) {
    const idx = decl.indexOf(':');
    if (idx === -1) continue;
    const prop = decl.slice(0, idx).trim().toLowerCase();
    const value = decl.slice(idx + 1).trim();
    if (!prop || !value) continue;
    style[prop] = value;
  }
  return style;
}

/**
 * Collects every `id` attribute in the subtree, in document order, and
 * returns a Map from the original id value to a canonical `#1`, `#2`, ...
 * token. Canonicalizing (rather than deleting) ids preserves the
 * information of *whether* something is id-referenced at all - a missing
 * aria-describedby link is a real parity bug, and simply stripping ids
 * would hide it.
 */
function collectIdMap(root) {
  const map = new Map();
  let counter = 0;
  const walk = (node) => {
    if (!isElement(node)) return;
    const id = node.getAttribute('id');
    if (id && !map.has(id)) {
      counter += 1;
      map.set(id, `#${counter}`);
    }
    for (const child of node.childNodes) walk(child);
  };
  walk(root);
  return map;
}

function canonicalizeIdRefs(value, idMap) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => idMap.get(token) ?? token)
    .join(' ');
}

const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

function normalizeAttributes(el, idMap) {
  // Unlike HTML, SVG (and other foreign-content) attribute names are
  // case-sensitive (`viewBox`, `preserveAspectRatio`, `gradientTransform`,
  // ...) - a real browser ignores `viewbox` entirely. Only fold case for
  // elements in the HTML namespace, so a case bug on either side (e.g.
  // rendering `viewbox` instead of `viewBox`) still shows up as a diff
  // instead of silently normalizing to the same key on both sides.
  const isHtml = !el.namespaceURI || el.namespaceURI === HTML_NAMESPACE;
  const attributes = {};
  for (const attr of Array.from(el.attributes)) {
    const name = isHtml ? attr.name.toLowerCase() : attr.name;
    if (name.toLowerCase() === 'class' || name.toLowerCase() === 'style')
      continue;

    if (BOOLEAN_ATTRIBUTES.has(name)) {
      // Presence-only: a "false"/"" HTML boolean attribute is still
      // "present" per the HTML spec, so any non-absent value normalizes to
      // `true`. Genuinely absent attributes never reach this loop.
      attributes[name] = true;
      continue;
    }

    if (name === 'id') {
      attributes[name] = idMap.get(attr.value) ?? attr.value;
      continue;
    }

    if (ID_REF_ATTRIBUTES.has(name)) {
      attributes[name] = canonicalizeIdRefs(attr.value, idMap);
      continue;
    }

    attributes[name] = attr.value;
  }
  return attributes;
}

function normalizeNode(node, idMap) {
  if (isText(node)) {
    const text = node.textContent.replace(/\s+/g, ' ').trim();
    return text ? { type: 'text', text } : null;
  }

  if (!isElement(node)) return null;

  const classes = Array.from(node.classList).sort();
  const attributes = normalizeAttributes(node, idMap);
  const style = parseStyle(node.getAttribute('style'));
  const children = Array.from(node.childNodes)
    .map((child) => normalizeNode(child, idMap))
    .filter(Boolean);

  return {
    type: 'element',
    tag: node.tagName.toLowerCase(),
    classes,
    attributes,
    style,
    children,
  };
}

/** Normalizes a single root element (and its subtree) for comparison. */
export function normalizeElement(root) {
  const idMap = collectIdMap(root);
  return normalizeNode(root, idMap);
}
