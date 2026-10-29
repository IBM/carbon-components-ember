/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Grid from '../grid.gts';
import { setFlag } from './-page-header-utils.ts';
import type PageHeader from './page-header.gts';
import type { TOC } from '@ember/component/template-only';

export interface PageHeaderTabBarSignature {
  Element: HTMLDivElement;
  Args: {
    /** The page header it's in: `PageHeader` yields this part bound to itself. */
    pageHeader: PageHeader;
    /** Stops the tab bar sticking to the top of the page as it scrolls. */
    disableStickyTabBar?: boolean;
  };
  Blocks: {
    /** The tabs. */
    default: [];
    /** A button that collapses and expands the content, such as a `ScrollButton`. */
    scroller: [];
    /** Tags beside the tabs, such as a `TagOverflow`. */
    tags: [];
  };
}

/** The tabs of a PageHeader, which stick to the top of the page as it scrolls. */
const PageHeaderTabBar: TOC<PageHeaderTabBarSignature> = <template>
  <div
    class="c4p--page-header__tab-bar"
    {{setFlag @pageHeader "disableStickyTabBar" (eq @disableStickyTabBar true)}}
    ...attributes
  >
    <Grid
      @mode="css-grid"
      @condensed={{true}}
      @fullWidth={{@pageHeader.isFullWidthGrid}}
      @narrow={{@pageHeader.isNarrowGrid}}
      as |grid|
    >
      <grid.Column @lg={{16}} @md={{8}} @sm={{4}}>
        {{#if (has-block "tags")}}
          <div
            class="c4p--page-header__tab-bar--tablist
              {{if
                (has-block 'scroller')
                'c4p--page-header__tab-bar--with-scroller'
              }}"
          >
            {{yield}}
            {{yield to="tags"}}
          </div>
        {{else}}
          {{yield}}
        {{/if}}
      </grid.Column>
    </Grid>
    {{#if (has-block "scroller")}}
      <div class="c4p--page-header--scroller-button-container">
        {{yield to="scroller"}}
      </div>
    {{/if}}
  </div>
</template>;

export default PageHeaderTabBar;
