/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { JSONContent } from '@tiptap/core';

/**
 * Ported from `@carbon/ai-chat-components`' `tiptap/json-utils.ts`, trimmed
 * to the plain-text-only subset this port needs (no `mention`/`command`
 * atom-node projection — this port doesn't accept structured `content` or
 * mention extensions). `import type` only, so pulling this file in doesn't
 * force a real `@tiptap/core` import — `JSONContent` is erased at build
 * time, keeping these functions usable from the eagerly-loaded textarea
 * controller.
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
    default:
      node.content?.forEach((child) => collect(child, out, paragraphIndex));
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
