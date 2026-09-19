/**
 * Diffs two trees produced by `normalizeElement` (see normalize-dom.mjs)
 * and returns a flat list of differences. Each difference carries a `path`
 * (e.g. `div > svg[1].classes`) so a known, accepted gap can be silenced by
 * an exact or prefix match in the known-differences allowlist rather than
 * by skipping the whole component.
 */

function describeNode(node) {
  if (!node) return '(missing)';
  if (node.type === 'text') return `text("${node.text}")`;
  return node.tag;
}

function diffArray(prefix, key, a, b, out) {
  const aSet = new Set(a);
  const bSet = new Set(b);
  for (const value of a) {
    if (!bSet.has(value)) {
      out.push({ path: `${prefix}.${key}[${value}]`, kind: `${key}-missing`, detail: value });
    }
  }
  for (const value of b) {
    if (!aSet.has(value)) {
      out.push({ path: `${prefix}.${key}[${value}]`, kind: `${key}-extra`, detail: value });
    }
  }
}

function diffRecord(prefix, key, a, b, out) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  for (const k of aKeys) {
    if (!(k in b)) {
      out.push({ path: `${prefix}.${key}.${k}`, kind: `${key}-missing`, detail: a[k] });
    } else if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) {
      out.push({
        path: `${prefix}.${key}.${k}`,
        kind: `${key}-value`,
        detail: { react: a[k], ember: b[k] },
      });
    }
  }
  for (const k of bKeys) {
    if (!(k in a)) {
      out.push({ path: `${prefix}.${key}.${k}`, kind: `${key}-extra`, detail: b[k] });
    }
  }
}

function diffNode(react, ember, path, out) {
  if (!react || !ember) {
    if (react !== ember) {
      out.push({
        path,
        kind: 'node-presence',
        detail: { react: describeNode(react), ember: describeNode(ember) },
      });
    }
    return;
  }

  if (react.type !== ember.type) {
    out.push({
      path,
      kind: 'node-type',
      detail: { react: react.type, ember: ember.type },
    });
    return;
  }

  if (react.type === 'text') {
    if (react.text !== ember.text) {
      out.push({ path, kind: 'text', detail: { react: react.text, ember: ember.text } });
    }
    return;
  }

  if (react.tag !== ember.tag) {
    out.push({ path, kind: 'tag', detail: { react: react.tag, ember: ember.tag } });
    return;
  }

  diffArray(path, 'classes', react.classes, ember.classes, out);
  diffRecord(path, 'attributes', react.attributes, ember.attributes, out);
  diffRecord(path, 'style', react.style, ember.style, out);

  const max = Math.max(react.children.length, ember.children.length);
  for (let i = 0; i < max; i++) {
    const childPath = `${path} > ${describeNode(react.children[i] ?? ember.children[i])}[${i}]`;
    diffNode(react.children[i] ?? null, ember.children[i] ?? null, childPath, out);
  }
}

/** Returns a flat array of `{ path, kind, detail }` differences. */
export function diffNormalized(reactTree, emberTree) {
  const out = [];
  diffNode(reactTree, emberTree, reactTree?.tag ?? emberTree?.tag ?? 'root', out);
  return out;
}

/**
 * Filters out differences matched by the known-differences allowlist for a
 * given component. An entry matches when its `path` is an exact match or a
 * prefix (`path + " "` or `path + "."`) of the difference's path.
 */
export function applyKnownDifferences(differences, knownDifferences) {
  return differences.filter((diff) => {
    return !knownDifferences.some((known) => {
      if (known.path === diff.path) return true;
      return diff.path.startsWith(`${known.path} `) || diff.path.startsWith(`${known.path}.`);
    });
  });
}
