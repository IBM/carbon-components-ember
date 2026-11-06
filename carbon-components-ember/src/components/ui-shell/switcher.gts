/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { registerDestructor } from '@ember/destroyable';
import type Owner from '@ember/owner';
import type { WithBoundArgs } from '@glint/template';
import SwitcherItem from './switcher-item.gts';
import { byDocumentPosition, nextIndex } from '../../utils/roving-focus.ts';
import type HeaderPanel from './header-panel.gts';

export interface SwitcherSignature {
  Element: HTMLUListElement;
  Args: {
    /** Whether the panel it's in is open; its items are focusable only then. */
    expanded?: boolean;
    panel?: HeaderPanel;
  };
  Blocks: {
    default: [SwitcherItem: WithBoundArgs<typeof SwitcherItem, 'switcher'>];
  };
}

/**
 * The app switcher's list of `SwitcherItem`s and `SwitcherDivider`s, in a
 * `HeaderPanel`. Name it with `aria-label`. The up and down arrows move
 * between its items.
 */
export default class Switcher extends Component<SwitcherSignature> {
  items: SwitcherItem[] = [];

  constructor(owner: Owner, args: SwitcherSignature['Args']) {
    super(owner, args);
    const { panel } = args;
    if (!panel) return;
    panel.hasSwitcher = true;
    registerDestructor(this, () => (panel.hasSwitcher = false));
  }

  registerItem(item: SwitcherItem) {
    this.items.push(item);
    registerDestructor(item, () => {
      this.items = this.items.filter((other) => other !== item);
    });
  }

  focusNext(item: SwitcherItem, key: string) {
    const elements = this.items
      .flatMap((other) => (other.element ? [other.element] : []))
      .sort(byDocumentPosition);
    const current = item.element ? elements.indexOf(item.element) : -1;
    const index = nextIndex(key, current, elements.length, { loop: true });
    if (index !== undefined) elements[index]?.focus();
  }

  <template>
    <ul ...attributes class="cds--switcher">
      {{~yield (component SwitcherItem switcher=this)~}}
    </ul>
  </template>
}
