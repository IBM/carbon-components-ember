/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { registerDestructor } from '@ember/destroyable';
import { element } from 'ember-element-helper';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import didUpdate from '@ember/render-modifiers/modifiers/did-update';

/**
 * @deprecated Use NewPopoverAlignment instead.
 */
export type DeprecatedPopoverAlignment =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'left-bottom'
  | 'left-top'
  | 'right-bottom'
  | 'right-top';

export type NewPopoverAlignment =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-end'
  | 'left-start'
  | 'right-end'
  | 'right-start';

export type PopoverAlignment = DeprecatedPopoverAlignment | NewPopoverAlignment;

const deprecatedAlignmentMap: Record<string, NewPopoverAlignment> = {
  'top-left': 'top-start',
  'top-right': 'top-end',
  'bottom-left': 'bottom-start',
  'bottom-right': 'bottom-end',
  'left-bottom': 'left-end',
  'left-top': 'left-start',
  'right-bottom': 'right-end',
  'right-top': 'right-start',
};

function mapPopoverAlign(align: PopoverAlignment): NewPopoverAlignment {
  return deprecatedAlignmentMap[align] ?? (align as NewPopoverAlignment);
}

const flippedAlignmentMap: Record<string, NewPopoverAlignment> = {
  top: 'bottom',
  'top-start': 'bottom-start',
  'top-end': 'bottom-end',
  bottom: 'top',
  'bottom-start': 'top-start',
  'bottom-end': 'top-end',
  left: 'right',
  'left-start': 'right-start',
  'left-end': 'right-end',
  right: 'left',
  'right-start': 'left-start',
  'right-end': 'left-end',
};

export interface PopoverArgs {
  /**
   * Specify how the popover should align with the trigger element.
   */
  align?: PopoverAlignment;
  /**
   * **Experimental:** Provide an offset value for alignment axis. Only takes
   * effect when `autoAlign` is enabled. Not currently implemented in this
   * Ember port.
   */
  alignmentAxisOffset?: number;
  /**
   * The element type to render the outermost node as.
   */
  as?: keyof HTMLElementTagNameMap;
  /**
   * Will auto-align the popover on first render if it is not visible within
   * the viewport (or `autoAlignBoundary`, if provided).
   */
  autoAlign?: boolean;
  /**
   * Specify a bounding element to be used for autoAlign calculations. The
   * viewport is used by default.
   */
  autoAlignBoundary?: HTMLElement;
  /**
   * Specify the background token to use. Default is 'layer'.
   */
  backgroundToken?: 'layer' | 'background';
  /**
   * Specify whether a border should be rendered on the popover.
   */
  border?: boolean;
  /**
   * Specify whether a caret should be rendered.
   */
  caret?: boolean;
  /**
   * Specify whether a drop shadow should be rendered on the popover.
   */
  dropShadow?: boolean;
  /**
   * Render the component using the high-contrast variant.
   */
  highContrast?: boolean;
  /**
   * Render the component using the tab tip variant.
   */
  isTabTip?: boolean;
  /**
   * Specify a handler for closing the popover. The handler should take care
   * of closing the popover, e.g. changing the `open` argument. Called when
   * the user clicks outside of the popover or presses Escape while focus is
   * inside the popover content.
   */
  onRequestClose?: () => void;
  /**
   * Specify whether the component is currently open or closed.
   */
  open: boolean;
}

export interface PopoverSignature {
  Element: HTMLElement;
  Args: PopoverArgs;
  Blocks: {
    default: [];
  };
}

/**
 * `Popover` is used for triggering a pop-up next to a trigger element,
 * typically a button, in a given direction.
 *
 * ```gjs
 * import { Popover, PopoverContent } from 'carbon-components-ember/components';
 *
 * <template>
 *   <Popover @open={{true}}>
 *     <button type="button">Trigger</button>
 *     <PopoverContent>Content</PopoverContent>
 *   </Popover>
 * </template>
 * ```
 */
export default class Popover extends Component<PopoverSignature> {
  @tracked autoAlignResult: NewPopoverAlignment | null = null;

  containerElement?: HTMLElement;

  constructor(owner: any, args: PopoverArgs) {
    super(owner, args);
    registerDestructor(this, () => {
      document.removeEventListener('click', this.handleDocumentClick);
      document.removeEventListener('keydown', this.handleDocumentKeydown);
    });
  }

  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'span';
  }

  get caret() {
    return this.args.caret ?? !this.args.isTabTip;
  }

  get dropShadow() {
    return this.args.dropShadow ?? true;
  }

  get baseAlign(): NewPopoverAlignment {
    const align = this.args.align ?? (this.args.isTabTip ? 'bottom-start' : 'bottom');
    return mapPopoverAlign(align);
  }

  get align(): NewPopoverAlignment {
    return this.autoAlignResult ?? this.baseAlign;
  }

  get classes() {
    const classes = ['cds--popover-container'];
    if (this.caret) {
      classes.push('cds--popover--caret');
    }
    if (this.dropShadow) {
      classes.push('cds--popover--drop-shadow');
    }
    if (this.args.border) {
      classes.push('cds--popover--border');
    }
    if (this.args.highContrast) {
      classes.push('cds--popover--high-contrast');
    }
    if (this.args.open) {
      classes.push('cds--popover--open');
    }
    classes.push(`cds--popover--${this.align}`);
    if (this.args.isTabTip) {
      classes.push('cds--popover--tab-tip');
    }
    if (this.args.backgroundToken === 'background' && !this.args.highContrast) {
      classes.push('cds--popover--background-token__background');
    }
    return classes.join(' ');
  }

  @action
  setup(el: HTMLElement) {
    this.containerElement = el;
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('keydown', this.handleDocumentKeydown);
    this.update();
  }

  @action
  update() {
    this.markTabTipTrigger();
    this.updateAutoAlign();
  }

  markTabTipTrigger() {
    const trigger = this.containerElement?.querySelector<HTMLElement>(
      ':scope > *:not(.cds--popover)',
    );
    trigger?.classList.toggle('cds--popover--tab-tip__button', !!this.args.isTabTip);
  }

  updateAutoAlign() {
    if (!this.args.autoAlign || !this.args.open || !this.containerElement) {
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

    let align = this.baseAlign;
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

  handleDocumentClick = (event: MouseEvent) => {
    if (!this.args.open || !this.containerElement) {
      return;
    }
    const target = event.target as Node;
    if (!this.containerElement.contains(target)) {
      this.args.onRequestClose?.();
    }
  };

  handleDocumentKeydown = (event: KeyboardEvent) => {
    if (!this.args.open || event.key !== 'Escape' || !this.containerElement) {
      return;
    }
    const target = event.target;
    if (!(target instanceof Element) || !target.closest('.cds--popover-content')) {
      return;
    }
    if (!this.containerElement.contains(target)) {
      return;
    }
    this.args.onRequestClose?.();
    this.containerElement
      .querySelector<HTMLElement>('button, [tabindex]')
      ?.focus();
  };

  <template>
    {{#let (element this.tag) as |Tag|}}
      <Tag
        class={{this.classes}}
        {{didInsert this.setup}}
        {{didUpdate this.update @open @autoAlign @isTabTip}}
        ...attributes
      >
        {{yield}}
      </Tag>
    {{/let}}
  </template>
}

export interface PopoverContentSignature {
  Element: HTMLSpanElement;
  Args: {};
  Blocks: {
    default: [];
  };
}

/**
 * `PopoverContent` renders the floating content of a `Popover`. It must be
 * used as a direct child of `Popover`, alongside the trigger element.
 */
export class PopoverContent extends Component<PopoverContentSignature> {
  <template>
    <span class='cds--popover'>
      <span class='cds--popover-content' ...attributes>
        {{yield}}
      </span>
      <span class='cds--popover-caret'></span>
    </span>
  </template>
}
