/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier as eModifier } from 'ember-modifier';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { guidFor } from '@ember/object/internals';
import { type TemplateOnlyComponent } from '@ember/component/template-only';
import type { ComponentLike } from '@glint/template';
import { SendFilled } from '../../icons.ts';
import { resetTriggerChangeState } from './-prompt-line/tiptap/trigger-utils.ts';
import type { PromptLineApi } from './prompt-line.gts';
import type {
  AutocompleteConfig,
  BaseSuggestionConfig,
  StartersConfig,
  SuggestionItem,
  SuggestionItemGroup,
  TriggerChangeEventDetail,
  TriggerSuggestionConfig,
} from './-prompt-line/tiptap/types.ts';

/** Optional header shown above the list. */
export interface HeaderConfig {
  showHeader: boolean;
  title: string;
}

/**
 * Localized strings. All fields are required so callers explicitly provide
 * every user-visible/announced string when overriding.
 */
export interface AutocompleteI18n {
  noSuggestions: string;
  suggestionsAvailable: (count: number) => string;
  itemNavigation: (
    label: string,
    description: string | undefined,
    groupLabel: string | undefined,
    position: string,
  ) => string;
  itemInserted: (label: string) => string;
  itemSent: (label: string) => string;
  suggestionsClosed: string;
  listboxLabel: string;
  /** Label for the implicit group wrapping ungrouped items when real groups are also present. */
  nonGroupedItemsLabel: string;
}

export const defaultAutocompleteI18n: AutocompleteI18n = {
  noSuggestions: 'No suggestions.',
  suggestionsAvailable: (count) =>
    `${count} suggestion${count === 1 ? '' : 's'}. Use up and down arrows to move, Enter to pick, Escape to close.`,
  itemNavigation: (label, description, groupLabel, position) =>
    `${label}${description ? `, ${description}` : ''}${groupLabel ? `, ${groupLabel}` : ''}, ${position}`,
  itemInserted: (label) => `${label} inserted.`,
  itemSent: (label) => `${label} sent.`,
  suggestionsClosed: 'Suggestions closed.',
  listboxLabel: 'Autocomplete options',
  nonGroupedItemsLabel: 'Non-grouped options',
};

export type Args = {
  /**
   * The `PromptLineApi` handle from the paired `PromptLine`'s `@onReady`.
   * Read only inside event handlers (click, keydown, outside-click) — never
   * during render/modifier setup — so there is no ordering requirement
   * against when the paired `PromptLine`'s `@onReady` actually fires.
   */
  promptLine?: PromptLineApi;
  /** `@`-style mention trigger config. */
  mention?: TriggerSuggestionConfig;
  /** `/`-style command trigger config. */
  command?: TriggerSuggestionConfig;
  /** Live-typeahead autocomplete config (no trigger character). */
  autocomplete?: AutocompleteConfig;
  /** Starter prompts shown while the editor is empty and focused. */
  starters?: StartersConfig;
  /** When `true`, the "send directly" click path (see `BaseSuggestionConfig.disableDirectSend`) becomes a no-op instead of firing `@onItemSend`. */
  isSendDisabled?: boolean;
  i18n?: Partial<AutocompleteI18n>;
  headerConfig?: HeaderConfig;
  /**
   * Fires after a starter is inserted into the editor (the
   * `disableDirectSend: true` path only) with the editor's full raw text, so
   * the host can trigger send. Skipped when `@isSendDisabled`.
   */
  onStarterSelected?: (text: string) => void;
  /** Fires after any item is inserted into the editor (the `disableDirectSend: true` path, all trigger types). */
  onItemSelected?: (item: SuggestionItem) => void;
  /**
   * Fires when an item is activated on the default "send directly" path
   * (`disableDirectSend` unset/false) with the item's `value ?? label` —
   * this component never touches the editor for this path, the host owns
   * actually sending. Skipped (and the popup stays open) when `@isSendDisabled`.
   */
  onItemSend?: (text: string) => void;
  /**
   * Ancestor element to listen on for the bubbling `cds-aichat-trigger-change`
   * DOM event, editor keydown forwarding, and outside-click/focusout
   * detection. Defaults to the closest `.cds-aichat-prompt-line-shell`
   * ancestor, or this component's own parent element if there isn't one —
   * override for standalone use (a `PromptLine` not inside a
   * `PromptLineShell`), same spirit as `Menu`'s `@target`/`DatePicker`'s
   * `@appendTo`.
   */
  target?: HTMLElement;
};

export interface PromptLineAutocompleteSignature {
  Element: HTMLDivElement;
  Args: Args;
}

interface ListEntry {
  item: SuggestionItem;
  index: number;
  optionId: string;
  isActive: boolean;
  isDisabled: boolean;
  isFirst: boolean;
  isLast: boolean;
  avatarUrl?: string;
  avatarIcon?: ComponentLike<{ Args: { size?: number; svgClass?: string; fill?: string } }>;
  showSendIcon: boolean;
}

interface ListGroup {
  key: string;
  title?: string;
  ariaLabel?: string;
  labelId?: string;
  entries: ListEntry[];
}

interface ItemRowSignature {
  Element: HTMLLIElement;
  Args: {
    entry: ListEntry;
    onItemClick: (item: SuggestionItem) => void;
    onItemMouseEnter: (index: number) => void;
  };
}

const ItemRow: TemplateOnlyComponent<ItemRowSignature> = <template>
  {{! template-lint-disable require-presentational-children }}
  <li
    id={{@entry.optionId}}
    role='option'
    tabindex='-1'
    aria-selected='false'
    aria-disabled={{if @entry.isDisabled 'true' 'false'}}
    class='cds-aichat-autocomplete-item
      {{if @entry.isActive "cds-aichat-autocomplete-item--active"}}
      {{if @entry.isDisabled "cds-aichat-autocomplete-item--disabled"}}
      {{if @entry.isFirst "cds-aichat-autocomplete-item--first"}}
      {{if @entry.isLast "cds-aichat-autocomplete-item--last"}}'
    {{on 'click' (fn @onItemClick @entry.item)}}
    {{on 'mouseenter' (fn @onItemMouseEnter @entry.index)}}
  >
    <div class='cds-aichat-autocomplete-item__content'>
      {{#if @entry.avatarUrl}}
        <div class='cds-aichat-autocomplete-item__avatar'>
          <img src={{@entry.avatarUrl}} alt='' />
        </div>
      {{else if @entry.avatarIcon}}
        <div class='cds-aichat-autocomplete-item__avatar'>
          <@entry.avatarIcon @size={{16}} />
        </div>
      {{/if}}
      <div class='cds-aichat-autocomplete-item__text'>
        <div class='cds-aichat-autocomplete-item__label'>
          {{!-- Upstream's typed/remainder label split is permanently dead code (see class doc) - always rendered plain, under __label-remainder so the disabled-state color rule still applies. --}}
          <span class='cds-aichat-autocomplete-item__label-remainder'>{{@entry.item.label}}</span>
        </div>
        {{#if @entry.item.description}}
          <div class='cds-aichat-autocomplete-item__description'>{{@entry.item.description}}</div>
        {{/if}}
      </div>
    </div>
    {{#if @entry.showSendIcon}}
      <span aria-hidden='true' class='cds-aichat-autocomplete-item__send-icon'>
        <SendFilled @size='16' />
      </span>
    {{/if}}
  </li>
</template>;

/**
 * Partition a flat `SuggestionItem[]` into ungrouped items and derived
 * `SuggestionItemGroup[]`, preserving first-occurrence order of each
 * `groupId`. Ported from `@carbon/ai-chat-components`' `autocomplete-controller.ts`'s
 * `itemsToGroups`, unchanged in substance.
 */
function itemsToGroups(flat: SuggestionItem[]): { items: SuggestionItem[]; groups: SuggestionItemGroup[] } {
  const items: SuggestionItem[] = [];
  const groupMap = new Map<string, SuggestionItemGroup>();
  const groupOrder: string[] = [];
  for (const item of flat) {
    if (!item.groupId) {
      items.push(item);
      continue;
    }
    let group = groupMap.get(item.groupId);
    if (!group) {
      group = { id: item.groupId, title: item.groupTitle ?? '', items: [] };
      groupMap.set(item.groupId, group);
      groupOrder.push(item.groupId);
    }
    group.items.push(item);
  }
  return {
    items,
    groups: groupOrder.map((id) => groupMap.get(id)).filter((g): g is SuggestionItemGroup => g !== undefined),
  };
}

/** Resolve a config's `items` field (array or async resolver), applying `minQueryLength` filtering. Ported unchanged. */
async function resolveConfigItems(config: BaseSuggestionConfig, query: string): Promise<SuggestionItem[]> {
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
 * The suggestion overlay for `PromptLine`'s mention (`@`), command (`/`),
 * autocomplete, and starter-prompt Tiptap extensions — typically rendered
 * inside a `PromptLineShell`'s `<:autocompleteContent>` block, paired with
 * exactly one `PromptLine` via `@promptLine` (its `@onReady` handle).
 *
 * Ember port of `@carbon/ai-chat-components`' `autocomplete-controller.ts`
 * (`AutocompleteController` + `<cds-aichat-autocomplete-controller>`) and
 * `prompt-line/autocomplete/src/autocomplete.ts` (`<cds-aichat-autocomplete>`)
 * — upstream's own two-layer split (a framework-agnostic controller class
 * wrapped by a thin Lit element, driving a *separate* Lit list element)
 * exists so the controller can be reused from a React hook too. Ember has no
 * such reuse pressure, so both layers are merged into this one component:
 * there's no `setListElement`/synthetic-keydown-forwarding indirection
 * upstream needs to bridge two separate custom elements — keydown is
 * handled directly against this component's own state.
 *
 * Also simplified rather than reproduced:
 * - **Event wiring uses direct DOM ancestry, not upstream's `closest('cds-aichat-prompt-line-shell')`-or-fallback-to-`this` custom-element-tag lookup.**
 *   `@target` (defaulting to the closest `.cds-aichat-prompt-line-shell`, or
 *   this component's own parent) is resolved once, from a plain no-args
 *   modifier on this component's own root — never from `@promptLine`
 *   itself, which would make the listener-attach modifier depend on a
 *   tracked value the paired `PromptLine`'s `@onReady` can write in the very
 *   same render pass (a backtracking-rerender hazard, since this component
 *   renders earlier in `PromptLineShell`'s DOM than `<:editor>` does).
 *   `@promptLine` is only ever read inside event handlers, at interaction
 *   time, well outside that render pass.
 * - **Selection for mention/command/autocomplete calls `PromptLineApi.selectSuggestion(item)`** —
 *   added in the previous port specifically as "the counterpart to a
 *   host-rendered popup's click/Enter handling" — rather than re-deriving
 *   the chip/text `insertContentAt` logic those extensions' own `command`
 *   callbacks (and `config.onSelect`) already implement and this component
 *   would otherwise have to duplicate.
 * - **Escape/outside-click calls `PromptLineApi.dismissSuggestion()`**
 *   (`@tiptap/suggestion`'s real `exitSuggestion`), genuinely closing the
 *   Suggestion plugin's own match-tracking state — upstream's raw JS
 *   equivalent (`AutocompleteController.dismiss()`) only clears its own
 *   local UI state and never touches the Suggestion plugin at all, so typing
 *   another character within the same still-open match range would
 *   immediately reopen it. `dismissSuggestion()` exists in this port
 *   precisely to close that gap.
 * - **The typed/remainder label-highlight split is dropped.** Upstream's own
 *   `<cds-aichat-autocomplete-controller>` never actually binds `.inputText=`
 *   on the list it renders, so the split (`_getLabelParts`, keyed off
 *   `inputText`) is permanently inert in the real, shipped wiring — always
 *   `{ typed: '', remainder: label }`. Rendering the plain label under the
 *   `__label-remainder` class (see `ItemRow`) reproduces the actual behavior
 *   exactly, without the dead comparison logic.
 *
 * A same-transaction race between independent trigger extensions is real
 * (see AGENTS.md's "Porting Carbon AI Chat" section) — installing more than
 * one of mention/command/autocomplete/starters can dispatch a same-tick
 * sequence like `starter(active) → mention(onStart) → null(starter's own
 * exit)`, where the *last* raw event is `null` even though a trigger is
 * genuinely active. This component defers ingestion of
 * `cds-aichat-trigger-change` events to a microtask, batches everything that
 * arrives before the flush, and resolves the batch to its last non-null
 * detail (clearing only when every event in the batch was `null`) — this is
 * new reconciliation logic with no upstream reference, since upstream's own
 * `AutocompleteController.handleTriggerChange` is last-event-wins and
 * reproduces the exact same race rather than fixing it. An explicit user
 * action (select/send/cancel) still updates local state and clears the
 * pending batch immediately/synchronously, so a stale queued event can't
 * fight a state change the user just caused.
 */
export default class PromptLineAutocomplete extends Component<PromptLineAutocompleteSignature> {
  @tracked private trigger: TriggerChangeEventDetail | null = null;
  @tracked private items: SuggestionItem[] = [];
  @tracked private focusedIndex = 0;
  @tracked private regionA = '';
  @tracked private regionB = '';

  private useRegionA = true;
  private openAnnounced = false;
  private resolveToken = 0;
  private pendingBatch: Array<TriggerChangeEventDetail | null> = [];
  private batchScheduled = false;
  private moveAnnounceTimer: ReturnType<typeof setTimeout> | null = null;
  private popupElement: HTMLElement | null = null;
  private listenTarget: HTMLElement | null = null;
  private readonly labelIdBase = guidFor(this);

  private get i18n(): AutocompleteI18n {
    return { ...defaultAutocompleteI18n, ...this.args.i18n };
  }

  private get partition() {
    return itemsToGroups(this.items);
  }

  get hasGroups(): boolean {
    return this.partition.groups.length > 0;
  }

  get listGroups(): ListGroup[] {
    const { items, groups } = this.partition;
    const showSendIcon = !this.disableDirectSend;
    let runningIndex = 0;
    const makeEntry = (item: SuggestionItem): ListEntry => {
      const index = runningIndex++;
      return {
        item,
        index,
        optionId: `${item.id}--option`,
        isActive: index === this.focusedIndex,
        isDisabled: !!item.disabled,
        isFirst: false,
        isLast: false,
        avatarUrl: typeof item.avatar === 'string' ? item.avatar : undefined,
        avatarIcon: typeof item.avatar === 'string' || !item.avatar ? undefined : item.avatar,
        showSendIcon,
      };
    };
    const result: ListGroup[] = [];
    if (items.length > 0) {
      result.push({
        key: '__ungrouped__',
        ariaLabel: groups.length > 0 ? this.i18n.nonGroupedItemsLabel : undefined,
        entries: items.map(makeEntry),
      });
    }
    for (const group of groups) {
      result.push({
        key: group.id,
        title: group.title,
        labelId: `${this.labelIdBase}-group-${group.id}`,
        entries: group.items.map(makeEntry),
      });
    }
    const allEntries = result.flatMap((g) => g.entries);
    const first = allEntries[0];
    const last = allEntries[allEntries.length - 1];
    if (first && !this.args.headerConfig?.showHeader) {
      first.isFirst = true;
    }
    if (last) {
      last.isLast = true;
    }
    return result;
  }

  private get flatEntries(): ListEntry[] {
    return this.listGroups.flatMap((g) => g.entries);
  }

  get totalItemCount(): number {
    return this.flatEntries.length;
  }

  get hasItems(): boolean {
    return this.totalItemCount > 0;
  }

  get activeOptionId(): string | undefined {
    return this.flatEntries[this.focusedIndex]?.optionId;
  }

  private getItemAtIndex(index: number): SuggestionItem | undefined {
    return this.flatEntries[index]?.item;
  }

  private groupTitleAt(index: number): string | undefined {
    let running = 0;
    for (const group of this.listGroups) {
      if (index < running + group.entries.length) {
        return group.title || group.ariaLabel;
      }
      running += group.entries.length;
    }
    return undefined;
  }

  private get disableDirectSend(): boolean | undefined {
    const trigger = this.trigger;
    if (!trigger) {
      return undefined;
    }
    switch (trigger.type) {
      case 'starter':
        return this.args.starters?.disableDirectSend;
      case 'mention':
      case 'command':
        return true;
      default:
        return this.args.autocomplete?.disableDirectSend;
    }
  }

  private configFor(type: string): BaseSuggestionConfig | TriggerSuggestionConfig | undefined {
    switch (type) {
      case 'mention':
        return this.args.mention;
      case 'command':
        return this.args.command;
      case 'autocomplete':
        return this.args.autocomplete;
      default:
        return undefined;
    }
  }

  private announce(message: string) {
    if (this.useRegionA) {
      this.regionA = message;
      this.regionB = '';
    } else {
      this.regionB = message;
      this.regionA = '';
    }
    this.useRegionA = !this.useRegionA;
  }

  // ---------------------------------------------------------------------
  // Trigger-change ingestion (batched — see class doc)
  // ---------------------------------------------------------------------

  private readonly handleTriggerChangeEvent = (event: Event) => {
    const detail = (event as CustomEvent<TriggerChangeEventDetail | null>).detail ?? null;
    this.pendingBatch.push(detail);
    if (this.batchScheduled) {
      return;
    }
    this.batchScheduled = true;
    void Promise.resolve().then(() => this.flushTriggerBatch());
  };

  private flushTriggerBatch() {
    this.batchScheduled = false;
    const batch = this.pendingBatch;
    this.pendingBatch = [];
    if (batch.length === 0 || this.isDestroying) {
      return;
    }
    let winner: TriggerChangeEventDetail | null = null;
    for (let i = batch.length - 1; i >= 0; i -= 1) {
      const candidate = batch[i];
      if (candidate) {
        winner = candidate;
        break;
      }
    }
    this.handleTriggerChange(winner);
  }

  private handleTriggerChange(detail: TriggerChangeEventDetail | null) {
    this.trigger = detail;
    if (!detail) {
      this.items = [];
      this.resolveToken++;
      this.openAnnounced = false;
      return;
    }
    this.kickoffResolve(detail);
  }

  private kickoffResolve(trigger: TriggerChangeEventDetail) {
    const token = ++this.resolveToken;
    void (async () => {
      const items = await this.resolveItems(trigger);
      if (this.isDestroying || this.resolveToken !== token) {
        return;
      }
      this.items = items;
      this.focusedIndex = this.firstEnabledIndex();
      if (items.length === 0) {
        this.openAnnounced = false;
        this.announce(this.i18n.noSuggestions);
      } else if (!this.openAnnounced) {
        this.openAnnounced = true;
        this.announce(this.i18n.suggestionsAvailable(items.length));
      }
    })();
  }

  private async resolveItems(trigger: TriggerChangeEventDetail): Promise<SuggestionItem[]> {
    if (trigger.type === 'starter') {
      return this.args.starters?.items ?? [];
    }
    const config = this.configFor(trigger.type);
    if (!config) {
      return [];
    }
    return resolveConfigItems(config, trigger.query);
  }

  private firstEnabledIndex(): number {
    const total = this.totalItemCount;
    let index = 0;
    while (index < total && this.getItemAtIndex(index)?.disabled) {
      index++;
    }
    return index < total ? index : 0;
  }

  /** Clears local state (and, unless `keepCoalesced`, the trigger-utils coalescing cache) immediately, dropping any queued-but-unflushed batch — used by every explicit user action so a stale event can't fight it. */
  private closeImmediately(keepCoalesced = false) {
    this.pendingBatch = [];
    this.trigger = null;
    this.items = [];
    this.resolveToken++;
    this.openAnnounced = false;
    if (!keepCoalesced) {
      const editor = this.args.promptLine?.getEditor();
      if (editor) {
        resetTriggerChangeState(editor);
      }
    }
  }

  private cancel() {
    if (!this.trigger && this.items.length === 0) {
      return;
    }
    this.announce(this.i18n.suggestionsClosed);
    this.closeImmediately();
    this.args.promptLine?.dismissSuggestion();
  }

  // ---------------------------------------------------------------------
  // Selection
  // ---------------------------------------------------------------------

  private readonly handleItemClick = (item: SuggestionItem) => {
    if (item.disabled) {
      return;
    }
    if (!this.disableDirectSend) {
      this.handleSend(item);
    } else {
      this.handleSelect(item);
    }
  };

  private handleSend(item: SuggestionItem) {
    this.announce(this.i18n.itemSent(item.label));
    if (this.args.isSendDisabled) {
      return;
    }
    this.closeImmediately(true);
    this.args.onItemSend?.(item.value ?? item.label);
  }

  private handleSelect(item: SuggestionItem) {
    const trigger = this.trigger;
    if (!trigger) {
      return;
    }
    this.announce(this.i18n.itemInserted(item.label));
    if (trigger.type === 'starter') {
      const promptLine = this.args.promptLine;
      promptLine?.insertContent(item.value ?? item.label);
      this.closeImmediately();
      if (!this.args.isSendDisabled) {
        this.args.onStarterSelected?.(promptLine?.getValue() ?? '');
      }
    } else {
      this.args.promptLine?.selectSuggestion(item);
      this.closeImmediately();
    }
    this.args.onItemSelected?.(item);
  }

  private readonly handleItemMouseEnter = (index: number) => {
    if (this.getItemAtIndex(index)?.disabled) {
      return;
    }
    this.focusedIndex = index;
  };

  // ---------------------------------------------------------------------
  // Keyboard (handled directly against this component's own state — see
  // class doc for why there's no separate list-element forwarding step)
  // ---------------------------------------------------------------------

  private navigateTo(from: number, direction: 1 | -1): number {
    const total = this.totalItemCount;
    let next = from + direction;
    while (next >= 0 && next < total) {
      if (!this.getItemAtIndex(next)?.disabled) {
        return next;
      }
      next += direction;
    }
    return from;
  }

  private scheduleMoveAnnouncement() {
    if (this.moveAnnounceTimer !== null) {
      clearTimeout(this.moveAnnounceTimer);
    }
    const index = this.focusedIndex;
    const total = this.totalItemCount;
    this.moveAnnounceTimer = setTimeout(() => {
      this.moveAnnounceTimer = null;
      const item = this.getItemAtIndex(index);
      if (!item) {
        return;
      }
      const position = `${index + 1} of ${total}`;
      this.announce(this.i18n.itemNavigation(item.label, item.description, this.groupTitleAt(index), position));
    }, 50);
  }

  private scrollActiveItemIntoView() {
    const index = this.focusedIndex;
    requestAnimationFrame(() => {
      if (this.isDestroying) {
        return;
      }
      const options = this.popupElement?.querySelectorAll<HTMLElement>('li[role="option"]');
      options?.[index]?.scrollIntoView({ block: 'nearest' });
    });
  }

  private readonly handleEditorKeyDown = (event: KeyboardEvent) => {
    if (!this.trigger || this.totalItemCount === 0) {
      // Escape should still close a trigger with zero resolved items yet -
      // matches upstream's own early return, which blocks Escape here too.
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        this.focusedIndex = this.navigateTo(this.focusedIndex, 1);
        this.scheduleMoveAnnouncement();
        this.scrollActiveItemIntoView();
        break;
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        this.focusedIndex = this.navigateTo(this.focusedIndex, -1);
        this.scheduleMoveAnnouncement();
        this.scrollActiveItemIntoView();
        break;
      case 'Home': {
        event.preventDefault();
        event.stopPropagation();
        const total = this.totalItemCount;
        let first = 0;
        while (first < total && this.getItemAtIndex(first)?.disabled) {
          first++;
        }
        this.focusedIndex = first < total ? first : this.focusedIndex;
        this.scheduleMoveAnnouncement();
        this.scrollActiveItemIntoView();
        break;
      }
      case 'End': {
        event.preventDefault();
        event.stopPropagation();
        let last = this.totalItemCount - 1;
        while (last >= 0 && this.getItemAtIndex(last)?.disabled) {
          last--;
        }
        this.focusedIndex = last >= 0 ? last : this.focusedIndex;
        this.scheduleMoveAnnouncement();
        this.scrollActiveItemIntoView();
        break;
      }
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        this.cancel();
        break;
      case 'Enter': {
        event.preventDefault();
        event.stopPropagation();
        const item = this.getItemAtIndex(this.focusedIndex);
        if (item) {
          this.handleItemClick(item);
        }
        break;
      }
      default:
        break;
    }
  };

  private readonly handleEditorFocusOut = (event: FocusEvent) => {
    const related = event.relatedTarget as Node | null;
    if (related && this.popupElement?.contains(related)) {
      return;
    }
    this.cancel();
  };

  private readonly handleDocumentClick = (event: MouseEvent) => {
    if (!this.trigger) {
      return;
    }
    const path = event.composedPath();
    if (this.popupElement && path.includes(this.popupElement)) {
      return;
    }
    if (this.listenTarget && path.includes(this.listenTarget)) {
      return;
    }
    this.cancel();
  };

  private readonly preventMousedown = (event: MouseEvent) => {
    // Prevent the click from stealing focus away from the editor before the
    // resulting `click` event (which actually performs the selection) fires.
    event.preventDefault();
  };

  attachListeners = eModifier<{ Element: HTMLDivElement }>((element) => {
    this.popupElement = element;
    const target = this.args.target ?? element.closest<HTMLElement>('.cds-aichat-prompt-line-shell') ?? element.parentElement;
    this.listenTarget = target ?? null;
    if (target) {
      target.addEventListener('cds-aichat-trigger-change', this.handleTriggerChangeEvent);
      target.addEventListener('keydown', this.handleEditorKeyDown, true);
      target.addEventListener('focusout', this.handleEditorFocusOut);
    }
    document.addEventListener('click', this.handleDocumentClick);
    return () => {
      if (target) {
        target.removeEventListener('cds-aichat-trigger-change', this.handleTriggerChangeEvent);
        target.removeEventListener('keydown', this.handleEditorKeyDown, true);
        target.removeEventListener('focusout', this.handleEditorFocusOut);
      }
      document.removeEventListener('click', this.handleDocumentClick);
      if (this.moveAnnounceTimer !== null) {
        clearTimeout(this.moveAnnounceTimer);
        this.moveAnnounceTimer = null;
      }
      this.popupElement = null;
      this.listenTarget = null;
    };
  });

  // Re-resolves the active trigger's items against fresh configs, matching
  // upstream's `AutocompleteController.setConfigs`. Runs on every args
  // change (including the first, when `this.trigger` is still null - a
  // harmless no-op).
  watchConfigs = eModifier<{
    Element: HTMLDivElement;
    Args: {
      Positional: [TriggerSuggestionConfig | undefined, TriggerSuggestionConfig | undefined, AutocompleteConfig | undefined, StartersConfig | undefined];
    };
  }>(() => {
    if (this.trigger) {
      this.kickoffResolve(this.trigger);
    }
  });

  <template>
    <div
      class='cds-aichat-autocomplete-controller'
      {{this.attachListeners}}
      {{this.watchConfigs @mention @command @autocomplete @starters}}
      ...attributes
    >
      <div class='cds-aichat-autocomplete__live-region' aria-live='polite' aria-atomic='false'>{{this.regionA}}</div>
      <div class='cds-aichat-autocomplete__live-region' aria-live='polite' aria-atomic='false'>{{this.regionB}}</div>
      {{#if this.hasItems}}
        {{! template-lint-disable no-invalid-interactive }}
        {{! template-lint-disable no-pointer-down-event-binding }}
        <div class='cds-aichat-autocomplete' {{on 'mousedown' this.preventMousedown}}>
          {{#if @headerConfig.showHeader}}
            <div class='cds-aichat-autocomplete__header'>
              <span class='cds-aichat-autocomplete__title'>{{@headerConfig.title}}</span>
            </div>
          {{/if}}
          <ul
            class='cds-aichat-autocomplete__items'
            role='listbox'
            tabindex='0'
            aria-label={{this.i18n.listboxLabel}}
            aria-activedescendant={{this.activeOptionId}}
          >
            {{#each this.listGroups as |group|}}
              {{#if this.hasGroups}}
                <ul
                  role='group'
                  class='cds-aichat-autocomplete-item-group__items'
                  aria-label={{group.ariaLabel}}
                  aria-labelledby={{group.labelId}}
                >
                  {{#if group.title}}
                    <li role='presentation' id={{group.labelId}} class='cds-aichat-autocomplete-item-group__title'>
                      {{group.title}}
                    </li>
                  {{/if}}
                  {{#each group.entries as |entry|}}
                    <ItemRow @entry={{entry}} @onItemClick={{this.handleItemClick}} @onItemMouseEnter={{this.handleItemMouseEnter}} />
                  {{/each}}
                </ul>
              {{else}}
                {{#each group.entries as |entry|}}
                  <ItemRow @entry={{entry}} @onItemClick={{this.handleItemClick}} @onItemMouseEnter={{this.handleItemMouseEnter}} />
                {{/each}}
              {{/if}}
            {{/each}}
          </ul>
        </div>
      {{/if}}
    </div>
  </template>
}
