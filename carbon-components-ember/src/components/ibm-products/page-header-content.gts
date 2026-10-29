/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { concat, uniqueId } from '@ember/helper';
import Grid from '../grid.gts';
import PageHeaderTruncatedText from './-page-header-truncated-text.gts';
import { registerPart, setFlag } from './-page-header-utils.ts';
import type PageHeader from './page-header.gts';
import type { PageHeaderObserverState } from './-page-header-utils.ts';
import type { TOC } from '@ember/component/template-only';
import type { IconComponent } from '../icon.gts';

export interface PageHeaderContentSignature {
  Element: HTMLDivElement;
  Args: {
    /** The page header it's in: `PageHeader` yields this part bound to itself. */
    pageHeader: PageHeader;
    /**
     * The title. Text is truncated, with a tooltip showing all of it. A
     * `title` block replaces it, for richer content.
     */
    title?: string;
    /** An icon to render in front of the title. */
    renderIcon?: IconComponent;
    /** The element the title is. Defaults to `h1`. */
    titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    /**
     * The most lines the title can span before truncating. Defaults to 1
     * with contextual actions, otherwise 2.
     */
    titleTruncate?: number;
  };
  Blocks: {
    /** Content under the title, such as a `ContentText`. */
    default: [];
    /** Rich content in place of `@title`, which isn't truncated. */
    title: [];
    /** Actions next to the title, such as tags. */
    contextualActions: [];
    /**
     * The page actions, such as a `ContentPageActions`. The block param is
     * the header's observer state.
     */
    pageActions: [state: PageHeaderObserverState];
  };
}

/** The title, actions and text of a PageHeader, which collapse as the page scrolls. */
const PageHeaderContent: TOC<PageHeaderContentSignature> = <template>
  <div
    class="c4p--page-header__content"
    {{registerPart @pageHeader "content"}}
    {{setFlag @pageHeader "hasPageActions" (has-block "pageActions")}}
    ...attributes
  >
    <Grid
      @mode="css-grid"
      @fullWidth={{@pageHeader.isFullWidthGrid}}
      @narrow={{@pageHeader.isNarrowGrid}}
      as |grid|
    >
      <grid.Column @lg={{16}} @md={{8}} @sm={{4}}>
        <div class="c4p--page-header__content__title-wrapper">
          <div class="c4p--page-header__content__start">
            <div class="c4p--page-header__content__title-container">
              {{#if @renderIcon}}
                <div class="c4p--page-header__content__icon" aria-hidden="true">
                  <@renderIcon />
                </div>
              {{/if}}
              {{#let (element (or @titleAs "h1")) as |TitleTag|}}
                <TitleTag
                  class="c4p--page-header__content__title"
                  {{registerPart @pageHeader "title"}}
                >
                  {{#if (has-block "title")}}
                    <span class="c4p--page-header__content__title-text">{{yield
                        to="title"
                      }}</span>
                  {{else}}
                    {{! Upstream's id is fixed; one per title keeps two headers on a page apart. }}
                    <PageHeaderTruncatedText
                      @id={{concat
                        "c4p--page-header__content__title__truncatedText-"
                        (uniqueId)
                      }}
                      class="c4p--page-header__content__title-text"
                      @align="bottom"
                      @value={{or @title ""}}
                      @lines={{or
                        @titleTruncate
                        (if (has-block "contextualActions") 1 2)
                      }}
                    />
                  {{/if}}
                </TitleTag>
              {{/let}}
            </div>
            {{#if (has-block "contextualActions")}}
              <div class="c4p--page-header__content__contextual-actions">
                {{yield to="contextualActions"}}
              </div>
            {{/if}}
          </div>
          {{yield @pageHeader.observerState to="pageActions"}}
        </div>
        {{yield}}
      </grid.Column>
    </Grid>
  </div>
</template>;

export default PageHeaderContent;
