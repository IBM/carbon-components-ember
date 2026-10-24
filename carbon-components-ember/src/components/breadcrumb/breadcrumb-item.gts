/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Link from '../link.gts';
import OverflowMenu from '../overflow-menu.gts';
import OverflowMenuHorizontal from '../icons/overflow-menu-horizontal.ts';
import type { RouteArgs } from '../-private/router-link.gts';
import type { TOC } from '@ember/component/template-only';
import type { WithBoundArgs } from '@glint/template';

type AriaCurrent =
  boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time';

export interface BreadcrumbItemSignature {
  Element: HTMLLIElement;
  Args: RouteArgs & {
    /**
     * The `aria-current` of the item's link, such as "page". Carbon React
     * takes it as its `aria-current` prop, which goes to the link.
     */
    ariaCurrent?: AriaCurrent;
    /**
     * Optional string representing the link location for the BreadcrumbItem
     */
    href?: string;
    /**
     * Provide if this breadcrumb item represents the current page
     */
    isCurrentPage?: boolean;
  };
  Blocks: {
    /**
     * The item's text, shown as a link with `@href` or `@route`. With block
     * params (`as |item|`), the block renders its own link instead, and
     * `@href` and `@route` are unused: put `item.class` and
     * `item.ariaCurrent` on it. As in Carbon React, `item.ariaCurrent` is
     * `@ariaCurrent` only; `@isCurrentPage` styles the item but not the link.
     * Or render `item.OverflowMenu`, set up for a breadcrumb as Carbon React
     * sets up an OverflowMenu child: Carbon's breadcrumb menu class and
     * offset, and the horizontal icon.
     */
    default: [
      {
        class: string;
        ariaCurrent: string | undefined;
        OverflowMenu: WithBoundArgs<
          typeof OverflowMenu,
          'menuOptionsClass' | 'menuOffset' | 'renderIcon'
        >;
      },
    ];
  };
}

const toAttribute = (value: AriaCurrent | undefined) =>
  value === undefined ? undefined : String(value);

// As in Carbon React: the link's `aria-current` falls back to
// `@isCurrentPage`, but `aria-current="page"` styles the item by itself.
const linkAriaCurrent = (ariaCurrent?: AriaCurrent, isCurrentPage?: boolean) =>
  toAttribute(ariaCurrent || isCurrentPage);

const isCurrent = (isCurrentPage?: boolean, ariaCurrent?: AriaCurrent) =>
  isCurrentPage && ariaCurrent !== 'page';

const breadcrumbMenuOffset = { top: 10, left: 59 };

const BreadcrumbItem: TOC<BreadcrumbItemSignature> = <template>
  <li
    class="cds--breadcrumb-item
      {{if
        (isCurrent @isCurrentPage @ariaCurrent)
        'cds--breadcrumb-item--current'
      }}"
    ...attributes
  >
    {{#let
      (hash
        class="cds--link"
        ariaCurrent=(toAttribute @ariaCurrent)
        OverflowMenu=(component
          OverflowMenu
          menuOptionsClass="cds--breadcrumb-menu-options"
          menuOffset=breadcrumbMenuOffset
          renderIcon=OverflowMenuHorizontal
        )
      )
      as |item|
    }}
      {{#if (has-block-params)}}
        {{yield item}}
      {{else if (or @href @route)}}
        <Link
          @href={{@href}}
          @route={{@route}}
          @models={{@models}}
          @query={{@query}}
          aria-current={{linkAriaCurrent @ariaCurrent @isCurrentPage}}
        >{{yield item}}</Link>
      {{else}}
        <span
          class="cds--link"
          aria-current={{linkAriaCurrent @ariaCurrent @isCurrentPage}}
          dir="auto"
        >{{yield item}}</span>
      {{/if}}
    {{/let}}
  </li>
</template>;

export default BreadcrumbItem;
