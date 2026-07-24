/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { element } from 'ember-element-helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import type { ComponentLike } from '@glint/template';

export interface LinkSignature {
  Element: HTMLElement;
  Args: {
    /**
     * Provide a custom element or component to render the top-level node for
     * the component. Defaults to `a`.
     */
    as?: keyof HTMLElementTagNameMap;
    /**
     * Specify if the control should be disabled, or not.
     */
    disabled?: boolean;
    /**
     * Provide the `href` attribute for the `<a>` node.
     */
    href?: string;
    /**
     * Specify whether you want the inline version of this control.
     */
    inline?: boolean;
    /**
     * A component used to render an icon.
     */
    renderIcon?: ComponentLike;
    /**
     * Specify the size of the Link. Currently supports either `sm`, `md`
     * (default) or `lg` as an option.
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Specify the target attribute for the `<a>` node.
     */
    target?: string;
    /**
     * When enabled, applies Carbon's visited-link styles to browser-controlled
     * `:visited` link state.
     */
    visited?: boolean;
    /**
     * Called when the link is clicked, unless it is disabled.
     */
    onClick?: (event: MouseEvent) => void;
  };
  Blocks: {
    default: [];
  };
}

export default class Link extends Component<LinkSignature> {
  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'a';
  }

  get rel() {
    return this.args.target === '_blank' ? 'noopener' : undefined;
  }

  get classes() {
    const classes = ['cds--link'];
    if (this.args.disabled) classes.push('cds--link--disabled');
    if (this.args.inline) classes.push('cds--link--inline');
    if (this.args.visited) classes.push('cds--link--visited');
    if (this.args.size) classes.push(`cds--link--${this.args.size}`);
    if (this.args.renderIcon) classes.push('cds--link--icon');
    return classes.join(' ');
  }

  get showIcon() {
    return !this.args.inline && !!this.args.renderIcon;
  }

  @action
  handleClick(event: MouseEvent) {
    if (this.args.disabled) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.args.onClick?.(event);
    }
  }

  <template>
    {{#let (element this.tag) as |Tag|}}
      <Tag
        class={{this.classes}}
        href={{unless @disabled @href}}
        role={{if @disabled 'link'}}
        aria-disabled={{if @disabled 'true'}}
        target={{@target}}
        rel={{this.rel}}
        {{on 'click' this.handleClick}}
        ...attributes
      >
        {{yield}}
        {{#if this.showIcon}}
          <span class='cds--link__icon'>
            <@renderIcon />
          </span>
        {{/if}}
      </Tag>
    {{/let}}
  </template>
}
