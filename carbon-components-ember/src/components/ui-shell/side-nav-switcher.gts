/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import ChevronDown from '../icons/chevron-down.ts';

export interface SideNavSwitcherSignature {
  Element: HTMLDivElement;
  Args: {
    /** Labels the select, and shows until an option is chosen. */
    labelText: string;
    /** Called with the select's `change` event, and its `blur`. */
    onChange?: (event: Event) => void;
    /** The options to choose from. */
    options: string[];
  };
}

/**
 * A select in the `SideNav`, such as for the product or the account.
 * Carbon's stylesheet no longer styles it, as Carbon React's Storybook has
 * no story for it.
 */
export default class SideNavSwitcher extends Component<SideNavSwitcherSignature> {
  id = `${guidFor(this)}-side-nav-switcher`;

  change = (event: Event) => this.args.onChange?.(event);

  <template>
    <div ...attributes class="cds--side-nav__switcher">
      <label for={{this.id}} class="cds--assistive-text">{{@labelText}}</label>
      <select
        id={{this.id}}
        class="cds--side-nav__select"
        {{on "blur" this.change}}
        {{on "change" this.change}}
      >
        <option
          class="cds--side-nav__option"
          disabled
          hidden
          selected
          value=""
        >{{@labelText}}</option>
        {{! Not "option", which would shadow the element. }}
        {{#each @options as |choice|}}
          <option
            class="cds--side-nav__option"
            value={{choice}}
          >{{choice}}</option>
        {{/each}}
      </select>
      <div class="cds--side-nav__switcher-chevron">
        <ChevronDown @size={{20}} />
      </div>
    </div>
  </template>
}
