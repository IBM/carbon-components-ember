/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Mention from '@tiptap/extension-mention';
import type { Editor, Range } from '@tiptap/core';
import type { Node as PMNode } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { isHostOrigin } from './origin-meta.ts';
import { registerSuggestionCommand, unregisterSuggestionCommand } from './active-suggestion.ts';
import { CarbonTokenNodeView } from './token-chip.ts';
import { dispatchTriggerChange } from './trigger-utils.ts';
import type { SuggestionItem, TriggerSuggestionConfig } from './types.ts';

/**
 * Ported from `@carbon/ai-chat-components`' `tiptap/carbon-mention.ts`.
 * `carbonMention` and `carbonCommand` factories, wrapping
 * `@tiptap/extension-mention` with carbon-specific: chip rendering via
 * `CarbonTokenNodeView` (default chip only — see `token-chip.ts`), extra
 * schema attrs (`value`, `data`, `trigger`) layered on `Mention`'s default
 * `id`/`label`, direct `cds-aichat-trigger-change` dispatch from the
 * suggestion-render lifecycle, and an `onRemove` callback fired when a user
 * edit deletes a token node. Cut from upstream: the `renderCustomToken`
 * option (see `token-chip.ts`'s doc comment) and `mentionSuggestionChar`'s
 * separate schema attr (upstream's own `trigger` attr already carries this,
 * once `showTriggerInChip` resolves it — keeping both was redundant).
 *
 * Each chat supports one mention trigger and one command trigger, because
 * Tiptap resolves extensions by name. `carbonCommand` defaults
 * `showTriggerInChip` to on, `carbonMention` to off — either default can be
 * overridden per-config or per-item (`SuggestionItem.showTriggerInChip`
 * wins when set).
 *
 * Importing this module (directly, or via `build-extensions.ts`) pulls in a
 * real `@tiptap/extension-mention` — do this only from a lazily-loaded
 * module (e.g. behind a dynamic `import()`, the same way `rich-controller.ts`
 * itself is reached), never from `PromptLine.gts` or the components barrel,
 * or Tiptap lands in the main bundle for every consumer. See AGENTS.md.
 */

interface BuildOptions {
  defaultName: 'mention' | 'command';
  defaultPluginKeyName: string;
}

function buildTriggerExtension(config: TriggerSuggestionConfig, build: BuildOptions) {
  const name = build.defaultName;
  const pluginKey = new PluginKey(`${build.defaultPluginKeyName}_${name}`);

  return Mention.extend({
    name,

    addAttributes() {
      const parent = (this.parent?.() ?? {}) as Record<string, unknown>;
      return {
        ...parent,
        value: { default: null },
        data: { default: null },
        trigger: { default: null },
      };
    },

    addNodeView() {
      return ({ node }: { node: PMNode }) => new CarbonTokenNodeView(node);
    },

    addProseMirrorPlugins() {
      const parentPlugins = this.parent?.() ?? [];
      const onRemove = config.onRemove;
      if (!onRemove) {
        return parentPlugins;
      }

      // Fire `onRemove` once per token node of this type that leaves the doc
      // via a USER edit. `appendTransaction` records whether the batch was
      // host-origin; the view's `update` runs the diff after state is
      // applied, so host callbacks never re-enter `dispatch`. Host-origin
      // batches (a controlled `@content` sync, `clearContent()`,
      // `insertContent()`) are skipped, symmetric with `onSelect` firing
      // only on user popup selection.
      let lastBatchIsHost = false;

      const removalPlugin = new Plugin({
        key: new PluginKey(`${name}_removal`),
        appendTransaction(transactions) {
          lastBatchIsHost = transactions.some((tr) => isHostOrigin(tr));
          return null;
        },
        view: () => ({
          update(view, prevState) {
            if (view.state.doc === prevState.doc || lastBatchIsHost) {
              return;
            }
            const removed = diffRemovedTokens(prevState.doc, view.state.doc, name);
            for (const item of removed) {
              onRemove(item);
            }
          },
        }),
      });

      return [...parentPlugins, removalPlugin];
    },
  }).configure({
    HTMLAttributes: { 'data-token-type': name },
    suggestion: {
      char: config.trigger,
      pluginKey,
      startOfLine: config.triggerPosition === 'start',
      items: ({ query }) => resolveItems(config, query),
      command: ({ editor, range, props }) => {
        const item = props as SuggestionItem;
        editor
          .chain()
          .focus()
          .insertContentAt(range, [
            {
              type: name,
              attrs: {
                id: item.id,
                label: item.label,
                value: item.value ?? item.label,
                trigger: resolveShowTriggerInChip(item, config, build.defaultName === 'command')
                  ? config.trigger
                  : null,
                data: stripPresentationFields(item),
              },
            },
            { type: 'text', text: ' ' },
          ])
          .run();
        config.onSelect?.(item);
      },
      render: () => {
        let lastQuery: string | null = null;
        return {
          onStart: (props) => {
            registerSuggestionCommand(props.editor, pluginKey, props.command);
            emitTrigger(props.editor, name, props.query, props.range, () => {
              lastQuery = props.query;
            });
          },
          onUpdate: (props) => {
            registerSuggestionCommand(props.editor, pluginKey, props.command);
            if (props.query === lastQuery) {
              return;
            }
            lastQuery = props.query;
            emitTrigger(props.editor, name, props.query, props.range);
          },
          onExit: (props) => {
            lastQuery = null;
            unregisterSuggestionCommand(props.editor, pluginKey);
            dispatchTriggerChange(props.editor, null);
          },
          onKeyDown: () => false,
        };
      },
    },
  });
}

function emitTrigger(
  editor: Editor,
  type: string,
  query: string,
  range: Range,
  postEmit?: () => void,
): void {
  dispatchTriggerChange(editor, { type, query, triggerOffset: range.from });
  postEmit?.();
}

/**
 * Collect the attrs of every node named `name` in `doc`, grouped by id and
 * kept in document order, so a multiset diff can tell which specific node
 * instances were removed (duplicate chips with the same id are tracked by
 * count, not collapsed).
 */
function collectTokenAttrsById(doc: PMNode, name: string): Map<string, Record<string, unknown>[]> {
  const byId = new Map<string, Record<string, unknown>[]>();
  doc.descendants((node) => {
    if (node.type.name !== name) {
      return;
    }
    const attrs = node.attrs as Record<string, unknown>;
    const id = String(attrs['id']);
    const bucket = byId.get(id);
    if (bucket) {
      bucket.push(attrs);
    } else {
      byId.set(id, [attrs]);
    }
  });
  return byId;
}

/** Reconstruct a {@link SuggestionItem} from a removed token node's attrs. */
function attrsToItem(attrs: Record<string, unknown>): SuggestionItem {
  const data = (attrs['data'] ?? {}) as Record<string, unknown>;
  return {
    ...data,
    id: String(attrs['id']),
    label: attrs['label'] as string,
    value: (attrs['value'] ?? undefined) as string | undefined,
  };
}

/** Diff token nodes named `name` between `before` and `after`, returning reconstructed items for each removed node instance. */
function diffRemovedTokens(before: PMNode, after: PMNode, name: string): SuggestionItem[] {
  const beforeById = collectTokenAttrsById(before, name);
  const afterById = collectTokenAttrsById(after, name);
  const removed: SuggestionItem[] = [];
  for (const [id, beforeAttrs] of beforeById) {
    const afterCount = afterById.get(id)?.length ?? 0;
    for (let i = afterCount; i < beforeAttrs.length; i += 1) {
      removed.push(attrsToItem(beforeAttrs[i]!));
    }
  }
  return removed;
}

async function resolveItems(config: TriggerSuggestionConfig, query: string): Promise<SuggestionItem[]> {
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

/**
 * Resolve whether a selected item's chip should be prefixed with the
 * trigger character: the item's own `showTriggerInChip` wins when set, then
 * the config's, then the command/mention default.
 */
export function resolveShowTriggerInChip(
  item: SuggestionItem,
  config: Pick<TriggerSuggestionConfig, 'showTriggerInChip'>,
  isCommand: boolean,
): boolean {
  return item.showTriggerInChip ?? config.showTriggerInChip ?? isCommand;
}

const PRESENTATION_FIELDS = new Set<keyof SuggestionItem>([
  'id',
  'label',
  'value',
  'avatar',
  'description',
  'disabled',
  'showTriggerInChip',
]);

function stripPresentationFields(item: SuggestionItem): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(item).filter(([key]) => !PRESENTATION_FIELDS.has(key as keyof SuggestionItem)),
  );
}

export function carbonMention(config: TriggerSuggestionConfig) {
  return buildTriggerExtension(config, { defaultName: 'mention', defaultPluginKeyName: 'carbonMentionSuggestion' });
}

export function carbonCommand(config: TriggerSuggestionConfig) {
  return buildTriggerExtension(config, { defaultName: 'command', defaultPluginKeyName: 'carbonCommandSuggestion' });
}
