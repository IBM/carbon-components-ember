/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Editor } from '@tiptap/core';
import type { PluginKey } from '@tiptap/pm/state';
import { exitSuggestion } from '@tiptap/suggestion';
import type { SuggestionItem } from './types.ts';

/**
 * New in this port — no upstream equivalent. Upstream's own suggestion
 * popup UI (`autocomplete-controller.ts` / `<cds-aichat-autocomplete>`,
 * deliberately not ported — see `PromptLine`'s class doc) lives *inside*
 * each factory's `render()` closure, so it always has `props.command`
 * (the only way `@tiptap/suggestion` exposes "complete this suggestion")
 * in scope already. This port has no such popup, so `props.command` (and
 * the plugin's own `pluginKey`, needed to target `exitSuggestion` at the
 * right one when more than one trigger is installed) are stashed here
 * instead, keyed by editor, so `PromptLine.selectSuggestion()`/
 * `dismissSuggestion()` can reach whichever trigger is currently active
 * without a host ever touching Tiptap internals.
 */
interface ActiveSuggestion {
  command: (item: SuggestionItem) => void;
  pluginKey: PluginKey;
}

const activeByEditor = new WeakMap<Editor, ActiveSuggestion>();

export function registerSuggestionCommand(
  editor: Editor,
  pluginKey: PluginKey,
  command: (item: SuggestionItem) => void,
): void {
  activeByEditor.set(editor, { command, pluginKey });
}

/** No-ops unless `pluginKey` is still the one currently registered — avoids one trigger's `onExit` clobbering another's just-started state. */
export function unregisterSuggestionCommand(editor: Editor, pluginKey: PluginKey): void {
  if (activeByEditor.get(editor)?.pluginKey === pluginKey) {
    activeByEditor.delete(editor);
  }
}

export function hasActiveSuggestion(editor: Editor): boolean {
  return activeByEditor.has(editor);
}

/** Completes the active mention/command/autocomplete trigger with `item`. Returns `false` if none is active. */
export function selectActiveSuggestion(editor: Editor, item: SuggestionItem): boolean {
  const active = activeByEditor.get(editor);
  if (!active) {
    return false;
  }
  active.command(item);
  return true;
}

/**
 * Closes the active trigger without selecting, via `@tiptap/suggestion`'s
 * own `exitSuggestion` (a metadata-only transaction — doesn't touch the
 * document, so it can't cause a mapping error). Returns `false` if none is
 * active.
 */
export function dismissActiveSuggestion(editor: Editor): boolean {
  const active = activeByEditor.get(editor);
  if (!active) {
    return false;
  }
  exitSuggestion(editor.view, active.pluginKey);
  return true;
}
