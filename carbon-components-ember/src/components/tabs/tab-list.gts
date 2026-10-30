/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { concat } from '@ember/helper';
import type { WithBoundArgs } from '@glint/template';
import { modifier } from 'ember-modifier';
import { animationFrame, task, timeout } from 'ember-concurrency';
import Tab from './tab.gts';
import { afterRender } from '../../utils/after-render.ts';
import { mediaQuery, minWidth } from '../../utils/media-query.ts';
import { observeResize } from '../../utils/resize-observer.ts';
import { RovingFocus } from '../../utils/roving-focus.ts';
import type Tabs from '../tabs.gts';

// The width of the scroll buttons, which tabs scroll clear of.
const BUTTON_WIDTH = 44;
const LONG_PRESS_DELAY = 500;
const PREVIOUS_PATH = 'M5 8 10 3 10.7 3.7 6.4 8 10.7 12.3 10 13z';
const NEXT_PATH = 'M11 8 6 13 5.3 12.3 9.6 8 5.3 3.7 6 3z';

type Direction = 'previous' | 'next';

export interface TabListSignature {
  Element: HTMLDivElement;
  Args: {
    tabs: Tabs;
    /**
     * `automatic` (default) selects a tab as soon as an arrow key moves focus
     * to it. `manual` only moves focus; pressing the tab selects it.
     */
    activation?: 'automatic' | 'manual';
    /** Classes for the outer `.cds--tabs` element, as Carbon React's `className`. */
    className?: string;
    /** Renders contained tabs. */
    contained?: boolean;
    /**
     * Makes contained tabs fill the width in equal shares, from the `lg`
     * breakpoint and with fewer than 9 tabs.
     */
    fullWidth?: boolean;
    /** Deprecated in Carbon React in favor of `Layer`. */
    light?: boolean;
    /**
     * Milliseconds to wait after scrolling stops before reading the scroll
     * position the scroll buttons step from. Defaults to `200`.
     */
    scrollDebounceWait?: number;
    /** Scrolls the selected tab into view when first rendered. */
    scrollIntoView?: boolean;
    /**
     * The size of the tabs: `sm` and `md` for line tabs, `sm`, `md` and
     * `lg` for contained tabs.
     */
    size?: 'sm' | 'md' | 'lg';
  };
  Blocks: {
    default: [Tab: WithBoundArgs<typeof Tab, 'tabs' | 'list'>];
  };
}

export default class TabList extends Component<TabListSignature> {
  @tracked isPreviousVisible = false;
  @tracked isNextVisible = false;
  @tracked isScrollable = false;
  @tracked rtl = false;
  container?: HTMLElement;
  tablist?: HTMLElement;
  // Where the scroll buttons scroll from; follows the tablist once scrolling pauses.
  scrollPosition = 0;
  #didScrollIntoView = false;
  #longPressed = false;
  // Carbon React reads the same breakpoint.
  #lg = mediaQuery(this, minWidth('lg'), true);

  rovingFocus = new RovingFocus({
    orientation: 'horizontal',
    loop: true,
    followFocus: false,
    onNavigate: (element) => {
      const { tabs } = this.args;
      const index = tabs.tabs.findIndex((tab) => tab.element === element);
      if (index < 0) return;
      if (this.args.activation === 'manual') {
        this.scrollTabIntoView(element);
      } else {
        tabs.setSelectedIndex(index);
      }
    },
  });

  get contained() {
    return !!this.args.contained;
  }

  get hasSecondaryLabelTabs() {
    return (
      this.contained &&
      this.args.tabs.tabs.some((tab) => tab.args.secondaryLabel !== undefined)
    );
  }

  get showSizeClass() {
    return (
      !!this.args.size &&
      !this.hasSecondaryLabelTabs &&
      (this.contained || this.args.size === 'sm' || this.args.size === 'md')
    );
  }

  get showFullWidthClass() {
    return (
      !!this.args.fullWidth &&
      this.contained &&
      this.#lg.matches &&
      this.args.tabs.tabs.length < 9
    );
  }

  get previousPath() {
    return this.rtl ? NEXT_PATH : PREVIOUS_PATH;
  }

  get nextPath() {
    return this.rtl ? PREVIOUS_PATH : NEXT_PATH;
  }

  registerContainer = modifier((element: HTMLElement) => {
    this.container = element;
    return observeResize(element, this.updateOverflow);
  });

  // Re-runs, once the tabs are in the DOM, when they or the selection change.
  registerTablist = modifier(
    (
      element: HTMLElement,
      [count, selectedIndex, isScrollable]: [number, number, boolean],
    ) => {
      this.tablist = element;
      void count;
      void isScrollable;
      return afterRender(this, () => {
        this.updateOverflow();
        const selected = this.args.tabs.tabs[selectedIndex]?.element;
        this.scrollTabIntoView(selected);
        if (this.args.scrollIntoView && selected && !this.#didScrollIntoView) {
          this.#didScrollIntoView = true;
          selected.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
      });
    },
  );

  updateOverflow = () => {
    const { container, tablist } = this;
    if (!container || !tablist) return;
    // 1px more for Firefox.
    const hasOverflow = tablist.scrollWidth > container.clientWidth + 1;
    // Scrolled content has a negative scrollLeft in right-to-left.
    const scrolled = Math.abs(tablist.scrollLeft);
    // A tracked field is dirtied by every assignment, so only change them.
    const rtl = getComputedStyle(container).direction === 'rtl';
    const isPreviousVisible = hasOverflow && scrolled > 0;
    const isNextVisible =
      hasOverflow && scrolled + tablist.clientWidth + 1 < tablist.scrollWidth;
    if (this.rtl !== rtl) this.rtl = rtl;
    if (this.isPreviousVisible !== isPreviousVisible) {
      this.isPreviousVisible = isPreviousVisible;
    }
    if (this.isNextVisible !== isNextVisible) {
      this.isNextVisible = isNextVisible;
    }
    if (this.isScrollable !== hasOverflow) this.isScrollable = hasOverflow;
  };

  scrollTo = (left: number) => {
    this.scrollPosition = left;
    if (this.tablist) this.tablist.scrollLeft = left;
  };

  scrollTabIntoView(tab: HTMLElement | undefined) {
    const { tablist } = this;
    if (!this.isScrollable || !tablist || !tab) return;
    const start = tab.offsetLeft;
    const end = start + tab.getBoundingClientRect().width;
    const visibleStart = tablist.scrollLeft + BUTTON_WIDTH;
    const visibleEnd = tablist.scrollLeft + tablist.clientWidth - BUTTON_WIDTH;
    if (start < visibleStart) this.scrollTo(start - BUTTON_WIDTH);
    if (end > visibleEnd) {
      this.scrollTo(end + BUTTON_WIDTH - tablist.clientWidth);
    }
  }

  syncScrollPosition = task({ restartable: true }, async () => {
    await timeout(this.args.scrollDebounceWait ?? 200);
    if (this.tablist) this.scrollPosition = this.tablist.scrollLeft;
    this.updateOverflow();
  });

  handleScroll = () => {
    this.updateOverflow();
    void this.syncScrollPosition.perform();
  };

  scrollByStep(direction: Direction) {
    const { tablist } = this;
    if (!tablist) return;
    const step = (tablist.scrollWidth / this.args.tabs.tabs.length) * 1.5;
    const maxScroll = tablist.scrollWidth - tablist.clientWidth;
    const position = this.scrollPosition;
    if (direction === 'previous') {
      this.scrollTo(
        this.rtl ? Math.min(position + step, 0) : Math.max(position - step, 0),
      );
    } else {
      this.scrollTo(
        this.rtl
          ? Math.max(position - step, -maxScroll)
          : Math.min(position + step, maxScroll),
      );
    }
  }

  // Holding a scroll button keeps scrolling, a frame at a time.
  holdToScroll = task({ restartable: true }, async (direction: Direction) => {
    await timeout(LONG_PRESS_DELAY);
    const { tablist } = this;
    if (!tablist) return;
    this.#longPressed = true;
    const delta = (direction === 'next') !== this.rtl ? 5 : -5;
    // Smooth scrolling would lag behind the steps.
    const behavior = tablist.style.scrollBehavior;
    tablist.style.scrollBehavior = 'auto';
    try {
      for (;;) {
        tablist.scrollLeft += delta;
        await animationFrame();
      }
    } finally {
      tablist.style.scrollBehavior = behavior;
      this.scrollPosition = tablist.scrollLeft;
    }
  });

  press = modifier((element: HTMLButtonElement, [direction]: [Direction]) => {
    const start = (event: Event) => {
      event.preventDefault();
      void this.holdToScroll.perform(direction);
    };
    const end = () => {
      void this.holdToScroll.cancelAll();
    };
    const cancel = () => {
      end();
      this.#longPressed = false;
    };
    const click = () => {
      if (!this.#longPressed) this.scrollByStep(direction);
      this.#longPressed = false;
    };
    const contextMenu = (event: Event) => event.preventDefault();
    element.addEventListener('pointerdown', start);
    element.addEventListener('pointerup', end);
    element.addEventListener('pointercancel', cancel);
    element.addEventListener('pointerleave', cancel);
    element.addEventListener('click', click);
    element.addEventListener('contextmenu', contextMenu);
    return () => {
      element.removeEventListener('pointerdown', start);
      element.removeEventListener('pointerup', end);
      element.removeEventListener('pointercancel', cancel);
      element.removeEventListener('pointerleave', cancel);
      element.removeEventListener('click', click);
      element.removeEventListener('contextmenu', contextMenu);
    };
  });

  <template>
    <div
      class="cds--tabs
        {{if @contained 'cds--tabs--contained'}}
        {{if @light 'cds--tabs--light'}}
        {{if this.showSizeClass (concat 'cds--layout--size-' @size)}}
        {{if this.hasSecondaryLabelTabs 'cds--tabs--tall'}}
        {{if this.showFullWidthClass 'cds--tabs--full-width'}}
        {{if @tabs.args.dismissable 'cds--tabs--dismissable'}}
        {{@className}}"
      {{this.registerContainer}}
    >
      <button
        aria-hidden="true"
        tabindex="-1"
        aria-label={{if this.rtl "Scroll right" "Scroll left"}}
        class="cds--tab--overflow-nav-button cds--tab--overflow-nav-button--previous
          {{unless
            this.isPreviousVisible
            'cds--tab--overflow-nav-button--hidden'
          }}"
        type="button"
        {{this.press "previous"}}
      >
        <svg
          focusable="false"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d={{this.previousPath}}></path>
        </svg>
      </button>
      <div
        ...attributes
        role="tablist"
        class="cds--tab--list"
        {{this.registerTablist
          @tabs.tabs.length
          @tabs.selectedIndex
          this.isScrollable
        }}
        {{this.rovingFocus.container}}
        {{on "scroll" this.handleScroll}}
      >
        {{yield (component Tab tabs=@tabs list=this)}}
      </div>
      <button
        aria-hidden="true"
        tabindex="-1"
        aria-label={{if this.rtl "Scroll left" "Scroll right"}}
        class="cds--tab--overflow-nav-button cds--tab--overflow-nav-button--next
          {{unless this.isNextVisible 'cds--tab--overflow-nav-button--hidden'}}"
        type="button"
        {{this.press "next"}}
      >
        <svg
          focusable="false"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d={{this.nextPath}}></path>
        </svg>
      </button>
    </div>
  </template>
}
