import Component from '@glimmer/component';

export interface UIShellSideNavDetailsSignature {
  Element: HTMLDivElement;
  Args: {
    title: string;
  };
  Blocks: {
    default: [];
  };
}

export default class UIShellSideNavDetails extends Component<UIShellSideNavDetailsSignature> {
  <template>
    <div class='cds--side-nav__details' ...attributes>
      <h2 class='cds--side-nav__title' title={{@title}}>
        {{@title}}
      </h2>
      {{yield}}
    </div>
  </template>
}
