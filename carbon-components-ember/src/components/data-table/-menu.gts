import OverflowMenu from '../overflow-menu.gts';
import type OverflowMenuItem from '../overflow-menu/overflow-menu-item.gts';
import type { WithBoundArgs } from '@glint/template';
import type { TOC } from '@ember/component/template-only';

export interface TableMenuSignature {
  Element: HTMLTableCellElement;
  Blocks: {
    default: [OverflowMenuItem: WithBoundArgs<typeof OverflowMenuItem, 'menu'>];
  };
}

const TableMenu: TOC<TableMenuSignature> = <template>
  <td class="cds--table-column-menu" ...attributes>
    <OverflowMenu @flipped={{true}} as |Item|>
      {{yield Item}}
    </OverflowMenu>
  </td>
</template>;

export default TableMenu;
