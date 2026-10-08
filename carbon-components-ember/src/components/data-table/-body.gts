import ListRow from './-row.gts';
import Component from '@glimmer/component';
import type DataTableComponent from '../../components/data-table.gts';
import type { WithBoundArgs } from '@glint/template';
import type DataTableRow from '../../components/data-table/-row.gts';

export interface DataTableBodySignature<T> {
  Element: HTMLTableSectionElement;
  Args: {
    isExpandable: boolean;
    isCheckable: boolean;
    table: DataTableComponent<T>;
    items: T[];
  };
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
    <tbody ...attributes>
      {{#each @items as |item|}}
        {{#let
          (component
            ListRow
            isExpandable=@isExpandable
            isCheckable=@isCheckable
            table=@table
            item=item
          )
          as |Row|
        }}
          {{yield (hash Row=Row item=item)}}
        {{/let}}
      {{/each}}
    </tbody>
  </template>
}
