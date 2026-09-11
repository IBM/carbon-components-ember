/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ported from `@carbon/ai-chat-components`' `prompt-line/src/tiptap/types.ts`,
 * trimmed to the fields this slice's factories (`carbon-mention.ts`,
 * `carbon-autocomplete.ts`, `carbon-starter-trigger.ts`) actually read.
 * Dropped: `avatar`'s `CarbonIcon`/React-component union (becomes `unknown`
 * — this port ships no default suggestion popup to interpret it),
 * `renderCustomList`/`renderCustomToken`/`disableDirectSend` (all three
 * assume a host-rendered popup/chip layer this slice deliberately doesn't
 * include — see `PromptLine`'s class doc and AGENTS.md's "Porting Carbon AI
 * Chat" section for why), and `groupId`/`groupTitle` (meaningless without a
 * list UI to group). A host building its own popup on top of these configs
 * can still read `items`/`minQueryLength`/`onSelect`/`onRemove` directly off
 * the same config object it passed into `carbonMention`/etc.
 */

export interface SuggestionItem {
  /** Unique identifier for the item. */
  id: string;
  /** Display label. */
  label: string;
  /** String value inserted into the message on selection. Defaults to label. */
  value?: string;
  /** Optional description, for a host-rendered popup to show. */
  description?: string;
  /** Optional leading visual, opaque to this port — a host-rendered popup interprets it. */
  avatar?: unknown;
  /** Whether the item is disabled and cannot be selected. */
  disabled?: boolean;
  /**
   * Whether the trigger character prefixes this item's rendered chip (e.g.
   * `/summarize` instead of `summarize`). Overrides
   * {@link TriggerSuggestionConfig.showTriggerInChip} and the built-in
   * default (commands show their trigger, mentions don't) when set.
   */
  showTriggerInChip?: boolean;
}

export interface BaseSuggestionConfig {
  /** Static item list or async function called with the current query string. */
  items: SuggestionItem[] | ((query: string) => Promise<SuggestionItem[]> | SuggestionItem[]);
  /** Minimum query length before `items()` is called. Defaults to 0. */
  minQueryLength?: number;
  /** Called after the user selects an item and insertion is complete. */
  onSelect?: (item: SuggestionItem) => void;
}

/**
 * Trigger-character-driven suggestion config, shared by `carbonMention` and
 * `carbonCommand`.
 */
export interface TriggerSuggestionConfig extends BaseSuggestionConfig {
  /** Character that activates the suggestion (e.g. `"@"`, `"/"`). */
  trigger: string;
  /** Whether the trigger must start the line, or may appear anywhere. Defaults to `'anywhere'`. */
  triggerPosition?: 'start' | 'anywhere';
  /**
   * Called when a previously-inserted token for this trigger is removed by a
   * USER edit (backspace, delete, cut, select-all, undo, ...) — not by a
   * host-driven `@content`/`clearContent()`/`insertContent()` call, which are
   * tagged host-origin and never fire this. Fires once per removed node
   * instance, so deleting one of two identical chips fires exactly once.
   */
  onRemove?: (item: SuggestionItem) => void;
  /**
   * Default for whether the trigger character prefixes the rendered chip.
   * Defaults to `true` for `carbonCommand`, `false` for `carbonMention`.
   */
  showTriggerInChip?: boolean;
}

/** Live autocomplete config. Selection inserts plain text (no token chip). */
export type AutocompleteConfig = BaseSuggestionConfig;

/**
 * Config for the starter prompts shown while the editor is empty and
 * focused. `items` is a static array — starters are resolved once, not
 * re-queried per keystroke.
 */
export interface StartersConfig {
  items: SuggestionItem[];
  /** Defaults to `true`. */
  isOn?: boolean;
}

/** Detail payload for the `cds-aichat-trigger-change` DOM event. */
export interface TriggerChangeEventDetail {
  /** `'mention'` / `'command'` / `'carbonAutocomplete'` / `'starter'`. */
  type: string;
  /** The current query string typed after the trigger character. */
  query: string;
  /** The character offset of the trigger in the editor content. */
  triggerOffset: number;
}
