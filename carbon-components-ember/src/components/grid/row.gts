/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { element } from 'ember-element-helper';

export interface GridRowSignature {
  Element: HTMLElement;
  Args: {
    as?: keyof HTMLElementTagNameMap;
    /**
     * Specify a single row as condensed. Rows that are adjacent
     * and are condensed will have 2px of margin between them to match gutter.
     */
    condensed?: boolean;
    /**
     * Specify a single row as narrow. The container will hang
     * 16px into the gutter.
     */
    narrow?: boolean;
  };
  Blocks: {
    default: [];
  };
}

export default class GridRow extends Component<GridRowSignature> {
  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'div';
  }

  get classes() {
    const classes = ['cds--row'];
    if (this.args.condensed) classes.push('cds--row--condensed');
    if (this.args.narrow) classes.push('cds--row--narrow');
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
