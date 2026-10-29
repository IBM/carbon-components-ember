/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Grid from '../grid.gts';
import PageHeaderContentPageActions from './page-header-content-page-actions.gts';
import type PageHeader from './page-header.gts';
import type { PageHeaderObserverState } from './-page-header-utils.ts';
import type { TOC } from '@ember/component/template-only';
import type { WithBoundArgs } from '@glint/template';
import type { IconComponent } from '../icon.gts';

export interface PageHeaderBreadcrumbBarSignature {
  Element: HTMLDivElement;
  Args: {
    /** The page header it's in: `PageHeader` yields this part bound to itself. */
    pageHeader: PageHeader;
    /** Aria label for the page header actions toolbar. Defaults to `Page header actions`. */
    actionsAriaLabel?: string;
    /** `true` by default to render BreadcrumbBar bottom border. */
    border?: boolean;
    /** `true` to set content actions flush against page actions. */
    contentActionsFlush?: boolean;
    /** `true` to set page actions flush with page. */
    pageActionsFlush?: boolean;
    /** An icon to render in front of the breadcrumbs. */
    renderIcon?: IconComponent;
  };
  Blocks: {
    /** The breadcrumbs, such as a `BreadcrumbOverflow`. */
    default: [];
    /**
     * The content actions. They show once the content's own actions scroll
     * out of view. Use the `ContentPageActions` it yields, which knows it's
     * in the bar; the second param is the header's observer state.
     */
    contentActions: [
      state: PageHeaderObserverState,
      ContentPageActions: WithBoundArgs<
        typeof PageHeaderContentPageActions,
        'pageHeader' | 'inBreadcrumbBar'
      >,
    ];
    /** The page actions, such as a `BreadcrumbPageActions`. */
    pageActions: [
      state: PageHeaderObserverState,
      ContentPageActions: WithBoundArgs<
        typeof PageHeaderContentPageActions,
        'pageHeader' | 'inBreadcrumbBar'
      >,
    ];
  };
}

/** The bar of breadcrumbs, and actions, a PageHeader sticks to the top. */
const PageHeaderBreadcrumbBar: TOC<PageHeaderBreadcrumbBarSignature> =
  <template>
    <div
      class="c4p--page-header__breadcrumb-bar
        {{unless (eq @border false) 'c4p--page-header__breadcrumb-bar-border'}}
        {{if @pageActionsFlush 'c4p--page-header__breadcrumb__actions-flush'}}"
      ...attributes
    >
      <Grid
        @mode="css-grid"
        @fullWidth={{@pageHeader.isFullWidthGrid}}
        @narrow={{@pageHeader.isNarrowGrid}}
        as |grid|
      >
        <grid.Column @lg={{16}} @md={{8}} @sm={{4}}>
          <div class="c4p--page-header__breadcrumb-container">
            <div class="c4p--page-header__breadcrumb-wrapper">
              {{#if @renderIcon}}
                <div
                  class="c4p--page-header__breadcrumb__icon"
                  aria-hidden="true"
                >
                  <@renderIcon />
                </div>
              {{/if}}
              {{yield}}
            </div>
            {{#if (or (has-block "contentActions") (has-block "pageActions"))}}
              <div
                class="c4p--page-header__breadcrumb__actions"
                role="toolbar"
                aria-label={{or @actionsAriaLabel "Page header actions"}}
              >
                <div
                  class="{{unless
                      @contentActionsFlush
                      'c4p--page-header__breadcrumb__content-actions'
                    }}
                    {{if
                      @pageHeader.hasPageActions
                      'c4p--page-header__breadcrumb__content-actions-with-global-actions'
                    }}
                    {{if
                      @pageHeader.contentActionsClipped
                      'c4p--page-header__breadcrumb__content-actions-with-global-actions--show'
                    }}"
                >
                  {{yield
                    @pageHeader.observerState
                    (component
                      PageHeaderContentPageActions
                      pageHeader=@pageHeader
                      inBreadcrumbBar=true
                    )
                    to="contentActions"
                  }}
                </div>
                {{yield
                  @pageHeader.observerState
                  (component
                    PageHeaderContentPageActions
                    pageHeader=@pageHeader
                    inBreadcrumbBar=true
                  )
                  to="pageActions"
                }}
              </div>
            {{/if}}
          </div>
        </grid.Column>
      </Grid>
    </div>
  </template>;

export default PageHeaderBreadcrumbBar;
