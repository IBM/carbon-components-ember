/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The two layout engines Carbon's 2x Grid ships with. `flexbox` renders the
 * `cds--grid`/`cds--row`/`cds--col-*` class names, `css-grid` renders the
 * `cds--css-grid`/`cds--css-grid-column` class names.
 */
export type GridMode = 'flexbox' | 'css-grid';

/**
 * Horizontal alignment of a CSS Grid. Only applies when
 * `mode` is `css-grid`.
 */
export type GridAlign = 'start' | 'center' | 'end';

/**
 * The gutter mode a subgrid inherits from its parent grid.
 */
export type SubgridMode = 'wide' | 'narrow' | 'condensed';

/**
 * A column may span a percentage of the grid instead of a number of columns.
 * Only supported in `css-grid` mode.
 */
export type ColumnSpanPercent = '25%' | '50%' | '75%' | '100%';

export type ColumnSpanSimple = boolean | number | ColumnSpanPercent;

export interface ColumnSpanObject {
  /**
   * How many columns (or what percentage) the column should span.
   */
  span?: ColumnSpanSimple;
  /**
   * How many columns the column should be offset by.
   */
  offset?: number;
  /**
   * The grid line the column should start at. `css-grid` mode only.
   */
  start?: number;
  /**
   * The grid line the column should end at. `css-grid` mode only.
   */
  end?: number;
}

export type ColumnSpan = ColumnSpanSimple | ColumnSpanObject;

export const BREAKPOINTS = ['sm', 'md', 'lg', 'xlg', 'max'] as const;

export type Breakpoint = (typeof BREAKPOINTS)[number];
