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
import PageHeaderMenuButton from './-page-header-menu-button.gts';
import { registerPart } from './-page-header-utils.ts';
import type PageHeader from './page-header.gts';
import type { MenuItemSignature } from '../menu/menu-item.gts';
import type { ComponentLike } from '@glint/template';

/** One of a PageHeader's page actions: a button, and its item in the overflow menu. */
export interface PageHeaderContentPageAction {
  id: string;
  /** The button, which gets the `onClick` below as a click handler. */
  body: ComponentLike<{ Element: HTMLElement }>;
  /** The item the action becomes in the overflow menu once it doesn't fit. */
  menuItem: Pick<
    MenuItemSignature['Args'],
    | 'label'
    | 'disabled'
    | 'kind'
    | 'dangerDescription'
    | 'renderIcon'
    | 'shortcut'
  >;
  onClick?: () => void;
}

export interface PageHeaderContentPageActionsSignature {
  Element: HTMLUListElement;
  Args: {
    /** The page header it's in: `PageHeader` yields this part bound to itself. */
    pageHeader: PageHeader;
    /** The actions. The ones that don't fit move into a menu. */
    actions?: PageHeaderContentPageAction[];
    /** @internal Set on the part the breadcrumb bar yields. */
    inBreadcrumbBar?: boolean;
    /** The label of the menu button the actions that don't fit move into. Defaults to `Actions`. */
    menuButtonLabel?: string;
  };
}

const noop = () => {};

/**
 * The actions of a PageHeader, as buttons, with the ones that don't fit moved
 * into a menu.
 */
export default class PageHeaderContentPageActions extends Component<PageHeaderContentPageActionsSignature> {
  @tracked hiddenItems: PageHeaderContentPageAction[] = [];
  @tracked menuButtonVisible = false;

  get clipped() {
    const { pageHeader, inBreadcrumbBar } = this.args;
    // In the breadcrumb bar the actions show once the content's have scrolled
    // out of view.
    return inBreadcrumbBar
      ? !pageHeader.contentActionsClipped
      : pageHeader.contentActionsClipped;
  }

  get part() {
    return this.args.inBreadcrumbBar ? 'breadcrumbActions' : 'contentActions';
  }

  get menuItems() {
    return [...this.hiddenItems].reverse();
  }

  // The title's grid column makes room for the menu button.
  sizeTitleGrid = modifier((element: HTMLElement, [visible]: [boolean]) => {
    if (!visible) return;
    const width = element.offsetWidth;
    (this.args.pageHeader.rootElement ?? element).style.setProperty(
      '--c4p-page-header-title-grid-width',
      `${width}px`,
    );
  });

  manageOverflow = modifier((container: HTMLElement, [actions]: [unknown]) => {
    if (!Array.isArray(actions) || actions.length === 0) return;
    const handler = createOverflowHandler({
      container,
      // Not the hidden menu button.
      maxVisibleItems: container.children.length - 1,
      onChange: (visible, hidden) => {
        this.hiddenItems = (actions as PageHeaderContentPageAction[]).slice(
          visible.length,
        );
        if (hidden.length > 0) this.menuButtonVisible = true;
      },
    });
    return () => handler.disconnect();
  });

  <template>
    <ul
      class="c4p--page-header__content__page-actions
        {{if this.clipped 'c4p--page-header__content__page-actions--clipped'}}"
      {{registerPart @pageHeader this.part}}
      {{this.manageOverflow @actions}}
      ...attributes
    >
      {{#if @actions}}
        {{#each @actions key="id" as |action|}}
          <li><action.body {{on "click" (or action.onClick noop)}} /></li>
        {{/each}}
        <li
          data-offset="true"
          data-hidden="true"
          {{this.sizeTitleGrid this.menuButtonVisible}}
        >
          <PageHeaderMenuButton
            @label={{or @menuButtonLabel "Actions"}}
            as |MenuItem|
          >
            {{#each this.menuItems key="id" as |item|}}
              <MenuItem
                @label={{item.menuItem.label}}
                @disabled={{item.menuItem.disabled}}
                @kind={{item.menuItem.kind}}
                @dangerDescription={{item.menuItem.dangerDescription}}
                @renderIcon={{item.menuItem.renderIcon}}
                @shortcut={{item.menuItem.shortcut}}
                @onClick={{item.onClick}}
              />
            {{/each}}
          </PageHeaderMenuButton>
        </li>
      {{/if}}
    </ul>
  </template>
}
