/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import { flip, hide, offset } from '@floating-ui/dom';
import closeOnOutsideClick from '../modifiers/close-on-outside-click.ts';
import { afterRender } from '../utils/after-render.ts';
import { float } from '../utils/floating.ts';
import { RovingFocus } from '../utils/roving-focus.ts';
import OverflowMenuItem from './overflow-menu/overflow-menu-item.gts';
import Tooltip from './tooltip.gts';
import OverflowMenuVertical from './icons/overflow-menu-vertical.ts';
import './overflow-menu.scss';

import type Owner from '@ember/owner';
import type { Placement } from '@floating-ui/dom';
import type { ComponentLike, WithBoundArgs } from '@glint/template';
import type { TooltipSignature } from './tooltip.gts';

export type OverflowMenuDirection = 'top' | 'bottom';

/** How far to move the menu from where it would sit centered on the trigger. */
export interface OverflowMenuOffset {
  top: number;
  left: number;
}

/** Works the offset out once the menu is in the page, as Carbon React's. */
export type OverflowMenuOffsetFunction = (
  menuBody: HTMLElement,
  direction: OverflowMenuDirection,
  trigger: HTMLElement | undefined,
  flipped: boolean,
) => OverflowMenuOffset;

export interface OverflowMenuSignature {
  Element: HTMLButtonElement;
  Args: {
    /** How the trigger's tooltip is aligned. Defaults to `top`. */
    align?: TooltipSignature['Args']['align'];
    /**
     * Names the menu for assistive technology, as Carbon React's
     * `aria-label`, which labels the menu rather than the trigger.
     */
    ariaLabel?: string;
    /** Aligns the trigger's tooltip to stay in view. */
    autoAlign?: boolean;
    /** Hides the trigger's tooltip when the trigger is pressed. Defaults to `true`. */
    closeOnActivation?: boolean;
    /** Shows the trigger's tooltip on the first render. */
    defaultOpen?: boolean;
    /**
     * The side of the trigger the menu opens on, when there's room for it
     * there; otherwise it opens on the other side. Defaults to `bottom`.
     */
    direction?: OverflowMenuDirection;
    /** Disables the trigger. */
    disabled?: boolean;
    /** Gives the trigger's tooltip a drop shadow. */
    dropShadow?: boolean;
    /** Milliseconds before the trigger's tooltip shows. Defaults to 100. */
    enterDelayMs?: number;
    /** Lines the menu's end edge up with the trigger's, instead of its start edge. */
    flipped?: boolean;
    /** Gives the trigger's tooltip high contrast. Defaults to `true`. */
    highContrast?: boolean;
    /** Classes for the trigger's icon. */
    iconClass?: string;
    /** Names the trigger, and is its tooltip. Defaults to "Options". */
    iconDescription?: string;
    /** Milliseconds before the trigger's tooltip hides. Defaults to 100. */
    leaveDelayMs?: number;
    /**
     * Moves the menu from where it would sit centered on the trigger: `top`
     * away from it, `left` to the right, as Carbon React's. Without it, the
     * menu lines up with the trigger's start edge.
     */
    menuOffset?: OverflowMenuOffset | OverflowMenuOffsetFunction;
    /** `@menuOffset` for a `@flipped` menu, lined up with the end edge without it. */
    menuOffsetFlip?: OverflowMenuOffset | OverflowMenuOffsetFunction;
    /** Classes for the menu. */
    menuOptionsClass?: string;
    /** Called when the menu closes. */
    onClose?: () => void;
    /** Called when the menu opens. */
    onOpen?: () => void;
    /** Opens or closes the menu when it changes. */
    open?: boolean;
    /** The trigger's icon, drawn at 16px. Defaults to OverflowMenuVertical. */
    renderIcon?: ComponentLike<{
      Args: { size?: number | string; svgClass?: string; ariaLabel?: string };
    }>;
    /**
     * The element to focus when the menu opens, in it. Defaults to
     * `[data-floating-menu-primary-focus]`, then its first item.
     */
    selectorPrimaryFocus?: string;
    /** The trigger's size. */
    size?: 'xs' | 'sm' | 'md' | 'lg';
    /** Classes for the trigger's tooltip. */
    wrapperClasses?: string;
  };
  Blocks: {
    default: [OverflowMenuItem: WithBoundArgs<typeof OverflowMenuItem, 'menu'>];
  };
}

/**
 * A button that opens a menu of actions, as Carbon React's OverflowMenu.
 * The menu renders in place, in the top layer, so no container clips it.
 */
export default class OverflowMenu extends Component<OverflowMenuSignature> {
  @tracked isOpen: boolean;
  // Where the menu ended up, which can differ from @direction and @flipped
  // when it doesn't fit; Carbon draws the menu's join to the trigger from it.
  @tracked placement?: Placement;
  rovingFocus = new RovingFocus({ loop: true, followFocus: false });
  menuId = `${guidFor(this)}__menu-body`;
  trigger?: HTMLButtonElement;
  #lastOpenArg: boolean;

  constructor(owner: Owner, args: OverflowMenuSignature['Args']) {
    super(owner, args);
    this.isOpen = Boolean(args.open);
    this.#lastOpenArg = this.isOpen;
  }

  get direction() {
    return this.args.direction ?? 'bottom';
  }

  get iconDescription() {
    return this.args.iconDescription ?? 'Options';
  }

  // The trigger's tooltip, with Carbon React's IconButton defaults.
  get tooltip() {
    const { args } = this;
    return {
      align: args.align ?? 'top',
      closeOnActivation: args.closeOnActivation ?? true,
      enterDelayMs: args.enterDelayMs ?? 100,
      highContrast: args.highContrast ?? true,
      leaveDelayMs: args.leaveDelayMs ?? 100,
    };
  }

  get renderIcon() {
    return this.args.renderIcon ?? OverflowMenuVertical;
  }

  get triggerClasses() {
    const { size } = this.args;
    const classes = [
      'cds--btn cds--btn--ghost cds--btn--icon-only cds--overflow-menu',
    ];
    if (size) {
      classes.push(
        `cds--btn--${size} cds--layout--size-${size} cds--overflow-menu--${size}`,
      );
    }
    if (this.args.disabled) classes.push('cds--btn--disabled');
    if (this.isOpen) classes.push('cds--overflow-menu--open');
    return classes.join(' ');
  }

  get placedDirection() {
    return this.placement?.split('-')[0] ?? this.direction;
  }

  get isFlipped() {
    const alignment = this.placement?.split('-')[1];
    return alignment ? alignment === 'end' : Boolean(this.args.flipped);
  }

  get menuClasses() {
    const { size, menuOptionsClass } = this.args;
    const classes = [
      'cds--overflow-menu-options cds--overflow-menu-options--open',
    ];
    if (this.isFlipped) classes.push('cds--overflow-menu--flip');
    if (size) {
      classes.push(
        `cds--overflow-menu-options--${size} cds--layout--size-${size}`,
      );
    }
    if (menuOptionsClass) classes.push(menuOptionsClass);
    return classes.join(' ');
  }

  #setOpen(open: boolean) {
    if (open === this.isOpen) return;
    this.isOpen = open;
    if (!open) this.placement = undefined;
    if (open) this.args.onOpen?.();
    else this.args.onClose?.();
  }

  /** Closes the menu, returning focus to the trigger when the menu had it. */
  close = ({ focusTrigger = true } = {}) => {
    if (!this.isOpen) return;
    this.#setOpen(false);
    if (focusTrigger) this.trigger?.focus();
  };

  toggle = () => {
    this.#setOpen(!this.isOpen);
  };

  closeOnOutside = () => {
    this.close({ focusTrigger: false });
  };

  handleFocusOut = (event: FocusEvent) => {
    const wrapper = event.currentTarget as HTMLElement;
    const next = event.relatedTarget;
    if (next instanceof Node && !wrapper.contains(next)) {
      this.close({ focusTrigger: false });
    }
  };

  handleMenuKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' && event.key !== 'Tab') return;
    // Stopped, so a Modal the menu is in stays open.
    event.stopPropagation();
    event.preventDefault();
    this.close();
  };

  registerTrigger = modifier((element: HTMLButtonElement) => {
    this.trigger = element;
    return () => {
      if (this.trigger === element) this.trigger = undefined;
    };
  });

  // Opens or closes the menu when @open changes, as Carbon React does.
  syncOpen = modifier(
    (_element: HTMLElement, [open]: [open: boolean | undefined]) => {
      const value = Boolean(open);
      if (value === this.#lastOpenArg) return;
      this.#lastOpenArg = value;
      afterRender(this, () => this.#setOpen(value));
    },
  );

  position = modifier((menu: HTMLElement) => {
    const trigger = this.trigger;
    if (!trigger) return;
    const direction = this.direction;
    const side = direction === 'top' ? 'bottom' : 'top';
    const flipped = Boolean(this.args.flipped);
    const menuOffset = flipped
      ? this.args.menuOffsetFlip
      : this.args.menuOffset;

    let placement: Placement = direction;
    let fallbackPlacements: Placement[] = [side];
    let mainAxis = 0;
    let crossAxis = 0;
    if (menuOffset) {
      const { top = 0, left = 0 } =
        typeof menuOffset === 'function'
          ? menuOffset(menu, direction, trigger, flipped)
          : menuOffset;
      mainAxis = top;
      // Floating UI mirrors the cross axis in RTL; Carbon React's `left` isn't.
      crossAxis = getComputedStyle(menu).direction === 'rtl' ? -left : left;
    } else {
      const [start, end] = flipped ? ['end', 'start'] : ['start', 'end'];
      placement = `${direction}-${start}` as Placement;
      fallbackPlacements = [
        `${direction}-${end}`,
        `${side}-${start}`,
        `${side}-${end}`,
      ] as Placement[];
    }

    const teardown = float(trigger, menu, {
      placement,
      topLayer: true,
      middleware: [
        offset({ mainAxis, crossAxis }),
        flip({ fallbackPlacements }),
        hide(),
      ],
      onUpdate: ({ placement: placed }) => {
        if (this.placement !== placed) this.placement = placed;
      },
    });
    afterRender(this, () => this.focusInitial(menu));
    return teardown;
  });

  focusInitial(menu: HTMLElement) {
    if (!this.isOpen || menu.contains(document.activeElement)) return;
    const selector =
      this.args.selectorPrimaryFocus ?? '[data-floating-menu-primary-focus]';
    const primary = menu.querySelector<HTMLElement>(selector);
    const first = this.rovingFocus.items[0];
    (primary ?? first ?? menu).focus();
  }

  <template>
    <span
      class="cds--overflow-menu__wrapper"
      {{(if this.isOpen closeOnOutsideClick) this.closeOnOutside}}
      {{on "focusout" this.handleFocusOut}}
      {{this.syncOpen @open}}
    >
      <Tooltip
        class="cds--icon-tooltip
          {{if @disabled 'cds--icon-tooltip--disabled'}}
          {{@wrapperClasses}}"
        @align={{this.tooltip.align}}
        @autoAlign={{@autoAlign}}
        @closeOnActivation={{this.tooltip.closeOnActivation}}
        @defaultOpen={{@defaultOpen}}
        @dropShadow={{@dropShadow}}
        @enterDelayMs={{this.tooltip.enterDelayMs}}
        @highContrast={{this.tooltip.highContrast}}
        @label={{this.iconDescription}}
        @leaveDelayMs={{this.tooltip.leaveDelayMs}}
      >
        <button
          type="button"
          class={{this.triggerClasses}}
          aria-haspopup="true"
          aria-expanded={{if this.isOpen "true" "false"}}
          aria-controls={{if this.isOpen this.menuId}}
          disabled={{@disabled}}
          {{on "click" this.toggle}}
          {{this.registerTrigger}}
          ...attributes
        >
          <this.renderIcon
            @size={{16}}
            @svgClass="cds--overflow-menu__icon {{@iconClass}}"
            @ariaLabel={{this.iconDescription}}
          />
        </button>
      </Tooltip>
      {{#if this.isOpen}}
        <ul
          id={{this.menuId}}
          class={{this.menuClasses}}
          role="menu"
          tabindex="-1"
          aria-label={{@ariaLabel}}
          data-floating-menu-direction={{this.placedDirection}}
          {{on "keydown" this.handleMenuKeyDown}}
          {{this.rovingFocus.container}}
          {{this.position}}
        >
          {{yield (component OverflowMenuItem menu=this)}}
        </ul>
      {{/if}}
    </span>
  </template>
}
