import { default as set } from 'carbon-components-ember/helpers/set';
import { default as Actions } from './-actions';
import { default as Content } from './-content';
import Component from '@glimmer/component';
import TableToolbarContentComponent from 'carbon-components-ember/components/data-table/-toolbar/-content';
import TableActionsComponent from 'carbon-components-ember/components/data-table/-toolbar/-actions';
import { WithBoundArgs } from '@glint/template';
import DataTableComponent from 'carbon-components-ember/components/data-table';

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
      {{yield (hash Content=Content Actions=(component Actions table=@table))}}
    </section>
  </template>
}
