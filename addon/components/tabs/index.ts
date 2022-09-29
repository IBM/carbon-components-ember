import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

type Tab = {
  title: string;
}

type Args = {
  tabs: Tab[];
  selectedTab: Tab;
  tabSelected: (tab: Tab) => void
}

export interface TabsComponentSignature {
  Args: Args;
  Element: HTMLDivElement;
}

export default class TabsComponent extends Component<TabsComponentSignature> {
  @tracked open: boolean
}
