import Component from '@glimmer/component';
import MenuItemComponent from 'carbon-components-ember/components/menu/-item';

export interface TableMenuComponentSignature {
  Blocks: {
    default: [typeof MenuItemComponent];
  };
}

export default class TableMenuComponent extends Component<TableMenuComponentSignature> {

}
