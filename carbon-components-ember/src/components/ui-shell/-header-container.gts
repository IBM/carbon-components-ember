import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';
import { hash } from '@ember/helper';

export interface UIShellHeaderContainerSignature {
  Args: {
    isSideNavExpanded?: boolean;
  };
  Blocks: {
    default: [
      {
        isSideNavExpanded: boolean;
        onClickSideNavExpand: () => void;
      },
    ];
  };
}

export default class UIShellHeaderContainer extends Component<UIShellHeaderContainerSignature> {
  @tracked isSideNavExpanded = this.args.isSideNavExpanded ?? false;

  constructor(owner: any, args: UIShellHeaderContainerSignature['Args']) {
    super(owner, args);
    window.addEventListener('keydown', this.handleWindowKeydown);
    registerDestructor(this, () => {
      window.removeEventListener('keydown', this.handleWindowKeydown);
    });
  }

  handleWindowKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.isSideNavExpanded = false;
    }
  };

  onClickSideNavExpand = () => {
    this.isSideNavExpanded = !this.isSideNavExpanded;
  };

  <template>
    {{yield
      (hash
        isSideNavExpanded=this.isSideNavExpanded
        onClickSideNavExpand=this.onClickSideNavExpand
      )
    }}
  </template>
}
