import OverflowMenu from '../overflow-menu.gts';
import type OverflowMenuItem from '../overflow-menu/overflow-menu-item.gts';
import type { WithBoundArgs } from '@glint/template';
import type { TOC } from '@ember/component/template-only';

export interface TableMenuSignature {
  Element: HTMLTableCellElement;
  Args: {
    /** Shows a skeleton in place of the menu. */
    isLoading?: boolean;
  };
  Blocks: {
    default: [OverflowMenuItem: WithBoundArgs<typeof OverflowMenuItem, 'menu'>];
  };
}

const TableMenu: TOC<TableMenuSignature> = <template>
  <td class="cds--table-column-menu" ...attributes>
    {{#if @isLoading}}
      <span></span>
    {{else}}
      <OverflowMenu @flipped={{true}} as |Item|>
        {{yield Item}}
      </OverflowMenu>
    {{/if}}
  </td>
</template>;

export default TableMenu;
