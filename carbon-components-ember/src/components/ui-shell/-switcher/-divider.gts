import Component from '@glimmer/component';

export interface UIShellSwitcherDividerSignature {
  Element: HTMLLIElement;
}

export default class UIShellSwitcherDivider extends Component<UIShellSwitcherDividerSignature> {
  <template>
    <li ...attributes>
      <hr class='cds--switcher__item--divider' />
    </li>
  </template>
}
