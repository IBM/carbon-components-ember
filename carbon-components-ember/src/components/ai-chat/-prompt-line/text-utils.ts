/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { JSONContent } from '@tiptap/core';

/**
 * Ported from `@carbon/ai-chat-components`' `tiptap/json-utils.ts`, trimmed
 * to the plain-text-only subset this port needs (`textToDoc` never
 * reconstructs a `mention`/`command` node from plain text — there's no
 * trigger character to parse back out of a bare string — so a rebuild that
 * round-trips a doc containing chips through `getRawText`/`textToDoc`
 * degrades them to plain text rather than preserving them as live nodes;
 * see `rich-controller.ts`'s `recreateEditor`). `getRawText`'s `default`
 * case *does* still project any atom node carrying `attrs.value`/`label`
 * (mention/command chips) to that text, matching upstream exactly — an
 * earlier version of this port dropped that case since mention/command
 * extensions weren't accepted yet, which silently lost a chip's text
 * entirely on any rebuild instead of merely flattening it. `import type`
 * only, so pulling this file in doesn't force a real `@tiptap/core` import —
 * `JSONContent` is erased at build time, keeping these functions usable
 * from the eagerly-loaded textarea controller.
 */

/**
 * Build a paragraph-per-line JSONContent doc from a plain-text string — the
 * inverse of {@link getRawText} for plain text. Used to seed the rich editor
 * losslessly from the textarea's value when `@rich` upgrades the surface
 * mid-session.
 */
export function textToDoc(text: string): JSONContent {
  return {
    type: 'doc',
    content: text
      .split('\n')
      .map((line) =>
        line
          ? { type: 'paragraph', content: [{ type: 'text', text: line }] }
          : { type: 'paragraph' },
      ),
  };
}

/**
 * Project a JSONContent doc to a plain-text string — the inverse of
 * {@link textToDoc}. Paragraph boundaries become `"\n"` (excluding the
 * trailing one); `hardBreak` nodes contribute `"\n"`.
 */
export function getRawText(json: JSONContent): string {
  const parts: string[] = [];
  collect(json, parts, { count: 0 });
  return parts.join('');
}

function collect(node: JSONContent, out: string[], paragraphIndex: { count: number }) {
  switch (node.type) {
    case 'text':
      out.push(node.text ?? '');
      return;
    case 'hardBreak':
      out.push('\n');
      return;
    case 'paragraph':
      if (paragraphIndex.count > 0) {
        out.push('\n');
      }
      paragraphIndex.count += 1;
      node.content?.forEach((child) => collect(child, out, paragraphIndex));
      return;
    case 'doc':
      node.content?.forEach((child) => collect(child, out, paragraphIndex));
      return;
    default: {
      // Atom nodes like mention/command — pull `value` (or `label`) off attrs.
      const attrs = (node.attrs ?? {}) as Record<string, unknown>;
      const value = typeof attrs['value'] === 'string' ? attrs['value'] : null;
      const label = typeof attrs['label'] === 'string' ? attrs['label'] : null;
      if (value !== null || label !== null) {
        out.push(value ?? label ?? '');
        return;
      }
      node.content?.forEach((child) => collect(child, out, paragraphIndex));
    }
  }
}

/**
 * Map a plain-text offset into a ProseMirror position inside the doc
 * {@link textToDoc} builds from the same text — one paragraph per line, so a
 * position costs +1 for the doc/first-paragraph start plus +1 for every
 * newline before it, each of which opens another paragraph. Change
 * `textToDoc` and this has to change with it.
 */
export function textOffsetToDocPos(text: string, offset: number): number {
  return offset + 1 + (text.slice(0, offset).split('\n').length - 1);
}
