/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { registerDestructor } from '@ember/destroyable';
import type Owner from '@ember/owner';
import captureElement from '../../modifiers/capture-element.ts';
import { afterRender } from '../../utils/after-render.ts';
import type Tabs from '../tabs.gts';

export interface TabPanelSignature {
  Element: HTMLDivElement;
  Args: {
    tabs: Tabs;
  };
  Blocks: {
    default: [];
  };
}

export default class TabPanel extends Component<TabPanelSignature> {
  element?: HTMLElement;

  constructor(owner: Owner, args: TabPanelSignature['Args']) {
    super(owner, args);
    // Tabs has read its panels during this render; register after it.
    afterRender(this, () => {
      args.tabs.registerPanel(this);
      registerDestructor(this, () => args.tabs.unregisterPanel(this));
    });
  }

  get index() {
    return this.args.tabs.panels.indexOf(this);
  }

  get isSelected() {
    return this.index === this.args.tabs.selectedIndex;
  }

  setElement = (element: HTMLElement) => {
    this.element = element;
  };

  <template>
    <div
      ...attributes
      aria-labelledby="{{@tabs.baseId}}-tab-{{this.index}}"
      id="{{@tabs.baseId}}-tabpanel-{{this.index}}"
      class="cds--tab-content"
      role="tabpanel"
      hidden={{unless this.isSelected true}}
      {{captureElement this.setElement}}
    >
      {{yield}}
    </div>
  </template>
}
