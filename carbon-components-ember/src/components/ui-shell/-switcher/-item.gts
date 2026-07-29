import Component from '@glimmer/component';

export interface UIShellSwitcherItemSignature {
  Element: HTMLAnchorElement;
  Args: {
    'aria-label'?: string;
    isSelected?: boolean;
    href?: string;
  };
  Blocks: {
    default: [];
  };
}

export default class UIShellSwitcherItem extends Component<UIShellSwitcherItemSignature> {
  <template>
    <li class='cds--switcher__item'>
      <a
        class='cds--switcher__item-link
          {{if @isSelected "cds--switcher__item-link--selected"}}'
        href={{if @href @href '#'}}
        aria-label={{@aria-label}}
        ...attributes
      >
        {{yield}}
      </a>
    </li>
  </template>
}
