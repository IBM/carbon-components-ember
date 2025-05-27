import { default as Menu } from '../menu.gts';
import Component from '@glimmer/component';
import MenuItemComponent from '../menu/-item.gts';
import type { WithBoundArgs } from '@glint/template';

export interface TableMenuComponentSignature {
  Blocks: {
    default: [
      WithBoundArgs<typeof MenuItemComponent, 'isDisabled' | 'isDanger'>,
    ];
  };
}

export default class TableMenuComponent extends Component<TableMenuComponentSignature> {
  <template>
    <td class='cds--table-column-menu'>
      <Menu @icon='overflow-menu--vertical' @direction='top' as |Item|>
        {{yield Item}}
      </Menu>
    </td>
  </template>
}
