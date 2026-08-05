/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { modifier } from 'ember-modifier';

const SPACING = 8;

function range(value: number | [number, number]): [number, number] {
  return Array.isArray(value) ? value : [value, value];
}

export interface MenuSignature {
  Element: HTMLUListElement;
  Args: {
    /**
     * A required label describing the Menu (used as `aria-label`).
     */
    label: string;
    /**
     * Whether the Menu is open or not.
     */
    open?: boolean;
    /**
     * Specify the background token to use. Default is 'layer'.
     */
    backgroundToken?: 'layer' | 'background';
    /**
     * Specify whether a border should be rendered on the menu.
     */
    border?: boolean;
    /**
     * Specify how the menu should align with the button element. Only
     * `top`/`top-start`/`top-end` affect rendering (adds a top box-shadow).
     */
    menuAlignment?: string;
    /**
     * Specify the size of the Menu. Only respected on the top-level Menu;
     * submenus always inherit the size of their root Menu.
     */
    size?: 'xs' | 'sm' | 'md' | 'lg';
    /**
     * Specify a DOM node where the Menu should be rendered in. Defaults to
     * `document.body`.
     */
    target?: Element;
    /**
     * Specify the x position of the Menu. Either pass a single number or an
     * array with two numbers describing your activator's boundaries
     * ([x1, x2]).
     */
    x?: number | [number, number];
    /**
     * Specify the y position of the Menu. Either pass a single number or an
     * array with two numbers describing your activator's boundaries
     * ([y1, y2]).
     */
    y?: number | [number, number];
    /**
     * Provide an optional function to be called when the Menu is opened.
     */
    onOpen?: () => void;
    /**
     * Provide an optional function to be called when the Menu should be
     * closed, including if the Menu is blurred, the user presses escape, or
     * the Menu is a submenu and the user presses ArrowLeft.
     */
    onClose?: () => void;
    /**
     * @internal Set automatically when `MenuItem` renders a submenu. Not
     * part of the public API.
     */
    isRoot?: boolean;
    /**
     * @internal The element a submenu is anchored to. Set automatically by
     * `MenuItem`. Not part of the public API.
     */
    anchor?: HTMLElement;
  };
  Blocks: {
    default: [];
  };
}

interface MenuListSignature {
  Element: HTMLUListElement;
  Args: {
    menu: Menu;
  };
  Blocks: {
    default: [];
  };
}

class MenuList extends Component<MenuListSignature> {
  <template>
    <ul
      class={{@menu.classes}}
      role='menu'
      aria-label={{@menu.args.label}}
      tabindex='-1'
      {{on 'keydown' @menu.handleKeyDown}}
      {{on 'focusout' @menu.handleBlur}}
      {{on 'click' @menu.handleClick}}
      {{@menu.scanFeatures}}
      {{@menu.positionMenu}}
      ...attributes
    >
      {{yield}}
    </ul>
  </template>
}

export default class Menu extends Component<MenuSignature> {
  @tracked hasIcons = false;
  @tracked hasSelectableItems = false;
  @tracked shown = false;

  get isRoot() {
    return this.args.isRoot ?? true;
  }

  get size() {
    return this.args.size ?? 'sm';
  }

  get target() {
    return this.args.target ?? document.body;
  }

  get classes() {
    const classes = ['cds--menu'];
    if (this.isRoot) {
      classes.push(`cds--menu--${this.size}`);
    }
    if (this.args.open) classes.push('cds--menu--open');
    if (this.shown) classes.push('cds--menu--shown');
    if (this.hasIcons) classes.push('cds--menu--with-icons');
    if (this.hasSelectableItems) {
      classes.push('cds--menu--with-selectable-items');
    }
    if (this.args.border) classes.push('cds--menu--border');
    if (this.args.backgroundToken === 'background') {
      classes.push('cds--menu--background-token__background');
    }
    if (this.args.menuAlignment?.slice(0, 3) === 'top') {
      classes.push('cds--menu--box-shadow-top');
    }
    return classes.join(' ');
  }

  // Carbon's `--with-icons`/`--with-selectable-items` modifier classes are
  // normally derived from a React Context that inspects children as they
  // mount. We don't have that here, so scan the rendered items directly
  // instead of requiring callers to declare it themselves. Icons render
  // their SVG asynchronously (dynamic import), so a one-shot scan on insert
  // isn't enough — a MutationObserver re-scans whenever the icon actually
  // lands in the DOM.
  scanFeatures = modifier((element: HTMLUListElement) => {
    // Assigning a @tracked property always invalidates it, even when the
    // new value equals the old one, which would cause `classes` to be
    // rewritten to the DOM on every scan. Since the MutationObserver below
    // also watches this element's own attributes, an unconditional
    // `class` rewrite would re-trigger the observer and loop forever. Only
    // assign when the computed value actually changes to break the cycle.
    const scan = () => {
      const hasIcons = !!element.querySelector(
        [
          ':scope > .cds--menu-item > .cds--menu-item__icon > svg',
          ':scope > .cds--menu-item-group > ul > .cds--menu-item > .cds--menu-item__icon > svg',
          ':scope > .cds--menu-item-radio-group > ul > .cds--menu-item > .cds--menu-item__icon > svg',
        ].join(', '),
      );
      if (hasIcons !== this.hasIcons) this.hasIcons = hasIcons;
      const hasSelectableItems = !!element.querySelector(
        [
          ':scope > [role="menuitemcheckbox"]',
          ':scope > [role="menuitemradio"]',
          ':scope > .cds--menu-item-group > ul > [role="menuitemcheckbox"]',
          ':scope > .cds--menu-item-radio-group > ul > [role="menuitemradio"]',
        ].join(', '),
      );
      if (hasSelectableItems !== this.hasSelectableItems) {
        this.hasSelectableItems = hasSelectableItems;
      }
    };
    // The modifier installs synchronously during the same render
    // computation that already read `hasIcons`/`hasSelectableItems` (via
    // `classes`, used for this element's `class` attribute), so scanning
    // here directly would trip Ember's backtracking-rerender assertion.
    // Defer the initial scan to the next frame, same as `positionMenu`.
    const raf = requestAnimationFrame(scan);
    const observer = new MutationObserver(scan);
    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
    });
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  });

  positionMenu = modifier((element: HTMLUListElement) => {
    if (!this.args.open) {
      this.shown = false;
      return;
    }
    const raf = requestAnimationFrame(() => {
      this.applyPosition(element);
      this.shown = true;
      this.focusItem(element);
      this.args.onOpen?.();
    });
    return () => cancelAnimationFrame(raf);
  });

  fitAxis(
    anchor: number,
    reversedAnchor: number,
    size: number,
    max: number,
    offset: number,
  ) {
    const options = [
      max - SPACING - size - anchor >= 0 ? anchor - offset : null,
      reversedAnchor - size >= 0 ? reversedAnchor - size + offset : null,
      max - SPACING - size,
    ];
    const best = options.find((option) => option !== null) ?? SPACING;
    return best >= SPACING ? best : SPACING;
  }

  applyPosition(element: HTMLUListElement) {
    const rect = element.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let x1: number, x2: number, y1: number, y2: number;
    if (this.isRoot) {
      [x1, x2] = range(this.args.x ?? 0);
      [y1, y2] = range(this.args.y ?? 0);
    } else if (this.args.anchor) {
      const anchorRect = this.args.anchor.getBoundingClientRect();
      x1 = anchorRect.left;
      x2 = anchorRect.right;
      y1 = anchorRect.top;
      y2 = anchorRect.bottom;
    } else {
      return;
    }

    const left = this.fitAxis(
      this.isRoot ? x1 : x2,
      this.isRoot ? x2 : x1,
      rect.width,
      vw,
      0,
    );
    const top = this.fitAxis(
      this.isRoot ? y2 : y1,
      this.isRoot ? y1 : y2,
      rect.height,
      vh,
      this.isRoot ? 0 : 4,
    );

    element.style.insetInlineStart = `${left}px`;
    element.style.insetInlineEnd = 'initial';
    element.style.insetBlockStart = `${top}px`;
  }

  focusableItemsSelector =
    ':scope > .cds--menu-item:not(.cds--menu-item--disabled), :scope > .cds--menu-item-group > ul > .cds--menu-item:not(.cds--menu-item--disabled), :scope > .cds--menu-item-radio-group > ul > .cds--menu-item:not(.cds--menu-item--disabled)';

  focusItem(element: HTMLUListElement, direction?: 'up' | 'down') {
    const items = Array.from(
      element.querySelectorAll<HTMLElement>(this.focusableItemsSelector),
    );
    if (!items.length) return;

    const active = element.ownerDocument.activeElement;
    let index = items.indexOf(active as HTMLElement);

    if (index === -1) {
      index = 0;
    } else if (direction === 'up') {
      index -= 1;
    } else if (direction === 'down') {
      index += 1;
    } else {
      return;
    }

    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;

    items[index]?.focus();
  }

  @action
  handleKeyDown(event: KeyboardEvent) {
    event.stopPropagation();
    const closesMenu =
      event.key === 'Escape' ||
      event.key === 'Tab' ||
      (!this.isRoot && event.key === 'ArrowLeft');
    if (closesMenu) {
      event.preventDefault();
      this.args.onClose?.();
      return;
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusItem(
        event.currentTarget as HTMLUListElement,
        event.key === 'ArrowUp' ? 'up' : 'down',
      );
    }
  }

  @action
  handleBlur(event: FocusEvent) {
    if (!this.isRoot || !this.args.open) return;
    const related = event.relatedTarget as Node | null;
    const menu = event.currentTarget as HTMLUListElement;
    if (related && menu.contains(related)) return;
    this.args.onClose?.();
  }

  @action
  handleClick(event: MouseEvent) {
    if (!this.isRoot) return;
    const item = (event.target as HTMLElement).closest('.cds--menu-item');
    if (!item) return;
    if (item.getAttribute('aria-disabled') === 'true') return;
    if (item.getAttribute('aria-haspopup') === 'true') return;
    this.args.onClose?.();
  }

  <template>
    {{#if this.isRoot}}
      {{#if @open}}
        {{#in-element this.target insertBefore=null}}
          <MenuList @menu={{this}} ...attributes>{{yield}}</MenuList>
        {{/in-element}}
      {{/if}}
    {{else}}
      <MenuList @menu={{this}} ...attributes>{{yield}}</MenuList>
    {{/if}}
  </template>
}
