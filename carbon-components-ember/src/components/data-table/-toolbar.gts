import TableToolbarContentComponent from '../data-table/-toolbar/-content.gts';
import TableActionsComponent from '../data-table/-toolbar/-actions.gts';
import type { WithBoundArgs } from '@glint/template';
import type { DataTableContext } from '../data-table.gts';
import { concat } from '@ember/helper';
import type { TOC } from '@ember/component/template-only';

export interface Signature {
  Args: {
    table: DataTableContext;
    size?: 'xs' | 'sm' | 'lg';
    ariaLabel?: string;
  };
  Blocks: {
    default: [
      {
        Content: typeof TableToolbarContentComponent;
        Actions: WithBoundArgs<typeof TableActionsComponent, 'table'>;
      },
    ];
  };
}

const TableToolbarComponent: TOC<Signature> = <template>
  <section
    class="cds--table-toolbar
      {{if @size (concat 'cds--table-toolbar--' @size)}}"
    role="group"
    aria-label={{or @ariaLabel "data table toolbar"}}
  >
    {{yield
      (hash
        Content=TableToolbarContentComponent
        Actions=(component TableActionsComponent table=@table)
      )
    }}
  </section>
</template>;

export default TableToolbarComponent;
