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

// DataTableSkeleton's defaults, for a table loading before it has items.
const PLACEHOLDER_ROWS = 5;
const PLACEHOLDER_COLUMNS = 5;

export default class DataTableBody<T> extends Component<
  DataTableBodySignature<T>
> {
  // Drawn here, as DataTableSkeleton does, so the app's block never gets a
  // made-up item.
  get placeholderRows() {
    const { table } = this.args;
    if (!table.isLoading || table.args.items?.length) return undefined;
    return Array.from({ length: PLACEHOLDER_ROWS });
  }

  get placeholderColumns() {
    const headers = this.args.table.headers as unknown[] | undefined;
    return Array.from({ length: headers?.length || PLACEHOLDER_COLUMNS });
  }

  <template>
    <tbody ...attributes>
      {{#each this.placeholderRows}}
        <tr>
          {{#if @isExpandable}}
            <td class="cds--table-expand"></td>
          {{/if}}
          {{#if @isCheckable}}
            <td class="cds--table-column-checkbox"></td>
          {{/if}}
          {{#each this.placeholderColumns}}
            <td><span></span></td>
          {{/each}}
        </tr>
      {{else}}
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
      {{/each}}
    </tbody>
  </template>
}
