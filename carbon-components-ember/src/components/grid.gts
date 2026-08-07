/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import { element } from 'ember-element-helper';
import GridColumn from './grid/column.gts';
import GridColumnHang from './grid/column-hang.gts';
import GridRow from './grid/row.gts';
import type { GridAlign, GridMode, SubgridMode } from './grid/-types.ts';
import type { WithBoundArgs } from '@glint/template';

export type { GridAlign, GridMode, SubgridMode };

export interface GridBlock {
  /**
   * A nested `Grid`. In `css-grid` mode this renders a subgrid that inherits
   * the parent's column tracks.
   */
  Grid: WithBoundArgs<typeof Grid, 'mode' | 'subgrid'>;
  /**
   * A `GridColumn` already bound to this grid's mode.
   */
  Column: WithBoundArgs<typeof GridColumn, 'mode'>;
  /**
   * A `GridRow`. Only meaningful in `flexbox` mode -- the CSS Grid has no
   * row elements.
   */
  Row: typeof GridRow;
  /**
   * Renders content that hangs into the gutter, so it stays aligned across
   * different gutter modes.
   */
  ColumnHang: typeof GridColumnHang;
  /**
   * The resolved grid mode.
   */
  mode: GridMode;
}

export interface GridSignature {
  Element: HTMLElement;
  Args: {
    as?: keyof HTMLElementTagNameMap;
    /**
     * Specify grid alignment. Default is center.
     * Only applies when `mode` is `css-grid`.
     */
    align?: GridAlign;
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
     * Which layout engine to use. `flexbox` renders `cds--grid`/`cds--row`/
     * `cds--col-*`, `css-grid` renders `cds--css-grid`/`cds--css-grid-column`.
     *
     * @defaultValue 'flexbox'
     */
    mode?: GridMode;
    /**
     * Container hangs 16px into the gutter. Useful for
     * typographic alignment with and without containers.
     */
    narrow?: boolean;
    /**
     * Render as a subgrid of a surrounding CSS Grid instead of as a new
     * grid. Set automatically for the `Grid` yielded from another `Grid`.
     */
    subgrid?: boolean;
    /**
     * Add a row gap to the grid that matches the current gutter size.
     */
    withRowGap?: boolean;
  };
  Blocks: {
    default: [GridBlock];
  };
}

/**
 * The 2x Grid. Renders Carbon's Flexbox grid by default; pass
 * `@mode="css-grid"` to render the CSS Grid instead, which additionally
 * supports subgrids, percentage spans and `start`/`end` placement.
 *
 * ```gts
 * <Grid @mode="css-grid" as |g|>
 *   <g.Column @sm={{4}} @md={{8}} @lg={{16}}>Content</g.Column>
 * </Grid>
 * ```
 */
export default class Grid extends Component<GridSignature> {
  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'div';
  }

  get mode(): GridMode {
    return this.args.mode ?? 'flexbox';
  }

  /**
   * A grid nested inside a CSS Grid renders as a subgrid.
   */
  get isSubgrid(): boolean {
    return this.mode === 'css-grid' && Boolean(this.args.subgrid);
  }

  /**
   * Grids yielded from this one are subgrids whenever we're a CSS Grid.
   */
  get nestedSubgrid(): boolean {
    return this.mode === 'css-grid';
  }

  get gutterMode(): SubgridMode {
    if (this.args.narrow) return 'narrow';
    if (this.args.condensed) return 'condensed';
    return 'wide';
  }

  get classes() {
    const classes: string[] = [];

    if (this.mode === 'flexbox') {
      classes.push('cds--grid');
      if (this.args.condensed) classes.push('cds--grid--condensed');
      if (this.args.narrow) classes.push('cds--grid--narrow');
      if (this.args.fullWidth) classes.push('cds--grid--full-width');
      if (this.args.withRowGap) classes.push('cds--grid--with-row-gap');
      return classes.join(' ');
    }

    if (this.isSubgrid) {
      classes.push('cds--subgrid', `cds--subgrid--${this.gutterMode}`);
      if (this.args.withRowGap) classes.push('cds--subgrid--with-row-gap');
      return classes.join(' ');
    }

    classes.push('cds--css-grid');
    if (this.gutterMode === 'condensed') {
      classes.push('cds--css-grid--condensed');
    }
    if (this.gutterMode === 'narrow') classes.push('cds--css-grid--narrow');
    if (this.args.fullWidth) classes.push('cds--css-grid--full-width');
    if (this.args.align === 'start') classes.push('cds--css-grid--start');
    if (this.args.align === 'end') classes.push('cds--css-grid--end');
    if (this.args.withRowGap) classes.push('cds--css-grid--with-row-gap');
    return classes.join(' ');
  }

  <template>
    {{#let (element this.tag) as |Tag|}}
      <Tag class={{this.classes}} ...attributes>
        {{yield
          (hash
            Grid=(component Grid mode=this.mode subgrid=this.nestedSubgrid)
            Column=(component GridColumn mode=this.mode)
            Row=GridRow
            ColumnHang=GridColumnHang
            mode=this.mode
          )
        }}
      </Tag>
    {{/let}}
  </template>
}

/**
 * A `Grid` that always renders Carbon's Flexbox grid, regardless of the
 * `mode` argument.
 */
export class FlexGrid extends Grid {
  override get mode(): GridMode {
    return 'flexbox';
  }
}
