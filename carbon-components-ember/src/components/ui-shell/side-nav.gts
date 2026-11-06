/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { WithBoundArgs } from '@glint/template';
import { task, timeout } from 'ember-concurrency';
import { modifier } from 'ember-modifier';
import SideNavItems from './side-nav-items.gts';
import { mediaQuery, minWidth } from '../../utils/media-query.ts';
import type { SideNavState } from './side-nav-items.gts';

export interface SideNavSignature {
  Element: HTMLElement;
  Args: {
    /**
     * Closes it when focus leaves it and on Escape, and opens a rail when
     * focus enters it. Defaults to `true`.
     */
    addFocusListeners?: boolean;
    /** Opens a rail while the pointer is over it. Defaults to `true`. */
    addMouseListeners?: boolean;
    /** Whether it starts open, when `@expanded` isn't given. */
    defaultExpanded?: boolean;
    /**
     * How long, in milliseconds, it waits to open or close after a focus or
     * pointer change. Defaults to `100`.
     */
    enterDelayMs?: number;
    /**
     * Whether it's open. When given, it wins over the side nav's own state;
     * follow it with `@onToggle`.
     */
    expanded?: boolean;
    /** Where Escape sends the page, such as `#main-content`. */
    href?: string;
    /**
     * Whether it sits under a `Header`, which shows it at the `lg`
     * breakpoint and up. Defaults to `true`.
     */
    isChildOfHeader?: boolean;
    /** Keeps it in place beside the content, without an overlay. */
    isFixedNav?: boolean;
    /**
     * Keeps it shown from the `lg` breakpoint up; `false` hides it there
     * too until it's opened. Defaults to `true`.
     */
    isPersistent?: boolean;
    /** Shows only its icons until the pointer or focus opens it. */
    isRail?: boolean;
    /** Called on a click on the overlay behind it, below `lg`. */
    onOverlayClick?: (event: MouseEvent) => void;
    /** Called when focus leaves it while it's open, unless it's fixed. */
    onSideNavBlur?: () => void;
    /**
     * Called with the event, or `true` for a pointer, and whether it should
     * now be open.
     */
    onToggle?: (
      event: FocusEvent | KeyboardEvent | boolean,
      value: boolean,
    ) => void;
  };
  Blocks: {
    default: [SideNavItems: WithBoundArgs<typeof SideNavItems, 'sideNav'>];
  };
}

/**
 * The UI Shell's side navigation, in the `Header` or beside it. Name it with
 * `aria-label`. Below the `lg` breakpoint it opens over the page, and while
 * closed it's `inert`.
 */
export default class SideNav
  extends Component<SideNavSignature>
  implements SideNavState
{
  #controlled = this.args.expanded !== undefined;
  @tracked expandedState = this.args.defaultExpanded ?? false;
  @tracked expandedViaHoverState = this.args.defaultExpanded ?? false;
  #isLg = mediaQuery(this, minWidth('lg'));

  get expanded() {
    return this.#controlled ? Boolean(this.args.expanded) : this.expandedState;
  }

  get isOpen() {
    return this.expanded || this.expandedViaHoverState;
  }

  get isRail() {
    return this.args.isRail;
  }

  // A rail the pointer opened is open for its links and menus too.
  get isSideNavExpanded() {
    return this.#controlled
      ? this.expandedViaHoverState || this.expanded
      : this.expanded;
  }

  // Out of reach while it's closed and hidden: below `lg`, or fixed.
  get inert() {
    if (this.args.isRail) return false;
    return !(this.expanded || (this.#isLg.matches && !this.args.isFixedNav));
  }

  // As Carbon React's useDelayedState: a later change cancels a pending one.
  setExpanded = task(
    { restartable: true },
    async (value: boolean, delayMs?: number) => {
      if (delayMs) await timeout(delayMs);
      this.expandedState = value;
    },
  );

  setExpandedViaHover = task(
    { restartable: true },
    async (value: boolean, delayMs?: number) => {
      if (delayMs) await timeout(delayMs);
      this.expandedViaHoverState = value;
    },
  );

  toggle(event: FocusEvent | KeyboardEvent | boolean, value: boolean) {
    const { enterDelayMs = 100, isRail, onToggle } = this.args;
    if (!this.#controlled) void this.setExpanded.perform(value, enterDelayMs);
    onToggle?.(event, value);
    if (this.#controlled || isRail) {
      void this.setExpandedViaHover.perform(value, enterDelayMs);
    }
  }

  openOnFocus = (event: FocusEvent) => {
    if (this.args.addFocusListeners === false || !this.args.isRail) return;
    const nav = event.currentTarget as HTMLElement;
    if (!nav.contains(event.relatedTarget as Node | null)) {
      this.toggle(event, true);
    }
  };

  closeOnBlur = (event: FocusEvent) => {
    if (this.args.addFocusListeners === false) return;
    const nav = event.currentTarget as HTMLElement;
    if (nav.contains(event.relatedTarget as Node | null)) return;
    const wasExpanded = this.expanded;
    this.toggle(event, false);
    if (wasExpanded && !this.args.isFixedNav) this.args.onSideNavBlur?.();
  };

  closeOnEscape = (event: KeyboardEvent) => {
    if (this.args.addFocusListeners === false || event.key !== 'Escape') {
      return;
    }
    this.toggle(event, false);
    if (this.args.href) window.location.href = this.args.href;
  };

  get followsPointer() {
    return this.args.isRail && this.args.addMouseListeners !== false;
  }

  openOnHover = () => {
    if (this.followsPointer) this.toggle(true, true);
  };

  closeOnLeave = () => {
    if (!this.followsPointer) return;
    void this.setExpanded.perform(false);
    void this.setExpandedViaHover.perform(false);
    this.toggle(false, false);
  };

  // A click opens a rail at once, without waiting for `@enterDelayMs`.
  openOnClick = () => {
    if (!this.followsPointer) return;
    void this.setExpanded.perform(true);
    void this.setExpandedViaHover.perform(true);
    this.toggle(true, true);
  };

  clickOverlay = (event: MouseEvent) => this.args.onOverlayClick?.(event);

  // Tab from the header's menu button goes into the open side nav.
  focusFromMenuButton = modifier((nav: HTMLElement) => {
    const listener = (event: KeyboardEvent) => {
      const focused = document.activeElement;
      if (
        event.key === 'Tab' &&
        this.expanded &&
        !this.args.isFixedNav &&
        focused?.classList.contains('cds--header__menu-toggle') &&
        !focused.closest('nav')
      ) {
        nav.focus();
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  });

  <template>
    {{#unless @isFixedNav}}
      {{! eslint-disable-next-line ember/template-no-invalid-interactive -- the overlay is for the pointer; Escape closes the side nav ~}}
      <div
        class="cds--side-nav__overlay
          {{if this.isOpen 'cds--side-nav__overlay-active'}}"
        {{on "click" this.clickOverlay}}
      ></div>
    {{~/unless~}}
    <nav
      tabindex="-1"
      inert={{this.inert}}
      ...attributes
      class="cds--side-nav__navigation cds--side-nav
        {{if this.isOpen 'cds--side-nav--expanded'}}
        {{if (and (not this.expanded) @isFixedNav) 'cds--side-nav--collapsed'}}
        {{if @isRail 'cds--side-nav--rail'}}
        {{unless (eq @isChildOfHeader false) 'cds--side-nav--ux'}}
        {{if (eq @isPersistent false) 'cds--side-nav--hidden'}}"
      {{on "focusin" this.openOnFocus}}
      {{on "focusout" this.closeOnBlur}}
      {{on "keydown" this.closeOnEscape}}
      {{on "mouseenter" this.openOnHover}}
      {{on "mouseleave" this.closeOnLeave}}
      {{on "click" this.openOnClick}}
      {{this.focusFromMenuButton}}
    >
      {{~yield (component SideNavItems sideNav=this)~}}
    </nav>
  </template>
}
