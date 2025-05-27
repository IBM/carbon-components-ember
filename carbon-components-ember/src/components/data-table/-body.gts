import { default as ListRow } from './-row.gts';
import Component from '@glimmer/component';
import DataTableComponent from '../../components/data-table.gts';
import { type WithBoundArgs } from '@glint/template';
import DataTableRow from '../../components/data-table/-row.gts';
import { hash } from '@ember/helper';

type Args<T> = {
  isExpandable: boolean;
  isCheckable: boolean;
  table: DataTableComponent<T>;
  items: T[];
};

export interface DataTableBodySignature<T> {
  Args: Args<T>;
  Blocks: {
    default: [
      {
        Row: WithBoundArgs<
          typeof DataTableRow<T>,
          'table' | 'isCheckable' | 'item' | 'isExpandable'
        >;
        item: T;
      },
    ];
  };
}

export default class DataTableBody<T> extends Component<
  DataTableBodySignature<T>
> {
  <template>
    <tbody>
      {{#each @items as |item|}}
        {{! @glint-expect-error }}
        {{yield (hash Row=(component
              ListRow
              isExpandable=@isExpandable
              isCheckable=@isCheckable
              table=@table
              item=item
            )
            item=item
          )
        }}
      {{/each}}
    </tbody>
  </template>
}
