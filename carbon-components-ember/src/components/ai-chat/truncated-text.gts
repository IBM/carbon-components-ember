/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import { default as didInsert } from '@ember/render-modifiers/modifiers/did-insert';
import { default as didUpdate } from '@ember/render-modifiers/modifiers/did-update';
import { default as Tooltip, type TooltipAlignments } from '../tooltip.gts';

export type Args = {
  /** Tooltip alignment when `@type` is `'tooltip'`. Defaults to `'top'`. */
  align?: (typeof TooltipAlignments)[number];
  /** Auto-align the tooltip so it stays within the viewport. */
  autoalign?: boolean;
  /** Label for the collapse ("show less") button in `'expand'` mode. */
  collapseLabel?: string;
  /** Label for the expand ("show more") button in `'expand'` mode. */
  expandLabel?: string;
  id?: string;
  /** Maximum number of lines to show before truncating. Defaults to `0` (no clamping). */
  lines?: number;
  /**
   * How the full text is revealed once truncated: a `'tooltip'` on
   * hover/focus, or an inline `'expand'`/collapse toggle. Defaults to
   * `'tooltip'`.
   */
  type?: 'tooltip' | 'expand';
  /** The string to truncate. Ignored if a default block is passed. */
  value?: string;
  /**
   * When `true`, renders the `'expand'` toggle button's layered
   * background variant. Upstream derives this by sniffing for a
   * `cds-layer` DOM ancestor at connect time; this port exposes it as a
   * plain arg instead rather than reproducing that ancestry sniffing.
   */
  isLayered?: boolean;
};

export interface AiChatTruncatedTextSignature {
  Element: HTMLDivElement;
  Args: Args;
  Blocks: {
    /** Alternative to `@value` for rich/slotted content. */
    default: [];
  };
}

/**
 * Truncates text (or arbitrary content) to a maximum number of lines,
 * revealing the rest via a tooltip or an inline expand/collapse toggle.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-truncated-text`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/truncated-text).
 * Upstream sets `--line-clamp-value`/`--max-height-value` custom
 * properties through a shared shadow-DOM stylesheet helper needed only
 * because of Lit shadow DOM + a strict CSP; this addon renders in light
 * DOM and already uses plain inline `style` attributes elsewhere (see
 * `Pagination`'s `Loading`), so those are set directly here instead.
 *
 * The tooltip variant's label always uses `@value` (plain text), even
 * when a default block is passed for the visible content — matching
 * upstream's own behavior.
 */
export default class AiChatTruncatedText extends Component<AiChatTruncatedTextSignature> {
  @tracked isOverflowing = false;
  @tracked isExpanded = false;
  @tracked maxHeight = 'none';
  lineHeight = 0;
  resizeObserver?: ResizeObserver;
  contentElement?: HTMLElement;
  pendingRaf?: number;

  get type() {
    return this.args.type ?? 'tooltip';
  }

  get lines() {
    return this.args.lines ?? 0;
  }

  get contentId() {
    return this.args.id ?? `${guidFor(this)}-truncated-text`;
  }

  get lineClampValue() {
    return this.lines === 0 ? 'none' : String(this.lines);
  }

  get maxHeightValue() {
    return this.maxHeight || 'none';
  }

  get contentStyle() {
    return `--line-clamp-value: ${this.lineClampValue}; --max-height-value: ${this.maxHeightValue};`;
  }

  get showTooltip() {
    return this.type === 'tooltip' && this.isOverflowing;
  }

  get showToggleButton() {
    return this.isOverflowing || this.isExpanded;
  }

  constructor(owner: any, args: AiChatTruncatedTextSignature['Args']) {
    super(owner, args);
    registerDestructor(this, this.teardown);
  }

  teardown = () => {
    if (this.pendingRaf !== undefined) {
      cancelAnimationFrame(this.pendingRaf);
      this.pendingRaf = undefined;
    }
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
  };

  setup = (element: HTMLElement) => {
    // Each toggle between the tooltip/expand `{{#if}}` branches tears down
    // and recreates this element (and re-fires `didInsert`), so any
    // observer/RAF from a previous `setup()` call must be cleaned up here
    // rather than only at component destroy time.
    this.teardown();
    this.contentElement = element;
    this.pendingRaf = requestAnimationFrame(() => {
      this.lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      this.updateOverflowStatus();
    });
    this.resizeObserver = new ResizeObserver(() => this.updateOverflowStatus());
    this.resizeObserver.observe(element);
  };

  recalculate = () => {
    this.updateOverflowStatus();
  };

  updateOverflowStatus = () => {
    const element = this.contentElement;
    if (!element || this.lines <= 0) {
      return;
    }
    this.updateMaxHeight();
    const { scrollHeight, clientHeight } = element;
    const buffer = this.lineHeight / 2;
    this.isOverflowing = scrollHeight > clientHeight + buffer;
  };

  updateMaxHeight = () => {
    if (this.type !== 'expand') {
      return;
    }
    this.maxHeight =
      this.lines > 0 && !this.isExpanded
        ? `${this.lines * this.lineHeight}px`
        : `${this.contentElement?.scrollHeight ?? 0}px`;
  };

  toggleExpansion = () => {
    this.isExpanded = !this.isExpanded;
    this.updateMaxHeight();
  };

  handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleExpansion();
    }
  };

  <template>
    <div ...attributes>
      {{#if this.showTooltip}}
        <Tooltip @align={{@align}} @autoAlign={{@autoalign}}>
          <:default>
            <div
              id={{this.contentId}}
              class='cds-aichat-truncated-text__content
                {{if this.isExpanded "cds-aichat-truncated-text__content--expanded"}}'
              style={{this.contentStyle}}
              {{didInsert this.setup}}
              {{didUpdate this.recalculate @lines @value}}
            >
              {{#if (has-block)}}
                {{yield}}
              {{else}}
                {{@value}}
              {{/if}}
            </div>
          </:default>
          <:content>
            {{@value}}
          </:content>
        </Tooltip>
      {{else}}
        <div
          id={{this.contentId}}
          class='cds-aichat-truncated-text__content
            cds-aichat-truncated-text__content--expand-type
            {{if this.isExpanded "cds-aichat-truncated-text__content--expanded"}}'
          style={{this.contentStyle}}
          {{didInsert this.setup}}
          {{didUpdate this.recalculate @lines @value}}
        >
          {{#if (has-block)}}
            {{yield}}
          {{else}}
            {{@value}}
          {{/if}}
        </div>
        {{#if this.showToggleButton}}
          <span
            aria-controls={{this.contentId}}
            aria-expanded={{this.isExpanded}}
            class='cds-aichat-truncated-text__toggle
              {{if
                this.isExpanded
                "cds-aichat-truncated-text__toggle--collapse"
                "cds-aichat-truncated-text__toggle--expand"
              }}
              {{if @isLayered "cds-aichat-truncated-text__toggle--layered"}}'
            role='button'
            tabindex='0'
            {{on 'click' this.toggleExpansion}}
            {{on 'keydown' this.handleKeydown}}
          >
            {{if this.isExpanded @collapseLabel @expandLabel}}
          </span>
        {{/if}}
      {{/if}}
    </div>
  </template>
}
