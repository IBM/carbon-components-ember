/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Ported from @carbon/ai-chat-components'
// src/components/markdown/src/plugins/markdown-it-task-lists.ts. A
// markdown-it plugin implementing GitHub-Flavored-Markdown task lists
// (`- [ ] foo`, `- [x] foo`). Emits `task_checkbox_open`/
// `task_checkbox_close` tokens; `-markdown-render.ts` registers the
// renderer rules for them (plain `<input type="checkbox">`, not upstream's
// `cds-checkbox` custom element - see that file for why).

import type MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token.mjs';

export function markdownItTaskLists(md: MarkdownIt) {
  md.core.ruler.after('inline', 'task-lists', (state) => {
    const tokens = state.tokens;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]!;

      if (token.type !== 'inline') {
        continue;
      }

      if (i < 2 || tokens[i - 2]!.type !== 'list_item_open') {
        continue;
      }

      const children = token.children;
      if (!children || children.length === 0) {
        continue;
      }

      const firstChild = children[0]!;
      if (firstChild.type !== 'text') {
        continue;
      }

      const match = firstChild.content.match(/^\[([ xX])\]\s+/);
      if (!match) {
        continue;
      }

      const checked = match[1] !== ' ';
      const listItemToken = tokens[i - 2]!;

      const attrs = listItemToken.attrs || [];
      const classIndex = attrs.findIndex(([key]) => key === 'class');
      if (classIndex >= 0) {
        attrs[classIndex]![1] += ' task-list-item';
      } else {
        attrs.push(['class', 'task-list-item']);
      }
      listItemToken.attrs = attrs;

      const checkboxOpenToken: Token = new state.Token(
        'task_checkbox_open',
        'cds-checkbox',
        1,
      );
      checkboxOpenToken.content = '';
      const itemLine = listItemToken.map?.[0];
      checkboxOpenToken.attrs = [
        ['checked', checked ? 'true' : 'false'],
        ['data-cds-aichat-checklist-id', String(itemLine ?? '')],
      ];

      const checkboxCloseToken: Token = new state.Token(
        'task_checkbox_close',
        'cds-checkbox',
        -1,
      );
      checkboxCloseToken.content = '';

      firstChild.content = firstChild.content.slice(match[0].length);

      children.unshift(checkboxOpenToken);
      children.push(checkboxCloseToken);
    }

    return false;
  });
}
