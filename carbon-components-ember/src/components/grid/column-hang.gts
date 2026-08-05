/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { element } from 'ember-element-helper';

export interface GridColumnHangSignature {
  Element: HTMLElement;
  Args: {
    as?: keyof HTMLElementTagNameMap;
  };
  Blocks: {
    default: [];
  };
}

/**
 * Helper component for rendering content that hangs on the column. Useful when
 * trying to align content across different gutter modes.
 *
 * ```gts
 * <Grid @mode="css-grid" as |g|>
 *   <g.Column>
 *     <g.ColumnHang>Text</g.ColumnHang>
 *   </g.Column>
 * </Grid>
 * ```
 */
export default class GridColumnHang extends Component<GridColumnHangSignature> {
  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'div';
  }

  <template>
    {{#let (element this.tag) as |Tag|}}
      <Tag class='cds--grid-column-hang' ...attributes>
        {{yield}}
      </Tag>
    {{/let}}
  </template>
}
