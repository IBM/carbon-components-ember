/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { element } from 'ember-element-helper';

export interface ColumnSpanObject {
  span?: boolean | number;
  offset?: number;
}

export type ColumnSpan = boolean | number | ColumnSpanObject;

type Breakpoint = 'sm' | 'md' | 'lg' | 'xlg' | 'max';

export interface GridColumnSignature {
  Element: HTMLElement;
  Args: {
    as?: keyof HTMLElementTagNameMap;
    /**
     * Specify column span for the `sm` breakpoint (up to 671px).
     * This breakpoint supports 4 columns by default.
     */
    sm?: ColumnSpan;
    /**
     * Specify column span for the `md` breakpoint (up to 1055px).
     * This breakpoint supports 8 columns by default.
     */
    md?: ColumnSpan;
    /**
     * Specify column span for the `lg` breakpoint (up to 1311px).
     * This breakpoint supports 16 columns by default.
     */
    lg?: ColumnSpan;
    /**
     * Specify column span for the `xlg` breakpoint (up to 1583px).
     * This breakpoint supports 16 columns by default.
     */
    xlg?: ColumnSpan;
    /**
     * Specify column span for the `max` breakpoint.
     * This breakpoint supports 16 columns by default.
     */
    max?: ColumnSpan;
  };
  Blocks: {
    default: [];
  };
}

const BREAKPOINTS: Breakpoint[] = ['sm', 'md', 'lg', 'xlg', 'max'];

export default class GridColumn extends Component<GridColumnSignature> {
  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'div';
  }

  get classes() {
    const classes: string[] = [];

    for (const name of BREAKPOINTS) {
      const value = this.args[name];
      if (value === undefined || value === null) continue;

      if (value === true) {
        classes.push(`cds--col-${name}`);
        continue;
      }

      if (value === false) {
        continue;
      }

      if (typeof value === 'number') {
        classes.push(`cds--col-${name}-${value}`);
        continue;
      }

      const { span, offset } = value;
      if (span === true) {
        classes.push(`cds--col-${name}`);
      } else if (typeof span === 'number') {
        classes.push(`cds--col-${name}-${span}`);
      }
      if (typeof offset === 'number') {
        classes.push(`cds--offset-${name}-${offset}`);
      }
    }

    if (classes.length === 0) {
      classes.push('cds--col');
    }

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
