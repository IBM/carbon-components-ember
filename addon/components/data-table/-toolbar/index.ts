import Component from '@glimmer/component';
import TableToolbarContentComponent from 'carbon-components-ember/components/data-table/-toolbar/-content';
import TableActionsComponent from 'carbon-components-ember/components/data-table/-toolbar/-actions';
import { WithBoundArgs } from '@glint/template';
import DataTableComponent from 'carbon-components-ember/components/data-table';

export interface Signature {
  Args: {
    table: typeof DataTableComponent
  },
  Element: null,
  Blocks: {
    default: [{
      Content: typeof TableToolbarContentComponent,
      Actions: WithBoundArgs<typeof TableActionsComponent, 'table'>
    }]
  }
}

export default class TableToolbarComponent extends Component<Signature> {}



