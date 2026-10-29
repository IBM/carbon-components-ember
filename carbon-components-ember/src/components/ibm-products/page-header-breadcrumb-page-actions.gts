/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { createOverflowHandler } from '@carbon/utilities';
import { modifier } from 'ember-modifier';
import Button from '../button.gts';
import OverflowMenu from '../overflow-menu.gts';
import type { ButtonSignature } from '../button.gts';

/** One of the page actions beside a PageHeader's breadcrumbs. */
export interface PageHeaderBreadcrumbPageActionItem {
  /** Unique identifier for the action item. */
  id: string;
  /** Label for the action (used for icon description and overflow menu item text). */
  label: string;
  /** The icon of the action's button. */
  renderIcon: ButtonSignature['Args']['renderIcon'];
  onClick?: () => void;
}

export interface PageHeaderBreadcrumbPageActionsSignature {
  Element: HTMLUListElement;
  Args: {
    /** The actions. The ones that don't fit move into an overflow menu. */
    actions: PageHeaderBreadcrumbPageActionItem[];
    /** Kind of the action buttons. Defaults to `ghost`. */
    buttonKind?: Exclude<ButtonSignature['Args']['kind'], 'danger--primary'>;
    /** Size of the action buttons. Defaults to `md`. */
    buttonSize?: 'sm' | 'md' | 'lg';
    /** Aria label for the overflow menu. Defaults to `More page actions`. */
    overflowMenuLabel?: string;
  };
}

const noop = () => {};

/** Icon buttons beside a PageHeader's breadcrumbs, with the ones that don't fit in an overflow menu. */
export default class PageHeaderBreadcrumbPageActions extends Component<PageHeaderBreadcrumbPageActionsSignature> {
  @tracked hiddenItems: PageHeaderBreadcrumbPageActionItem[] = [];

  manage = modifier(
    (
      container: HTMLElement,
      [actions]: [PageHeaderBreadcrumbPageActionItem[]],
    ) => {
      const handler = createOverflowHandler({
        container,
        onChange: (_visible, hidden) => {
          const hiddenIds = hidden.map((element) => element.dataset['id']);
          this.hiddenItems = actions.filter((item) =>
            hiddenIds.includes(item.id),
          );
        },
      });
      return () => handler.disconnect();
    },
  );

  <template>
    <ul
      class="c4p--page-header__breadcrumb-page-actions"
      {{this.manage @actions}}
      ...attributes
    >
      {{#each @actions key="id" as |item|}}
        <li data-id={{item.id}}>
          <Button
            @renderIcon={{item.renderIcon}}
            @iconDescription={{item.label}}
            @hasIconOnly={{true}}
            @size={{or @buttonSize "md"}}
            @kind={{or @buttonKind "ghost"}}
            {{on "click" (or item.onClick noop)}}
          />
        </li>
      {{/each}}
      <li
        data-offset="true"
        data-hidden="true"
        data-floating-menu-container="true"
        class="c4p--page-header__breadcrumb-page-actions__overflow-item"
      >
        <OverflowMenu
          @size={{or @buttonSize "md"}}
          @ariaLabel={{or @overflowMenuLabel "More page actions"}}
          as |OverflowMenuItem|
        >
          {{#each this.hiddenItems key="id" as |item|}}
            <OverflowMenuItem
              @itemText={{item.label}}
              {{on "click" (or item.onClick noop)}}
            />
          {{/each}}
        </OverflowMenu>
      </li>
    </ul>
  </template>
}
