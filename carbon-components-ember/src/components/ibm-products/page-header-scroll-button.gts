/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import Button from '../button.gts';
import ChevronUp from '../icons/chevron-up.ts';
import { scrollableAncestor } from './-page-header-utils.ts';
import type PageHeader from './page-header.gts';
import type { ButtonSignature } from '../button.gts';

export interface PageHeaderScrollButtonSignature {
  Element: ButtonSignature['Element'];
  Args: {
    /** The page header it's in: `PageHeader` yields this part bound to itself. */
    pageHeader: PageHeader;
    /** Lets the tooltip stay in view. Defaults to `true`. */
    autoAlign?: boolean;
    disabled?: boolean;
    href?: string;
    isSelected?: boolean;
    /** Defaults to `ghost`. */
    kind?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
    /** Defaults to `md`. */
    size?: 'xs' | 'sm' | 'md' | 'lg';
    /** The button's label while the content is showing. Defaults to `Collapse`. */
    collapseText?: string;
    /** The button's label once the content has collapsed. Defaults to `Expand`. */
    expandText?: string;
  };
}

/** A button that scrolls the page to collapse a PageHeader's content, or back up to expand it. */
export default class PageHeaderScrollButton extends Component<PageHeaderScrollButtonSignature> {
  get fullyCollapsed() {
    return this.args.pageHeader.fullyCollapsed;
  }

  scroll = () => {
    const content = this.args.pageHeader.contentElement;
    if (!content) return;
    const target = scrollableAncestor(content);
    target?.scrollTo({
      top: this.fullyCollapsed ? 0 : content.offsetHeight,
      behavior: 'smooth',
    });
  };

  <template>
    <Button
      class="c4p--page-header--scroller-button"
      @hasIconOnly={{true}}
      @iconDescription={{if
        this.fullyCollapsed
        (or @expandText "Expand")
        (or @collapseText "Collapse")
      }}
      @kind={{or @kind "ghost"}}
      @size={{or @size "md"}}
      @autoAlign={{if (eq @autoAlign false) false true}}
      @disabled={{@disabled}}
      @href={{@href}}
      @isSelected={{@isSelected}}
      {{on "click" this.scroll}}
      ...attributes
    >
      <ChevronUp
        @svgClass="c4p--page-header--scroller-button-icon
          {{if
          this.fullyCollapsed
          'c4p--page-header--scroller-button-icon-collapsed'
        }}"
      />
    </Button>
  </template>
}
