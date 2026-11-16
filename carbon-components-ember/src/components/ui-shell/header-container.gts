/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';

export interface HeaderContainerSignature {
  Args: {
    /** Whether the side nav starts open. */
    isSideNavExpanded?: boolean;
  };
  Blocks: {
    default: [
      {
        isSideNavExpanded: boolean;
        onClickSideNavExpand: () => void;
      },
    ];
  };
}

/**
 * Holds whether the `SideNav` is open, for the `HeaderMenuButton` that
 * toggles it, as Carbon React's `HeaderContainer` passes it to its `render`.
 * Escape closes it.
 */
export default class HeaderContainer extends Component<HeaderContainerSignature> {
  @tracked isSideNavExpanded: boolean;

  constructor(owner: Owner, args: HeaderContainerSignature['Args']) {
    super(owner, args);
    this.isSideNavExpanded = args.isSideNavExpanded ?? false;
    window.addEventListener('keydown', this.closeOnEscape);
    registerDestructor(this, () => {
      window.removeEventListener('keydown', this.closeOnEscape);
    });
  }

  closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.isSideNavExpanded = false;
    }
  };

  onClickSideNavExpand = () => {
    this.isSideNavExpanded = !this.isSideNavExpanded;
  };

  // eslint-disable-next-line ember/template-require-splattributes -- only yields state, as React's renders its `render`
  <template>
    {{yield
      (hash
        isSideNavExpanded=this.isSideNavExpanded
        onClickSideNavExpand=this.onClickSideNavExpand
      )
    }}
  </template>
}
