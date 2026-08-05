/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import Grid from '../grid.gts';
import GridColumn from './column.gts';
import GridColumnHang from './column-hang.gts';
import GridRow from './row.gts';
import type { GridBlock } from '../grid.gts';
import type { GridMode } from './-types.ts';

export interface GridSettingsSignature {
  Args: {
    /**
     * Specify the gutter mode the yielded grid components should use.
     *
     * @defaultValue 'flexbox'
     */
    mode?: GridMode;
    /**
     * Specify whether the yielded `Grid` should render as a subgrid.
     */
    subgrid?: boolean;
  };
  Blocks: {
    default: [GridBlock];
  };
}

/**
 * Renders nothing itself, but yields `Grid`, `Column`, `Row` and `ColumnHang`
 * pre-configured with the given grid mode -- the Ember equivalent of React's
 * `GridSettings` context provider.
 *
 * ```gts
 * <GridSettings @mode="css-grid" as |g|>
 *   <g.Grid>
 *     <g.Column @sm={{4}}>Column</g.Column>
 *   </g.Grid>
 * </GridSettings>
 * ```
 */
export default class GridSettings extends Component<GridSettingsSignature> {
  get mode(): GridMode {
    return this.args.mode ?? 'flexbox';
  }

  get subgrid(): boolean {
    return this.args.subgrid ?? false;
  }

  <template>
    {{yield
      (hash
        Grid=(component Grid mode=this.mode subgrid=this.subgrid)
        Column=(component GridColumn mode=this.mode)
        Row=GridRow
        ColumnHang=GridColumnHang
        mode=this.mode
      )
    }}
  </template>
}
