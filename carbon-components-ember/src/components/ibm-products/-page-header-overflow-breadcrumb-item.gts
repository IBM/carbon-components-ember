/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import BreadcrumbItem from '../breadcrumb/breadcrumb-item.gts';
import PageHeaderOverflowBreadcrumb from './-page-header-overflow-breadcrumb.gts';
import PageHeaderBreadcrumbPart from './-page-header-breadcrumb-part.ts';
import type PageHeaderBreadcrumbOverflow from './page-header-breadcrumb-overflow.gts';
import type { BreadcrumbItemSignature } from '../breadcrumb/breadcrumb-item.gts';

export interface PageHeaderOverflowBreadcrumbItemSignature {
  Element: BreadcrumbItemSignature['Element'];
  Args: BreadcrumbItemSignature['Args'] & {
    overflow: PageHeaderBreadcrumbOverflow;
  };
  Blocks: {
    default: [item?: BreadcrumbItemSignature['Blocks']['default'][0]];
  };
}

// A BreadcrumbItem that renders the trail's overflow breadcrumb before itself
// when it's the last one.
export default class PageHeaderOverflowBreadcrumbItem extends PageHeaderBreadcrumbPart<PageHeaderOverflowBreadcrumbItemSignature> {
  <template>
    {{#if this.showsOverflowBreadcrumb}}
      <PageHeaderOverflowBreadcrumb @overflow={{@overflow}} />
    {{/if}}
    {{#if (has-block-params)}}
      <BreadcrumbItem
        @ariaCurrent={{@ariaCurrent}}
        @href={{@href}}
        @isCurrentPage={{@isCurrentPage}}
        @route={{@route}}
        @models={{@models}}
        @query={{@query}}
        {{this.captureElement}}
        ...attributes
        as |item|
      >{{yield item}}</BreadcrumbItem>
    {{else}}
      <BreadcrumbItem
        @ariaCurrent={{@ariaCurrent}}
        @href={{@href}}
        @isCurrentPage={{@isCurrentPage}}
        @route={{@route}}
        @models={{@models}}
        @query={{@query}}
        {{this.captureElement}}
        ...attributes
      >{{yield}}</BreadcrumbItem>
    {{/if}}
  </template>
}
