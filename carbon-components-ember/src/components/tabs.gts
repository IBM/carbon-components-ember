/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import type { WithBoundArgs } from '@glint/template';
import TabList from './tabs/tab-list.gts';
import TabPanels from './tabs/tab-panels.gts';
import { afterRender } from '../utils/after-render.ts';
import { byDocumentPosition } from '../utils/roving-focus.ts';
import type Tab from './tabs/tab.gts';
import type TabPanel from './tabs/tab-panel.gts';

export interface TabsSignature {
  Args: {
    /**
     * Which tab is selected when first rendered, when `@selectedIndex` isn't
     * given. Defaults to `0`.
     */
    defaultSelectedIndex?: number;
    /**
     * Which tab is selected. When given, it wins over the selection the
     * user makes; pair it with `@onChange` to follow it.
     */
    selectedIndex?: number;
    /** Called with the new `selectedIndex` whenever the selected tab changes. */
    onChange?: (state: { selectedIndex: number }) => void;
    /**
     * Renders a close button on every tab. Give `@onTabCloseRequest` too, and
     * remove the tab there.
     */
    dismissable?: boolean;
    /** Called with the index of the tab whose close button or Delete key was used. */
    onTabCloseRequest?: (index: number) => void;
  };
  Blocks: {
    default: [
      TabList: WithBoundArgs<typeof TabList, 'tabs'>,
      TabPanels: WithBoundArgs<typeof TabPanels, 'tabs'>,
    ];
  };
}

/**
 * Holds the selection of a `TabList` and its `TabPanels`, as Carbon React's
 * `Tabs`. It renders no element; the nth tab belongs to the nth panel.
 */
export default class Tabs extends Component<TabsSignature> {
  @tracked tabs: Tab[] = [];
  @tracked panels: TabPanel[] = [];
  @tracked uncontrolledIndex = this.args.defaultSelectedIndex ?? 0;
  baseId = guidFor(this);
  #checkedInitialTab = false;

  get selectedIndex(): number {
    return this.args.selectedIndex ?? this.uncontrolledIndex;
  }

  // The selected tab, or the first enabled one when that is missing or
  // disabled, so the tablist stays reachable.
  get tabStop(): Tab | undefined {
    const selected = this.tabs[this.selectedIndex];
    return selected && !selected.args.disabled
      ? selected
      : this.tabs.find((tab) => !tab.args.disabled);
  }

  // As Carbon React, this calls `@onChange` even when the index is the same.
  setSelectedIndex = (index: number) => {
    if (
      this.args.selectedIndex === undefined &&
      index !== this.uncontrolledIndex
    ) {
      this.uncontrolledIndex = index;
    }
    this.args.onChange?.({ selectedIndex: index });
  };

  registerTab(tab: Tab) {
    this.tabs = this.#inDocumentOrder([...this.tabs, tab]);
    this.#selectFirstEnabledTab();
  }

  unregisterTab(tab: Tab) {
    const index = this.tabs.indexOf(tab);
    this.tabs = this.tabs.filter((other) => other !== tab);
    if (!tab.closing) return;
    // The closed tab had focus; hand it to the next enabled tab, else the previous.
    const isEnabled = (other: Tab) => !other.args.disabled;
    const next =
      this.tabs.slice(index).find(isEnabled) ??
      this.tabs.slice(0, index).reverse().find(isEnabled);
    afterRender(this, () => {
      if (!document.activeElement || document.activeElement === document.body) {
        next?.element?.focus();
      }
    });
  }

  registerPanel(panel: TabPanel) {
    this.panels = this.#inDocumentOrder([...this.panels, panel]);
  }

  unregisterPanel(panel: TabPanel) {
    this.panels = this.panels.filter((other) => other !== panel);
  }

  #inDocumentOrder<T extends { element?: HTMLElement }>(items: T[]): T[] {
    return items.sort((a, b) =>
      a.element && b.element ? byDocumentPosition(a.element, b.element) : 0,
    );
  }

  // Once, as Carbon React does on mount: when the tab selected at the start is
  // disabled, select the first enabled one. Registered tabs queue their
  // registration in render order, so this runs after the first ones.
  #selectFirstEnabledTab() {
    if (this.#checkedInitialTab) return;
    this.#checkedInitialTab = true;
    afterRender(this, () => {
      if (!this.tabs[this.selectedIndex]?.args.disabled) return;
      const first = this.tabs.findIndex((tab) => !tab.args.disabled);
      if (first >= 0) this.setSelectedIndex(first);
    });
  }

  // eslint-disable-next-line ember/template-require-splattributes -- renders no element of its own, like React's Tabs provider
  <template>
    {{yield (component TabList tabs=this) (component TabPanels tabs=this)}}
  </template>
}
