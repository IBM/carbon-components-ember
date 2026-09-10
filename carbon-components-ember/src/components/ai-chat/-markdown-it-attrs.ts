/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 *  Ported from @carbon/ai-chat-components'
 *  src/components/markdown/src/plugins/markdown-it-attrs.ts, which is
 *  itself based on markdown-it-attrs by Arve Seljebu
 *  (https://github.com/arve0/markdown-it-attrs), MIT licensed:
 *
 *  Copyright (c) Arve Seljebu <arve.seljebu@gmail.com> (arve0.github.io)
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 *
 *  ---
 *
 *  Carbon AI Chat's fork covers only its documented attribute syntax:
 *
 *    [link](url){{target=_blank rel=noopener}}
 *    # Heading {{id=foo}}
 *    Paragraph {{class=bar}}
 *
 *  Delimiters are fixed to `{{`/`}}` and only `target`, `rel`, `class`, `id`
 *  are applied; any other attribute key is silently dropped. Ported
 *  unchanged - this allow-list is a deliberate safety property (no
 *  `href`/`src`/`on*` override), not just an upstream simplification.
 */

import type MarkdownIt from 'markdown-it';
import type { Token } from 'markdown-it';

const LEFT = '{{';
const RIGHT = '}}';
const ALLOWED = new Set(['target', 'rel', 'class', 'id']);

type AttrPair = [string, string];

function parseAttrs(body: string): AttrPair[] {
  const attrs: AttrPair[] = [];
  let key = '';
  let value = '';
  let parsingKey = true;
  let inQuotes = false;

  const commit = () => {
    if (key !== '' && ALLOWED.has(key)) {
      attrs.push([key, value]);
    }
    key = '';
    value = '';
    parsingKey = true;
  };

  for (let i = 0; i < body.length; i++) {
    const ch = body.charAt(i);

    if (ch === '=' && parsingKey) {
      parsingKey = false;
      continue;
    }
    if (ch === '"' && !parsingKey) {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ' ' && !inQuotes) {
      commit();
      continue;
    }
    if (parsingKey) {
      key += ch;
    } else {
      value += ch;
    }
  }
  commit();

  return attrs;
}

function applyAttrs(token: Token, attrs: AttrPair[]): void {
  for (const [key, value] of attrs) {
    if (key === 'class') {
      token.attrJoin('class', value);
    } else {
      token.attrPush([key, value]);
    }
  }
}

function findMatchingOpen(tokens: Token[], closeIndex: number): Token | null {
  const close = tokens[closeIndex]!;
  const openType = close.type.replace(/_close$/, '_open');
  for (let i = closeIndex - 1; i >= 0; i--) {
    if (tokens[i]!.type === openType && tokens[i]!.level === close.level) {
      return tokens[i]!;
    }
  }
  return null;
}

function handleInlineAttributes(inlineToken: Token): boolean {
  const children = inlineToken.children;
  if (!children) {
    return false;
  }

  for (let i = 1; i < children.length; i++) {
    const prev = children[i - 1]!;
    const curr = children[i]!;
    if (prev.nesting !== -1 || curr.type !== 'text') {
      continue;
    }
    if (!curr.content.startsWith(LEFT)) {
      continue;
    }
    const closeIdx = curr.content.indexOf(RIGHT, LEFT.length);
    if (closeIdx === -1) {
      continue;
    }

    const openToken = findMatchingOpen(children, i - 1);
    if (!openToken) {
      continue;
    }

    const body = curr.content.slice(LEFT.length, closeIdx);
    applyAttrs(openToken, parseAttrs(body));

    const remainder = curr.content.slice(closeIdx + RIGHT.length);
    if (remainder.length === 0) {
      children.splice(i, 1);
    } else {
      curr.content = remainder;
    }
    return true;
  }

  return false;
}

function handleEndOfBlock(tokens: Token[], inlineIndex: number): void {
  const children = tokens[inlineIndex]!.children;
  if (!children || children.length === 0) {
    return;
  }
  const last = children[children.length - 1]!;
  if (last.type !== 'text' || !last.content.endsWith(RIGHT)) {
    return;
  }
  const openIdx = last.content.lastIndexOf(LEFT);
  if (openIdx === -1) {
    return;
  }

  let closeIdx = -1;
  for (let i = inlineIndex + 1; i < tokens.length; i++) {
    if (tokens[i]!.nesting === -1) {
      closeIdx = i;
      break;
    }
  }
  if (closeIdx === -1) {
    return;
  }

  const openToken = findMatchingOpen(tokens, closeIdx);
  if (!openToken) {
    return;
  }

  const body = last.content.slice(
    openIdx + LEFT.length,
    last.content.length - RIGHT.length,
  );
  applyAttrs(openToken, parseAttrs(body));

  let trimmed = last.content.slice(0, openIdx);
  if (trimmed.endsWith(' ')) {
    trimmed = trimmed.slice(0, -1);
  }
  last.content = trimmed;
}

export function markdownItAttrs(md: MarkdownIt): void {
  md.core.ruler.before('linkify', 'curly_attributes', (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i]!.type !== 'inline') {
        continue;
      }
      while (handleInlineAttributes(tokens[i]!)) {
        // Loop until no more link-attribute pairs remain on this inline token.
      }
      handleEndOfBlock(tokens, i);
    }
  });
}
