/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import RouterLink from '../-private/router-link.gts';
import type { RouteArgs } from '../-private/router-link.gts';

import type OverflowMenu from '../overflow-menu.gts';

export interface OverflowMenuItemSignature {
  Element: HTMLButtonElement | HTMLAnchorElement;
  Args: RouteArgs & {
    /** Hidden text read after a delete item's text. */
    dangerDescription?: string;
    disabled?: boolean;
    /** Draws a divider above the item. */
    hasDivider?: boolean;
    /** Renders the item as a link. */
    href?: string;
    /** Styles the item as a destructive action. */
    isDelete?: boolean;
    /** The item's text. A block replaces it, for richer content. */
    itemText?: string;
    /** The menu the item is in: OverflowMenu yields the item bound to it. */
    menu?: OverflowMenu;
    /** Gives the item a `title`: `@title`, or else `@itemText`. */
    requireTitle?: boolean;
    title?: string;
    /** Classes for the item's `<li>`. */
    wrapperClassName?: string;
  };
  Blocks: {
    default: [];
  };
}

export default class OverflowMenuItem extends Component<OverflowMenuItemSignature> {
  assistiveId = `${guidFor(this)}-danger-description`;

  get tag() {
    return this.args.href ? 'a' : 'button';
  }

  // A disabled item stays a button.
  get isRouteLink() {
    return (
      Boolean(this.args.route || this.args.externalRoute) && !this.args.disabled
    );
  }

  get wrapperClass() {
    const classes = ['cds--overflow-menu-options__option'];
    if (this.args.hasDivider) classes.push('cds--overflow-menu--divider');
    if (this.args.isDelete)
      classes.push('cds--overflow-menu-options__option--danger');
    if (this.args.disabled)
      classes.push('cds--overflow-menu-options__option--disabled');
    if (this.args.wrapperClassName) classes.push(this.args.wrapperClassName);
    return classes.join(' ');
  }

  get title() {
    if (!this.args.requireTitle) return undefined;
    return this.args.title || this.args.itemText;
  }

  get hasDangerDescription() {
    return Boolean(this.args.isDelete && this.args.dangerDescription);
  }

  close = () => {
    this.args.menu?.close();
  };

  <template>
    <li class={{this.wrapperClass}} role="none" dir="auto">
      {{#if this.isRouteLink}}
        <RouterLink
          @route={{@route}}
          @externalRoute={{@externalRoute}}
          @models={{@models}}
          @query={{@query}}
          class="cds--overflow-menu-options__btn"
          role="menuitem"
          tabindex="-1"
          title={{this.title}}
          {{(if @menu @menu.rovingFocus.item)}}
          ...attributes
          {{on "click" this.close}}
        >
          {{#if (has-block)}}
            {{yield}}
          {{else}}
            <div class="cds--overflow-menu-options__option-content">
              {{@itemText}}
            </div>
            {{#if this.hasDangerDescription}}
              <span id={{this.assistiveId}} class="cds--visually-hidden">
                {{@dangerDescription}}
              </span>
            {{/if}}
          {{/if}}
        </RouterLink>
      {{else}}
        {{#let (element this.tag) as |Tag|}}
          <Tag
            class="cds--overflow-menu-options__btn"
            role="menuitem"
            tabindex="-1"
            href={{@href}}
            title={{this.title}}
            disabled={{@disabled}}
            {{(if @menu @menu.rovingFocus.item) disabled=@disabled}}
            ...attributes
            {{on "click" this.close}}
          >
            {{#if (has-block)}}
              {{yield}}
            {{else}}
              <div class="cds--overflow-menu-options__option-content">
                {{@itemText}}
              </div>
              {{#if this.hasDangerDescription}}
                <span id={{this.assistiveId}} class="cds--visually-hidden">
                  {{@dangerDescription}}
                </span>
              {{/if}}
            {{/if}}
          </Tag>
        {{/let}}
      {{/if}}
    </li>
  </template>
}
