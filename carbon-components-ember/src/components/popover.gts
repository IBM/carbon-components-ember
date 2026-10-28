/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { arrow, flip, hide, offset } from '@floating-ui/dom';
import closeOnOutsideClick from '../modifiers/close-on-outside-click.ts';
import { clippingBoundary, float } from '../utils/floating.ts';
import './popover.scss';

import type { Boundary, Placement } from '@floating-ui/dom';
import type { ModifierLike, WithBoundArgs } from '@glint/template';

/** Carbon React's `NewPopoverAlignment` values. */
export const NewPopoverAlignments = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end',
] as const;

const deprecatedPopoverAlignments = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'left-bottom',
  'left-top',
  'right-bottom',
  'right-top',
] as const;

/** Every alignment Carbon React's `PopoverAlignment` takes. */
export const PopoverAlignments = [
  ...NewPopoverAlignments,
  ...deprecatedPopoverAlignments,
] as const;

export type NewPopoverAlignment = (typeof NewPopoverAlignments)[number];

/**
 * @deprecated Use NewPopoverAlignment instead.
 */
export type DeprecatedPopoverAlignment =
  (typeof deprecatedPopoverAlignments)[number];

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

// Carbon React's flip fallbacks: the requested side first, then the others.
const fallbackPlacements: Record<'top' | 'bottom', NewPopoverAlignment[]> = {
  top: [
    'top',
    'top-start',
    'top-end',
    'left',
    'left-start',
    'left-end',
    'right',
    'right-start',
    'right-end',
    'bottom',
    'bottom-start',
    'bottom-end',
  ],
  bottom: [
    'bottom',
    'bottom-start',
    'bottom-end',
    'right',
    'right-start',
    'right-end',
    'left',
    'left-start',
    'left-end',
    'top',
    'top-start',
    'top-end',
  ],
};

const tabTipFallbackPlacements: Record<
  'top' | 'bottom',
  NewPopoverAlignment[]
> = {
  top: ['top-start', 'top-end', 'bottom-start', 'bottom-end'],
  bottom: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
};

const caretStaticSide = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
} as const;

function toPixels(value: string): number | undefined {
  if (!value) return undefined;
  const number = parseFloat(value);
  return value.includes('px') ? number : number * 16;
}

export interface PopoverSignature {
  Element: HTMLElement;
  Args: {
    /**
     * Specify how the popover should align with the trigger element.
     */
    align?: PopoverAlignment;
    /**
     * **Experimental:** Provide an offset value for alignment axis. Only takes
     * effect when `autoAlign` is enabled.
     */
    alignmentAxisOffset?: number;
    /**
     * The element type to render the outermost node as.
     */
    as?: keyof HTMLElementTagNameMap;
    /**
     * **Experimental:** Positions the content with Floating UI and keeps it
     * within the viewport (or `autoAlignBoundary`, if provided), flipping it
     * to another side when it doesn't fit. The content renders in the top
     * layer, so overflowing ancestors don't clip it.
     */
    autoAlign?: boolean;
    /**
     * **Experimental:** Specify a bounding element to be used for autoAlign
     * calculations. The viewport is used by default.
     */
    autoAlignBoundary?: Boundary;
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
  };
  Blocks: {
    /**
     * The trigger, with the yielded `trigger` modifier on it, then the
     * yielded `PopoverContent`. `@autoAlign` positions against the element
     * `trigger` marks and `@isTabTip` styles it, so both need it.
     */
    default: [
      PopoverContent: WithBoundArgs<typeof PopoverContent, 'popover'>,
      trigger: ModifierLike<{ Element: HTMLElement }>,
    ];
  };
}

/**
 * `Popover` is used for triggering a pop-up next to a trigger element,
 * typically a button, in a given direction.
 *
 * ```gjs
 * import { Popover } from 'carbon-components-ember/components';
 *
 * <template>
 *   <Popover @open={{true}} as |PopoverContent trigger|>
 *     <button type="button" {{trigger}}>Trigger</button>
 *     <PopoverContent>Content</PopoverContent>
 *   </Popover>
 * </template>
 * ```
 */
export default class Popover extends Component<PopoverSignature> {
  @tracked placement?: Placement;
  // Registered by PopoverContent; content rendered by hand is looked up.
  // tracked() skips equal writes, so re-registering doesn't re-position.
  #contentElement = tracked<HTMLElement | undefined>(undefined);
  #caretElement = tracked<HTMLElement | undefined>(undefined);
  #triggerElement = tracked<HTMLElement | undefined>(undefined);

  /**
   * Marks the caller's trigger, as Carbon React's ref on it: floating mode
   * positions against it, and `manage` styles it for a tab tip.
   */
  trigger = modifier((element: HTMLElement) => {
    this.#triggerElement.value = element;
    return () => {
      if (this.#triggerElement.value === element) {
        this.#triggerElement.value = undefined;
      }
    };
  });

  get contentElement() {
    return this.#contentElement.value;
  }

  set contentElement(element: HTMLElement | undefined) {
    this.#contentElement.value = element;
  }

  get caretElement() {
    return this.#caretElement.value;
  }

  set caretElement(element: HTMLElement | undefined) {
    this.#caretElement.value = element;
  }

  containerElement?: HTMLElement;

  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'span';
  }

  get caret() {
    return this.args.caret ?? !this.args.isTabTip;
  }

  get dropShadow() {
    return this.args.dropShadow ?? true;
  }

  get floating() {
    return Boolean(this.args.autoAlign);
  }

  get baseAlign(): NewPopoverAlignment {
    const align =
      this.args.align ?? (this.args.isTabTip ? 'bottom-start' : 'bottom');
    return mapPopoverAlign(align);
  }

  get align(): NewPopoverAlignment {
    return (this.floating ? this.placement : undefined) ?? this.baseAlign;
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
    if (this.floating) {
      classes.push('cds--popover--auto-align', 'cds--autoalign');
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

  manage = modifier((element: HTMLElement) => {
    this.containerElement = element;
    this.#triggerElement.value?.classList.toggle(
      'cds--popover--tab-tip__button',
      !!this.args.isTabTip,
    );
  });

  // Only a Popover that can ask to close needs the document listeners.
  get listensForClose() {
    return Boolean(this.args.open && this.args.onRequestClose);
  }

  /**
   * Floating mode (`@autoAlign`), configured like Carbon React's
   * `useFloating` call. The reference is the element `trigger` marks.
   */
  positionContent = modifier((container: HTMLElement) => {
    if (!this.floating || !this.args.open) return;
    const reference = this.#triggerElement.value;
    const content =
      this.contentElement ??
      container.querySelector<HTMLElement>(
        ':scope > .cds--popover > .cds--popover-content',
      );
    if (!reference || !content) return;
    const caretElement =
      this.caretElement ??
      content.querySelector<HTMLElement>(':scope > .cds--popover-caret');

    const { caret, baseAlign } = this;
    const isTabTip = Boolean(this.args.isTabTip);
    const side = baseAlign.includes('bottom') ? 'bottom' : 'top';

    let popoverOffset = 10;
    let caretHeight = container.querySelector(
      ':scope > [class*="ai-label"], :scope > [class*="slug"]',
    )
      ? 7
      : 6;
    if (caret) {
      const style = getComputedStyle(container);
      popoverOffset =
        toPixels(style.getPropertyValue('--cds-popover-offset')) ??
        popoverOffset;
      caretHeight =
        toPixels(style.getPropertyValue('--cds-popover-caret-height')) ??
        caretHeight;
    }

    return float(reference, content, {
      placement: baseAlign,
      topLayer: true,
      middleware: [
        offset(
          isTabTip
            ? 0
            : {
                alignmentAxis: this.args.alignmentAxisOffset,
                mainAxis: caret ? popoverOffset : 4,
              },
        ),
        flip({
          fallbackPlacements: (isTabTip
            ? tabTipFallbackPlacements
            : fallbackPlacements)[side],
          fallbackStrategy: 'initialPlacement',
          fallbackAxisSideDirection: 'start',
          boundary: this.args.autoAlignBoundary,
        }),
        caretElement && arrow({ element: caretElement, padding: 16 }),
        // Derived on each update: a Modal opening in the same render isn't
        // in the top layer yet when this runs.
        hide(() => ({ boundary: clippingBoundary(reference) })),
      ],
      onUpdate: ({ placement, middlewareData }) => {
        if (this.placement !== placement) {
          this.placement = placement;
        }
        if (!caret || !caretElement || !middlewareData.arrow) return;
        const { x, y } = middlewareData.arrow;
        const staticSide =
          caretStaticSide[
            placement.split('-')[0] as keyof typeof caretStaticSide
          ];
        caretElement.style.left = x == null ? '' : `${x}px`;
        caretElement.style.top = y == null ? '' : `${y}px`;
        caretElement.style.right = '';
        caretElement.style.bottom = '';
        caretElement.style[staticSide] = `${-caretHeight}px`;
      },
    });
  });

  handleOutsideClick = () => {
    if (this.args.open) {
      this.args.onRequestClose?.();
    }
  };

  // Escape in its own content closes it, and goes no further: a Popover or
  // Modal around it stays open.
  handleKeydown = (event: KeyboardEvent) => {
    if (
      !this.listensForClose ||
      event.key !== 'Escape' ||
      event.defaultPrevented ||
      !this.containerElement
    ) {
      return;
    }
    const target = event.target;
    const content =
      target instanceof Element
        ? target.closest('.cds--popover-content')
        : null;
    if (content?.parentElement?.parentElement !== this.containerElement) {
      return;
    }
    event.stopPropagation();
    this.args.onRequestClose?.();
    this.containerElement
      .querySelector<HTMLElement>('button, [tabindex]')
      ?.focus();
  };

  <template>
    {{#let (element this.tag) as |Tag|}}
      <Tag
        class={{this.classes}}
        {{this.manage}}
        {{this.positionContent}}
        {{on "keydown" this.handleKeydown}}
        {{(if this.listensForClose closeOnOutsideClick)
          this.handleOutsideClick
        }}
        ...attributes
      >
        {{yield (component PopoverContent popover=this) this.trigger}}
      </Tag>
    {{/let}}
  </template>
}

export interface PopoverContentSignature {
  Args: {
    /** The Popover it belongs to, bound by the Popover that yields it. */
    popover: Popover;
  };
  Element: HTMLSpanElement;
  Blocks: {
    default: [];
  };
}

/**
 * `PopoverContent` renders the floating content of a `Popover`, which
 * yields it already bound to itself. Render it directly inside the Popover,
 * next to the trigger.
 */
export class PopoverContent extends Component<PopoverContentSignature> {
  /** In floating mode, Carbon puts the caret inside the content. */
  get floating() {
    return this.args.popover.floating;
  }

  register = modifier((content: HTMLElement) => {
    const { popover } = this.args;
    popover.contentElement = content;
    return () => {
      if (popover.contentElement === content) {
        popover.contentElement = undefined;
      }
    };
  });

  registerCaret = modifier((caret: HTMLElement) => {
    const { popover } = this.args;
    popover.caretElement = caret;
    return () => {
      if (popover.caretElement === caret) {
        popover.caretElement = undefined;
      }
    };
  });

  <template>
    <span class="cds--popover">
      {{! Not on the .cds--popover, as React: a tooltip's id there leaves its
        trigger unnamed in testing-library, which skips the hidden content. }}
      <span class="cds--popover-content" {{this.register}} ...attributes>
        {{yield}}
        {{#if this.floating}}
          <span
            class="cds--popover-caret cds--popover--auto-align"
            {{this.registerCaret}}
          ></span>
        {{/if}}
      </span>
      {{#unless this.floating}}
        <span class="cds--popover-caret"></span>
      {{/unless}}
    </span>
  </template>
}
