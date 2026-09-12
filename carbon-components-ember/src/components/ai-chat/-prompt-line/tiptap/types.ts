/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ComponentLike } from '@glint/template';

/**
 * Ported from `@carbon/ai-chat-components`' `prompt-line/src/tiptap/types.ts`,
 * trimmed to the fields this slice's factories (`carbon-mention.ts`,
 * `carbon-autocomplete.ts`, `carbon-starter-trigger.ts`) and
 * `PromptLineAutocomplete` (the real, now-ported popup) actually read.
 * Still dropped: `avatar`'s React-component union (this port has no React),
 * `renderCustomList`/`renderCustomToken` (a host-rendered-popup escape hatch
 * with no clean Ember equivalent — see `token-chip.ts`'s doc comment and
 * `PromptLineAutocomplete`'s class doc for why), and `groupId`'s partner
 * React-only fields. `disableDirectSend`/`groupId`/`groupTitle` are back —
 * they're plain data `PromptLineAutocomplete` renders directly, not
 * callback hooks, now that a real popup exists to interpret them.
 */

export interface SuggestionItem {
  /** Unique identifier for the item. */
  id: string;
  /** Display label. */
  label: string;
  /** String value inserted into the message on selection. Defaults to label. */
  value?: string;
  /** Optional description, shown below the label in `PromptLineAutocomplete`. */
  description?: string;
  /**
   * Optional leading visual. A plain string is rendered as an image `src`;
   * anything else is invoked as a component (`<entry.avatarIcon @size={{16}} />`),
   * matching the `ComponentLike` icon-arg pattern used elsewhere in this
   * addon (e.g. `AiChatCardFooter`'s `CardFooterAction.icon`).
   */
  avatar?: string | ComponentLike<{ Args: { size?: number; svgClass?: string; fill?: string } }>;
  /** Whether the item is disabled and cannot be selected. */
  disabled?: boolean;
  /**
   * Whether the trigger character prefixes this item's rendered chip (e.g.
   * `/summarize` instead of `summarize`). Overrides
   * {@link TriggerSuggestionConfig.showTriggerInChip} and the built-in
   * default (commands show their trigger, mentions don't) when set.
   */
  showTriggerInChip?: boolean;
  /**
   * Optional group identifier. Items sharing the same `groupId` are rendered
   * together under a single group heading in `PromptLineAutocomplete`. Items
   * without a `groupId` are rendered ungrouped, before any groups. Group
   * order follows first-occurrence of each `groupId` in the array.
   */
  groupId?: string;
  /**
   * Human-readable title for the group header. Every item in the group
   * should supply this so the header renders correctly if filtering leaves
   * only a non-first item visible.
   */
  groupTitle?: string;
}

/** A group of related suggestion items, derived from `SuggestionItem.groupId`/`groupTitle` by `itemsToGroups`. */
export interface SuggestionItemGroup {
  /** Matches the items' `groupId`. */
  id: string;
  title: string;
  items: SuggestionItem[];
}

export interface BaseSuggestionConfig {
  /** Static item list or async function called with the current query string. */
  items: SuggestionItem[] | ((query: string) => Promise<SuggestionItem[]> | SuggestionItem[]);
  /** Minimum query length before `items()` is called. Defaults to 0. */
  minQueryLength?: number;
  /** Called after the user selects an item and insertion is complete. */
  onSelect?: (item: SuggestionItem) => void;
  /**
   * When `true`, clicking a suggestion item in `PromptLineAutocomplete`
   * inserts it into the editor (`onSelect`, plus a chip for mention/command)
   * instead of the default "send directly to chat" behavior
   * (`PromptLineAutocomplete`'s `@onItemSend`, which never touches the
   * editor at all). Always `true` for mention/command, regardless of this
   * flag — see `TriggerSuggestionConfig`. Defaults to `false`.
   */
  disableDirectSend?: boolean;
}

/**
 * Trigger-character-driven suggestion config, shared by `carbonMention` and
 * `carbonCommand`.
 */
export interface TriggerSuggestionConfig extends Omit<BaseSuggestionConfig, 'disableDirectSend'> {
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
  /** See {@link BaseSuggestionConfig.disableDirectSend}. Defaults to `false`. */
  disableDirectSend?: boolean;
}

/** Detail payload for the `cds-aichat-trigger-change` DOM event. */
export interface TriggerChangeEventDetail {
  /** `'mention'` / `'command'` / `'autocomplete'` / `'starter'`. */
  type: string;
  /** The current query string typed after the trigger character. */
  query: string;
  /** The character offset of the trigger in the editor content. */
  triggerOffset: number;
}
