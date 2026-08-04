import Component from '@glimmer/component';

export interface UIShellSideNavIconSignature {
  Element: HTMLDivElement;
  Args: {
    small?: boolean;
  };
  Blocks: {
    default: [];
  };
}

export default class UIShellSideNavIcon extends Component<UIShellSideNavIconSignature> {
  <template>
    <div
      class='cds--side-nav__icon {{if @small "cds--side-nav__icon--small"}}'
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}
