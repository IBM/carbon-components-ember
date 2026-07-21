/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { element } from 'ember-element-helper';

export interface GridSignature {
  Element: HTMLElement;
  Args: {
    as?: keyof HTMLElementTagNameMap;
    /**
     * Collapse the gutter to 1px. Useful for fluid layouts.
     * Rows have 1px of margin between them to match gutter.
     */
    condensed?: boolean;
    /**
     * Remove the default max width that the grid has set
     */
    fullWidth?: boolean;
    /**
     * Container hangs 16px into the gutter. Useful for
     * typographic alignment with and without containers.
     */
    narrow?: boolean;
    /**
     * Add a row gap to the grid that matches the current gutter size.
     */
    withRowGap?: boolean;
  };
  Blocks: {
    default: [];
  };
}

export default class Grid extends Component<GridSignature> {
  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'div';
  }

  get classes() {
    const classes = ['cds--grid'];
    if (this.args.condensed) classes.push('cds--grid--condensed');
    if (this.args.narrow) classes.push('cds--grid--narrow');
    if (this.args.fullWidth) classes.push('cds--grid--full-width');
    if (this.args.withRowGap) classes.push('cds--grid--with-row-gap');
    return classes.join(' ');
  }

  <template>
    {{#let (element this.tag) as |Tag|}}
      <Tag class={{this.classes}} ...attributes>
        {{yield}}
      </Tag>
    {{/let}}
  </template>
}
