import Component from '@glimmer/component';

export interface Signature {
  Element: HTMLLIElement;
}

export default class UIShellSideNavDivider extends Component<Signature> {
  <template>
    <li class='cds--side-nav__divider' ...attributes></li>
  </template>
}
