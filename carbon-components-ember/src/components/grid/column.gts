/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { element } from 'ember-element-helper';
import { BREAKPOINTS } from './-types.ts';
import type {
  ColumnSpan,
  ColumnSpanObject,
  ColumnSpanPercent,
  ColumnSpanSimple,
  GridMode,
} from './-types.ts';

export type {
  ColumnSpan,
  ColumnSpanObject,
  ColumnSpanPercent,
  ColumnSpanSimple,
};

export interface GridColumnSignature {
  Element: HTMLElement;
  Args: {
    as?: keyof HTMLElementTagNameMap;
    /**
     * Which grid engine the surrounding `Grid` uses. Normally inherited by
     * invoking the `Column` yielded from `Grid`, but can be set explicitly
     * when a column is rendered on its own.
     *
     * @defaultValue 'flexbox'
     */
    mode?: GridMode;
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
    /**
     * Specify a constant column span, start, or end value that does not
     * change based on breakpoint. Only applies in `css-grid` mode.
     */
    span?: ColumnSpan;
  };
  Blocks: {
    default: [];
  };
}

/**
 * Build the `cds--col-*` / `cds--offset-*` class names used by the Flexbox
 * grid for the given ordered list of breakpoint values.
 */
function flexboxClasses(breakpoints: (ColumnSpan | undefined)[]): string[] {
  const classes: string[] = [];

  breakpoints.forEach((value, index) => {
    if (value === undefined || value === null) return;

    const name = BREAKPOINTS[index];

    if (value === true) {
      classes.push(`cds--col-${name}`);
      return;
    }

    if (typeof value === 'number') {
      classes.push(`cds--col-${name}-${value}`);
      return;
    }

    if (typeof value === 'object') {
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
  });

  return classes;
}

/**
 * Build the responsive `cds--{breakpoint}:col-*` class names used by the CSS
 * Grid for the given ordered list of breakpoint values.
 */
function cssGridClasses(breakpoints: (ColumnSpan | undefined)[]): string[] {
  const classes: string[] = [];

  breakpoints.forEach((value, index) => {
    if (value === undefined || value === null) return;

    const name = BREAKPOINTS[index];

    // A boolean means the column should size itself automatically
    if (value === true) {
      classes.push(`cds--${name}:col-span-auto`);
      return;
    }

    // A string means the column should span a percentage of the grid
    if (typeof value === 'string') {
      classes.push(`cds--${name}:col-span-${value.replace('%', '')}`);
      return;
    }

    if (typeof value === 'number') {
      classes.push(`cds--${name}:col-span-${value}`);
      return;
    }

    if (typeof value === 'object') {
      const { span, offset, start, end } = value;

      if (typeof offset === 'number') {
        classes.push(
          `cds--${name}:col-start-${offset > 0 ? offset + 1 : 'auto'}`,
        );
      }

      if (typeof start === 'number') {
        classes.push(`cds--${name}:col-start-${start ? start : 'auto'}`);
      }

      if (typeof end === 'number') {
        classes.push(`cds--${name}:col-end-${end}`);
      }

      if (typeof span === 'number') {
        classes.push(`cds--${name}:col-span-${span}`);
      } else if (typeof span === 'string') {
        classes.push(`cds--${name}:col-span-${span.replace('%', '')}`);
      }
    }
  });

  return classes;
}

/**
 * Build the breakpoint-independent `cds--col-span-*` / `cds--col-start-*` /
 * `cds--col-end-*` class names for the `span` argument.
 */
function spanClasses(value: ColumnSpan | undefined): string[] {
  const classes: string[] = [];

  if (typeof value === 'number') {
    classes.push(`cds--col-span-${value}`);
  } else if (typeof value === 'string') {
    classes.push(`cds--col-span-${value.replace('%', '')}`);
  } else if (typeof value === 'object' && value !== null) {
    const { span, start, end } = value;

    if (span !== undefined && span !== null) {
      const resolved = typeof span === 'string' ? span.replace('%', '') : span;
      classes.push(`cds--col-span-${resolved}`);
    }

    if (start !== undefined && start !== null) {
      classes.push(`cds--col-start-${start}`);
    }

    if (end !== undefined && end !== null) {
      classes.push(`cds--col-end-${end}`);
    }
  }

  return classes;
}

export default class GridColumn extends Component<GridColumnSignature> {
  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'div';
  }

  get mode(): GridMode {
    return this.args.mode ?? 'flexbox';
  }

  get classes() {
    const { sm, md, lg, xlg, max } = this.args;
    const breakpoints = [sm, md, lg, xlg, max];

    if (this.mode === 'css-grid') {
      return [
        ...cssGridClasses(breakpoints),
        ...spanClasses(this.args.span),
        'cds--css-grid-column',
      ].join(' ');
    }

    const classes = flexboxClasses(breakpoints);

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
