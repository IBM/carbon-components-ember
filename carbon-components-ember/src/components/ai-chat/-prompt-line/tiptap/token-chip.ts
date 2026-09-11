/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Node as PMNode } from '@tiptap/pm/model';
import type { NodeView } from '@tiptap/pm/view';

/**
 * Ported from `@carbon/ai-chat-components`' `tiptap/token-node-view.ts` +
 * `tiptap/render-token-chip.ts`, cut to the default-chip path only. Upstream
 * also accepts a `renderCustomToken` that returns an `HTMLElement`/
 * `ReactNode`, bridged into the page's light DOM via a shadow-DOM portal
 * handshake (`render-in-light-dom.ts`) so a React-rendered chip can escape
 * the chat's shadow root and pick up the page's stylesheet. This addon
 * renders in light DOM already (no shadow root to escape), but a Tiptap
 * `NodeView`'s `dom` must exist synchronously when ProseMirror constructs
 * it — there's no way to synchronously render a Glimmer component into it,
 * so a `renderCustomToken`-equivalent needs its own `{{in-element}}`-driven
 * design, not a port of upstream's portal. Left as a documented gap, not a
 * silently-ignored arg: this port doesn't accept a custom-chip callback at
 * all.
 */
export interface TokenChipAttrs {
  /** Identifier of the item the chip came from. */
  id?: string;
  /** Text shown on the chip. */
  label?: string;
  /** String the chip contributes to the message text. Falls back to `label`. */
  value?: string;
  /** Trigger character prefixed onto the chip text (e.g. `/summarize` vs `summarize`). */
  trigger?: string | null;
}

function createDefaultChip(attrs: TokenChipAttrs): HTMLElement {
  const chip = document.createElement('span');
  const label = typeof attrs.label === 'string' ? attrs.label : null;
  const value = typeof attrs.value === 'string' ? attrs.value : null;
  const trigger = typeof attrs.trigger === 'string' ? attrs.trigger : '';
  chip.textContent = `${trigger}${label || value || ''}`;
  return chip;
}

export function renderTokenChip(attrs: TokenChipAttrs, type: string): HTMLElement {
  const value = typeof attrs.value === 'string' ? attrs.value : null;
  const label = typeof attrs.label === 'string' ? attrs.label : null;
  const dom = document.createElement('span');
  dom.setAttribute('contenteditable', 'false');
  dom.setAttribute('data-token-type', type);
  dom.setAttribute('data-raw-value', value ?? label ?? '');
  dom.className = 'cds-aichat--token';
  dom.appendChild(createDefaultChip(attrs));
  return dom;
}

/** Tiptap's `NodeView` for inline tokens (mentions, commands). */
export class CarbonTokenNodeView implements NodeView {
  dom: HTMLElement;

  constructor(node: PMNode) {
    this.dom = renderTokenChip(node.attrs, node.type.name);
  }

  stopEvent(): boolean {
    return true;
  }

  ignoreMutation(): boolean {
    return true;
  }

  /** Atomic: PM does not track interior content. */
  get contentDOM(): null {
    return null;
  }
}
