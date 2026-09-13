/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';
import { registerSuggestionCommand, unregisterSuggestionCommand } from './active-suggestion.ts';
import { dispatchTriggerChange } from './trigger-utils.ts';
import type { AutocompleteConfig, SuggestionItem } from './types.ts';

/**
 * Ported from `@carbon/ai-chat-components`' `tiptap/carbon-autocomplete.ts`,
 * unchanged in substance. Wraps `@tiptap/suggestion` directly (no `Mention`
 * node) — selection inserts plain text rather than a schema node. Activates
 * whenever the input has any non-empty trailing word.
 */

/**
 * A trigger character that autocomplete stands down for, so a co-installed
 * mention or command picker wins while its trigger is active.
 */
export interface ExcludedTrigger {
  /** The character to stand down for, e.g. `"@"` or `"/"`. */
  char: string;
  /** `'anywhere'` stands down for any word starting with it; `'start'` only at the start of the line. */
  position: 'anywhere' | 'start';
}

export function carbonAutocomplete(config: AutocompleteConfig, excludeTriggers: ExcludedTrigger[] = []): Extension {
  const pluginKey = new PluginKey('carbonAutocompleteSuggestion');

  return Extension.create({
    name: 'carbonAutocomplete',

    addProseMirrorPlugins() {
      const editor = this.editor;
      let lastQuery: string | null = null;

      return [
        Suggestion<SuggestionItem>({
          editor,
          char: '',
          pluginKey,
          allowedPrefixes: null,
          findSuggestionMatch: ({ $position }) => {
            const text = $position.parent.textBetween(0, $position.parentOffset, '\n', '\0');
            if (!text || text.length === 0) {
              return null;
            }
            const trailing = /\S+$/.exec(text);
            if (!trailing) {
              return null;
            }
            const query = trailing[0];
            for (const excluded of excludeTriggers) {
              if (!query.startsWith(excluded.char)) {
                continue;
              }
              if (excluded.position === 'anywhere') {
                return null;
              }
              if (text === query) {
                return null;
              }
            }
            const matchStart = $position.start() + $position.parentOffset - query.length;
            return {
              range: { from: matchStart, to: $position.start() + $position.parentOffset },
              query,
              text: query,
            };
          },
          items: ({ query }) => resolveItems(config, query),
          command: ({ editor: ed, range, props }) => {
            const item = props as SuggestionItem;
            const insertText = item.value ?? item.label;
            ed.chain().focus().insertContentAt(range, [{ type: 'text', text: insertText }]).run();
            config.onSelect?.(item);
          },
          render: () => ({
            onStart: (props) => {
              registerSuggestionCommand(props.editor, pluginKey, props.command);
              lastQuery = props.query;
              dispatchTriggerChange(props.editor, {
                type: 'autocomplete',
                query: props.query,
                triggerOffset: props.range.from,
              });
            },
            onUpdate: (props) => {
              registerSuggestionCommand(props.editor, pluginKey, props.command);
              if (props.query === lastQuery) {
                return;
              }
              lastQuery = props.query;
              dispatchTriggerChange(props.editor, {
                type: 'autocomplete',
                query: props.query,
                triggerOffset: props.range.from,
              });
            },
            onExit: (props) => {
              lastQuery = null;
              unregisterSuggestionCommand(props.editor, pluginKey);
              dispatchTriggerChange(props.editor, null);
            },
            onKeyDown: () => false,
          }),
        }),
      ];
    },
  });
}

async function resolveItems(config: AutocompleteConfig, query: string): Promise<SuggestionItem[]> {
  const minQueryLength = config.minQueryLength ?? 0;
  if (query.length < minQueryLength) {
    return [];
  }
  if (typeof config.items === 'function') {
    return Promise.resolve(config.items(query));
  }
  if (!query) {
    return config.items;
  }
  const lower = query.toLowerCase();
  return config.items.filter((item) => item.label.toLowerCase().includes(lower));
}
