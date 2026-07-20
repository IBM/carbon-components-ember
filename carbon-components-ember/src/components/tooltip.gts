/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import { defaultArgs } from '../utils/decorators.ts';

export const TooltipAlignments = [
  'top',
  'top-left',
  'top-start',
  'top-right',
  'top-end',
  'bottom',
  'bottom-left',
  'bottom-start',
  'bottom-right',
  'bottom-end',
  'left',
  'left-bottom',
  'left-end',
  'left-top',
  'left-start',
  'right',
  'right-bottom',
  'right-end',
  'right-top',
  'right-start',
] as const;

export type TooltipAlignment = (typeof TooltipAlignments)[number];

export type Args = {
  /** Where the tooltip is placed relative to the trigger */
  align?: TooltipAlignment;
  /** Label text identifying the trigger, announced via aria-labelledby */
  label?: string;
  /** Description text for the trigger, announced via aria-describedby */
  description?: string;
  /** Close the tooltip when the trigger is activated (click, Enter, Space) */
  closeOnActivation?: boolean;
  /** Render the tooltip open on initial render */
  defaultOpen?: boolean;
  /** Render a drop shadow on the tooltip */
  dropShadow?: boolean;
  /** Delay in ms before the tooltip shows on hover */
  enterDelayMs?: number;
  /** Render with the high contrast theme */
  highContrast?: boolean;
  /** Delay in ms before the tooltip hides after the pointer leaves */
  leaveDelayMs?: number;
};

export interface CarbonTooltipSignature {
  Element: HTMLSpanElement;
  Args: Args;
  Blocks: {
    /** The trigger element the tooltip is attached to */
    default: [];
    /** Custom tooltip content, used instead of @label/@description */
    content: [];
  };
}

export default class CarbonTooltip extends Component<CarbonTooltipSignature> {
  @defaultArgs
  args: Args = {
    align: 'top',
    closeOnActivation: false,
    defaultOpen: false,
    dropShadow: false,
    enterDelayMs: 100,
    highContrast: true,
    leaveDelayMs: 300,
  };

  @tracked open = this.args.defaultOpen ?? false;

  timer?: ReturnType<typeof setTimeout>;

  willDestroy() {
    super.willDestroy();
    clearTimeout(this.timer);
  }

  get id() {
    return `${guidFor(this)}-tooltip`;
  }

  get classes() {
    const classes = [
      'cds--popover-container',
      'cds--popover--caret',
      'cds--tooltip',
      `cds--popover--${this.args.align}`,
    ];
    if (this.args.highContrast) classes.push('cds--popover--high-contrast');
    if (this.args.dropShadow) classes.push('cds--popover--drop-shadow');
    if (this.open) classes.push('cds--popover--open');
    return classes.join(' ');
  }

  setOpen(open: boolean, delayMs: number | undefined) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (!this.isDestroying) {
        this.open = open;
      }
    }, delayMs ?? 0);
  }

  @action
  onMouseEnter() {
    this.setOpen(true, this.args.enterDelayMs);
  }

  @action
  onMouseLeave() {
    this.setOpen(false, this.args.leaveDelayMs);
  }

  @action
  onFocusIn() {
    clearTimeout(this.timer);
    this.open = true;
  }

  @action
  onFocusOut() {
    clearTimeout(this.timer);
    this.open = false;
  }

  @action
  onKeyDown(event: KeyboardEvent) {
    if (this.open && event.key === 'Escape') {
      event.stopPropagation();
      this.open = false;
    }
    if (this.args.closeOnActivation && ['Enter', ' '].includes(event.key)) {
      clearTimeout(this.timer);
      this.open = false;
    }
  }

  @action
  onClick() {
    if (this.args.closeOnActivation) {
      clearTimeout(this.timer);
      this.open = false;
    }
  }

  <template>
    {{! template-lint-disable no-invalid-interactive }}
    <span
      class={{this.classes}}
      ...attributes
      {{on 'mouseenter' this.onMouseEnter}}
      {{on 'mouseleave' this.onMouseLeave}}
      {{on 'focusin' this.onFocusIn}}
      {{on 'focusout' this.onFocusOut}}
      {{on 'keydown' this.onKeyDown}}
      {{on 'click' this.onClick}}
    >
      <span
        class='cds--tooltip-trigger__wrapper'
        aria-labelledby={{if @label this.id}}
        aria-describedby={{unless @label this.id}}
      >
        {{yield}}
      </span>
      <span class='cds--popover'>
        <span
          class='cds--popover-content cds--tooltip-content'
          id={{this.id}}
          role='tooltip'
          aria-hidden={{if this.open 'false' 'true'}}
        >
          {{#if (has-block 'content')}}
            {{yield to='content'}}
          {{else if @label}}
            {{@label}}
          {{else}}
            {{@description}}
          {{/if}}
        </span>
        <span class='cds--popover-caret'></span>
      </span>
    </span>
  </template>
}
