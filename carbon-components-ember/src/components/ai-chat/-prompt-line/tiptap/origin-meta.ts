/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Transaction } from '@tiptap/pm/state';

/**
 * Ported from `@carbon/ai-chat-components`' `tiptap/origin-meta.ts`,
 * unchanged. Tags a transaction as host-originated so a reader (the mention/
 * command removal plugin in `carbon-mention.ts`) can tell a user edit from a
 * host-driven `@content`/`clearContent()`/`insertContent()` call and skip
 * firing `onRemove` for the latter — symmetric with `onSelect` only firing
 * on user popup selection, never a programmatic insert.
 */
const HOST_ORIGIN_META_KEY = 'aichatOrigin';
const HOST_ORIGIN_VALUE = 'host';

export function setHostOriginMeta(tr: Transaction): Transaction {
  return tr.setMeta(HOST_ORIGIN_META_KEY, HOST_ORIGIN_VALUE);
}

export function isHostOrigin(tr: Transaction): boolean {
  return tr.getMeta(HOST_ORIGIN_META_KEY) === HOST_ORIGIN_VALUE;
}
