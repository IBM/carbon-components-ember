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
import { registerDestructor } from '@ember/destroyable';
import { on } from '@ember/modifier';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import didUpdate from '@ember/render-modifiers/modifiers/did-update';
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

const flippedAlignmentMap: Record<TooltipAlignment, TooltipAlignment> = {
  top: 'bottom',
  'top-left': 'bottom-left',
  'top-start': 'bottom-start',
  'top-right': 'bottom-right',
  'top-end': 'bottom-end',
  bottom: 'top',
  'bottom-left': 'top-left',
  'bottom-start': 'top-start',
  'bottom-right': 'top-right',
  'bottom-end': 'top-end',
  left: 'right',
  'left-bottom': 'right-bottom',
  'left-end': 'right-end',
  'left-top': 'right-top',
  'left-start': 'right-start',
  right: 'left',
  'right-bottom': 'left-bottom',
  'right-end': 'left-end',
  'right-top': 'left-top',
  'right-start': 'left-start',
};

export type Args = {
  /** Where the tooltip is placed relative to the trigger */
  align?: TooltipAlignment;
  /** Label text identifying the trigger, announced via aria-labelledby */
  label?: string;
  /** Description text for the trigger, announced via aria-describedby */
  description?: string;
  /**
   * Will auto-align the tooltip on open if it is not visible within the
   * viewport (or `autoAlignBoundary`, if provided).
   */
  autoAlign?: boolean;
  /**
   * Specify a bounding element to be used for autoAlign calculations. The
   * viewport is used by default.
   */
  autoAlignBoundary?: HTMLElement;
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
  @tracked autoAlignResult: TooltipAlignment | null = null;

  timer?: ReturnType<typeof setTimeout>;
  containerElement?: HTMLElement;

  constructor(owner: any, args: Args) {
    super(owner, args);
    registerDestructor(this, () => clearTimeout(this.timer));
  }

  get id() {
    return `${guidFor(this)}-tooltip`;
  }

  get align(): TooltipAlignment {
    return this.autoAlignResult ?? this.args.align ?? 'top';
  }

  get classes() {
    const classes = [
      'cds--popover-container',
      'cds--popover--caret',
      'cds--tooltip',
      `cds--popover--${this.align}`,
    ];
    if (this.args.highContrast) classes.push('cds--popover--high-contrast');
    if (this.args.dropShadow) classes.push('cds--popover--drop-shadow');
    if (this.open) classes.push('cds--popover--open');
    return classes.join(' ');
  }

  @action
  setup(el: HTMLElement) {
    this.containerElement = el;
    this.updateAutoAlign();
  }

  @action
  update() {
    this.updateAutoAlign();
  }

  updateAutoAlign() {
    if (!this.args.autoAlign || !this.open || !this.containerElement) {
      this.autoAlignResult = null;
      return;
    }

    const content = this.containerElement.querySelector<HTMLElement>(
      '.cds--popover-content',
    );
    if (!content) {
      return;
    }

    const boundary = this.args.autoAlignBoundary;
    const boundaryRect = boundary
      ? boundary.getBoundingClientRect()
      : { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight };
    const rect = content.getBoundingClientRect();

    let align = this.args.align ?? 'top';
    const overflowsVertically = rect.top < boundaryRect.top || rect.bottom > boundaryRect.bottom;
    const overflowsHorizontally = rect.left < boundaryRect.left || rect.right > boundaryRect.right;

    if (
      ((align.startsWith('top') || align.startsWith('bottom')) && overflowsVertically) ||
      ((align.startsWith('left') || align.startsWith('right')) && overflowsHorizontally)
    ) {
      align = flippedAlignmentMap[align] ?? align;
    }

    this.autoAlignResult = align;
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
      {{didInsert this.setup}}
      {{didUpdate this.update this.open this.args.align}}
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
