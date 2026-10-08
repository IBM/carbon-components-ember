import OverflowMenu from '../overflow-menu.gts';
import type MenuItemComponent from '../overflow-menu/item.gts';
import type { WithBoundArgs } from '@glint/template';
import { OverflowMenuVertical } from '../../icons.ts';
import type { TOC } from '@ember/component/template-only';

export interface TableMenuSignature {
  Blocks: {
    default: [WithBoundArgs<typeof MenuItemComponent, 'disabled' | 'isDelete'>];
  };
}

const TableMenu: TOC<TableMenuSignature> = <template>
  <td class="cds--table-column-menu">
    <OverflowMenu @icon={{OverflowMenuVertical}} @direction="top" as |Item|>
      {{yield Item}}
    </OverflowMenu>
  </td>
</template>;

export default TableMenu;
