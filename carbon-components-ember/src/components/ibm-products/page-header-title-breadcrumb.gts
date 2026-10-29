/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import BreadcrumbItem from '../breadcrumb/breadcrumb-item.gts';
import PageHeaderOverflowBreadcrumb from './-page-header-overflow-breadcrumb.gts';
import PageHeaderBreadcrumbPart from './-page-header-breadcrumb-part.ts';
import type PageHeader from './page-header.gts';
import type PageHeaderBreadcrumbOverflow from './page-header-breadcrumb-overflow.gts';
import type { BreadcrumbItemSignature } from '../breadcrumb/breadcrumb-item.gts';

export interface PageHeaderTitleBreadcrumbSignature {
  Element: BreadcrumbItemSignature['Element'];
  Args: BreadcrumbItemSignature['Args'] & {
    /** The page header it's in: `PageHeader` yields this part bound to itself. */
    pageHeader: PageHeader;
    /** The trail it's in: `BreadcrumbOverflow` yields this part bound to itself. */
    overflow?: PageHeaderBreadcrumbOverflow;
  };
  Blocks: {
    default: [];
  };
}

/**
 * The current page's breadcrumb, which shows once the page header's title has
 * scrolled out of view (or always, when there's no content).
 */
export default class PageHeaderTitleBreadcrumb extends PageHeaderBreadcrumbPart<PageHeaderTitleBreadcrumbSignature> {
  get hasContentElement() {
    return Boolean(this.args.pageHeader.contentElement);
  }

  // Shows with no content element (compact mode), or once the title's clipped.
  get shouldShow() {
    const { pageHeader } = this.args;
    return (
      !this.hasContentElement ||
      (pageHeader.titleClipped && Boolean(pageHeader.titleElement))
    );
  }

  get isAriaHidden() {
    return this.hasContentElement && !this.args.pageHeader.titleClipped;
  }

  <template>
    {{#if this.showsOverflowBreadcrumb}}
      {{#if @overflow}}
        <PageHeaderOverflowBreadcrumb @overflow={{@overflow}} />
      {{/if}}
    {{/if}}
    <BreadcrumbItem
      @isCurrentPage={{if (eq @isCurrentPage false) false true}}
      @ariaCurrent={{@ariaCurrent}}
      @href={{@href}}
      @route={{@route}}
      @externalRoute={{@externalRoute}}
      @models={{@models}}
      @query={{@query}}
      class="c4p--page-header-title-breadcrumb
        {{if this.shouldShow 'c4p--page-header-title-breadcrumb-show'}}
        {{if
          this.hasContentElement
          'c4p--page-header-title-breadcrumb-show__with-content-element'
          'c4p--page-header-title-breadcrumb-show__without-content-element'
        }}"
      {{this.captureElement}}
      ...attributes
      aria-hidden={{if this.isAriaHidden "true"}}
      tabindex={{if this.isAriaHidden "-1"}}
    >{{yield}}</BreadcrumbItem>
  </template>
}
