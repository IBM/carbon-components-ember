/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Button from '../button.gts';
import Text from '../text.gts';
import TableActionList from './table-action-list.gts';

export type TableBatchActionsTranslationId =
  | 'carbon.table.batch.cancel'
  | 'carbon.table.batch.items.selected'
  | 'carbon.table.batch.item.selected'
  | 'carbon.table.batch.selectAll';

export interface TableBatchActionsTranslationArgs {
  totalSelected?: number;
  totalCount?: number;
}

export interface TableBatchActionsSignature {
  Element: HTMLDivElement;
  Args: {
    /** Called when Cancel is pressed. */
    onCancel: (event: MouseEvent) => void;
    /** Shows a "Select all" button, and is called when it is pressed. */
    onSelectAll?: (event: MouseEvent) => void;
    /** Shows the bar. */
    shouldShowBatchActions?: boolean;
    /** The number of items in the table, for "Select all". */
    totalCount?: number;
    /** The number of selected items. */
    totalSelected: number;
    /** Returns the text for each message. */
    translateWithId?: (
      id: TableBatchActionsTranslationId,
      args?: TableBatchActionsTranslationArgs,
    ) => string;
  };
  Blocks: {
    /** The actions: `TableBatchAction`s. */
    default: [];
  };
}

const defaultTranslations = {
  'carbon.table.batch.cancel': 'Cancel',
  'carbon.table.batch.items.selected': 'items selected',
  'carbon.table.batch.item.selected': 'item selected',
  'carbon.table.batch.selectAll': 'Select all',
};

const defaultTranslateWithId = (
  id: TableBatchActionsTranslationId,
  { totalSelected = 0, totalCount = 0 }: TableBatchActionsTranslationArgs = {},
) => {
  switch (id) {
    case 'carbon.table.batch.selectAll':
      return `${defaultTranslations[id]} (${totalCount})`;
    case 'carbon.table.batch.cancel':
      return defaultTranslations[id];
    default:
      return `${totalSelected} ${defaultTranslations[id]}`;
  }
};

/**
 * The bar that replaces a table's toolbar while rows are selected, as Carbon
 * React's `TableBatchActions`: how many are selected, "Select all", the
 * actions you give it, and Cancel.
 */
export default class TableBatchActions extends Component<TableBatchActionsSignature> {
  @tracked isScrolling = false;

  toggleScrolling = () => {
    this.isScrolling = !this.isScrolling;
  };

  get tabindex() {
    return this.args.shouldShowBatchActions ? '0' : '-1';
  }

  private t(id: TableBatchActionsTranslationId) {
    const { totalSelected, totalCount } = this.args;
    return (this.args.translateWithId ?? defaultTranslateWithId)(id, {
      totalSelected,
      totalCount,
    });
  }

  get summary() {
    const { totalSelected } = this.args;
    return this.t(
      totalSelected > 1 || totalSelected === 0
        ? 'carbon.table.batch.items.selected'
        : 'carbon.table.batch.item.selected',
    );
  }

  get selectAll() {
    return this.t('carbon.table.batch.selectAll');
  }

  get cancel() {
    return this.t('carbon.table.batch.cancel');
  }

  <template>
    <div
      aria-hidden={{if @shouldShowBatchActions "false" "true"}}
      class="cds--batch-actions
        {{if @shouldShowBatchActions 'cds--batch-actions--active'}}"
      {{on "scroll" this.toggleScrolling}}
      ...attributes
    >
      <div
        class="cds--batch-summary
          {{if this.isScrolling 'cds--batch-summary__scroll'}}"
      >
        <p class="cds--batch-summary__para"><Text>{{this.summary}}</Text></p>
        {{#if @onSelectAll}}
          <span class="cds--batch-summary__divider">|</span>
          <Button tabindex={{this.tabindex}} {{on "click" @onSelectAll}}>
            {{this.selectAll}}
          </Button>
        {{/if}}
      </div>
      <TableActionList>
        {{yield}}
        <Button
          class="cds--batch-summary__cancel"
          tabindex={{this.tabindex}}
          {{on "click" @onCancel}}
        >
          {{this.cancel}}
        </Button>
      </TableActionList>
    </div>
  </template>
}
