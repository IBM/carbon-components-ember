/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { hash } from '@ember/helper';
import type { WithBoundArgs } from '@glint/template';
import Head from './structured-list/-head.gts';
import Body from './structured-list/-body.gts';
import Row from './structured-list/-row.gts';
import Cell from './structured-list/-cell.gts';

export interface StructuredListSignature {
  Element: HTMLDivElement;
  Args: {
    selection?: boolean;
    isCondensed?: boolean;
    isFlush?: boolean;
    selectedInitialRow?: string;
    ariaLabel?: string;
  };
  Blocks: {
    default: [
      {
        Head: typeof Head;
        Body: typeof Body;
        Row: WithBoundArgs<typeof Row, 'wrapper'>;
        Cell: typeof Cell;
      },
    ];
  };
}

/**
 * StructuredList presents information in a structured format, arranging
 * content into rows and columns.
 *
 * ```gjs
 * <StructuredList as |SL|>
 *   <SL.Head>
 *     <SL.Row @head={{true}}>
 *       <SL.Cell @head={{true}}>Column A</SL.Cell>
 *     </SL.Row>
 *   </SL.Head>
 *   <SL.Body>
 *     <SL.Row>
 *       <SL.Cell>Row 1</SL.Cell>
 *     </SL.Row>
 *   </SL.Body>
 * </StructuredList>
 * ```
 */
export default class StructuredList extends Component<StructuredListSignature> {
  @tracked selectedRow: string | null = this.args.selectedInitialRow ?? null;

  get ariaLabel() {
    return this.args.ariaLabel ?? 'Structured list section';
  }

  get isFlush() {
    return this.args.isFlush && !this.args.selection;
  }

  @action
  setSelectedRow(id: string) {
    this.selectedRow = id;
  }

  <template>
    <div
      role='table'
      aria-label={{this.ariaLabel}}
      class='cds--structured-list
        {{if @selection "cds--structured-list--selection"}}
        {{if @isCondensed "cds--structured-list--condensed"}}
        {{if this.isFlush "cds--structured-list--flush"}}'
      ...attributes
    >
      {{yield
        (hash
          Head=Head Body=Body Row=(component Row wrapper=this) Cell=Cell
        )
      }}
    </div>
  </template>
}
