import Component from '@glimmer/component';

declare type Args = {
  onSelectionChange: () => null,
  onStateChanged: () => null,
  search: string,
  state: object,
  items: any[]
};

declare class ListComponent extends Component<Args> {

}
export default ListComponent;
