import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';

type Tab = {
  title: string;
  disabled?: boolean;
}

type Args = {
  tabs: Tab[];
  selectedTab: Tab;
  tabSelected: (tab: Tab) => void;
}

export interface TabsComponentSignature {
  Args: Args;
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

export default class TabsComponent extends Component<TabsComponentSignature> {
  @tracked open: boolean

  get guid() {
    return guidFor(this);
  }

  get currentIndex() {
    return (this.args.tabs || []).indexOf(this.args.selectedTab);
  }
}
