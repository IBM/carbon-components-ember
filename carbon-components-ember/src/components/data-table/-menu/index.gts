import { default as Menu } from 'carbon-components-ember/components/menu';
import Component from '@glimmer/component';
import MenuItemComponent from 'carbon-components-ember/components/menu/-item';

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
