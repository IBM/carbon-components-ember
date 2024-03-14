import { default as Menu } from '#∼/components/menu.gts'
import Component from '@glimmer/component';
import MenuItemComponent from '#∼/components/menu/-item.gts'

export interface TableMenuComponentSignature {
  Blocks: {
    default: [typeof MenuItemComponent];
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
