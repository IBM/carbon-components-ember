import Component from '@glimmer/component';
import TableToolbarContentComponent from '../data-table/-toolbar/-content.gts';
import TableActionsComponent from '../data-table/-toolbar/-actions.gts';
import type { WithBoundArgs } from '@glint/template';
import DataTableComponent from '../data-table.gts';
import { concat, hash } from '@ember/helper';
import { default as defaultTo } from '../../helpers/default-to.ts';

export interface Signature {
  Args: {
    table: DataTableComponent<any>;
    size?: 'xs' | 'sm' | 'lg';
    ariaLabel?: string;
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
    <section
      class='cds--table-toolbar
        {{if @size (concat "cds--table-toolbar--" @size)}}'
      role='group'
      aria-label={{defaultTo @ariaLabel 'data table toolbar'}}
    >
      {{yield
        (hash
          Content=TableToolbarContentComponent
          Actions=(component TableActionsComponent table=@table)
        )
      }}
    </section>
  </template>
}
