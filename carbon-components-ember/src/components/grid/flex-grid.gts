/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Grid from '../grid.gts';

import type { GridAlign, GridSignature } from '../grid.gts';
import type { TOC } from '@ember/component/template-only';

export interface FlexGridSignature {
  Element: GridSignature['Element'];
  Args: {
    as?: keyof HTMLElementTagNameMap;
    /**
     * Taken for parity with Carbon React; alignment only applies to the CSS
     * Grid, so it has no effect here.
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
     * Container hangs 16px into the gutter. Useful for
     * typographic alignment with and without containers.
     */
    narrow?: boolean;
    /**
     * Add a row gap to the grid that matches the current gutter size.
     */
    withRowGap?: boolean;
  };
  Blocks: GridSignature['Blocks'];
}

/**
 * A `Grid` that always renders Carbon's Flexbox grid: rows of columns.
 */
const FlexGrid: TOC<FlexGridSignature> = <template>
  <Grid
    @mode="flexbox"
    @as={{@as}}
    @align={{@align}}
    @condensed={{@condensed}}
    @fullWidth={{@fullWidth}}
    @narrow={{@narrow}}
    @withRowGap={{@withRowGap}}
    ...attributes
    as |grid|
  >
    {{yield grid}}
  </Grid>
</template>;

export default FlexGrid;
