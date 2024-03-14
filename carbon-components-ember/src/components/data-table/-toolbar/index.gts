import Component from '@glimmer/component';
import TableToolbarContentComponent from '#/components/data-table/-toolbar/-content';
import TableActionsComponent from '#/components/data-table/-toolbar/-actions';
import { WithBoundArgs } from '@glint/template';
import DataTableComponent from '#/components/data-table';
import { hash } from '@ember/helper';

export interface Signature {
  Args: {
    table: DataTableComponent<any>;
  };
  Element: null;
  Blocks: {
    default: [
      {
        Content: typeof TableToolbarContentComponent;
        Actions: WithBoundArgs<typeof TableActionsComponent, 'table'>;
      },
    ];
  };
}

export default class TableToolbarComponent extends Component<Signature> {
  <template>
    <section class='cds--table-toolbar'>
      {{yield (hash Content=TableToolbarContentComponent Actions=(component TableActionsComponent table=@table))}}
    </section>
  </template>
}
