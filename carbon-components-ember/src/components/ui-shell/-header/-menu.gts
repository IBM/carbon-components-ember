import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { ChevronDown } from '../../../icons.ts';
import UIShellHeaderMenuItem from './-menu-item.gts';

export interface UIShellHeaderMenuSignature {
  Element: HTMLLIElement;
  Args: {
    'aria-label'?: string;
    'aria-labelledby'?: string;
    menuLinkName: string;
    isActive?: boolean;
  };
  Blocks: {
    default: [typeof UIShellHeaderMenuItem];
  };
}

export default class UIShellHeaderMenu extends Component<UIShellHeaderMenuSignature> {
  @tracked expanded = false;

  toggleExpanded = () => {
    this.expanded = !this.expanded;
  };

  <template>
    <li
      class='cds--header__submenu
        {{if @isActive "cds--header__menu-item--current"}}'
      ...attributes
    >
      {{! template-lint-disable no-unsupported-role-attributes }}
      <a
        aria-haspopup='menu'
        aria-expanded='{{if this.expanded "true" "false"}}'
        aria-label={{@aria-label}}
        aria-labelledby={{@aria-labelledby}}
        class='cds--header__menu-item cds--header__menu-title'
        href='#'
        tabindex='0'
        {{on 'click' this.toggleExpanded}}
      >
        {{@menuLinkName}}
        <ChevronDown @svgClass='cds--header__menu-arrow' />
      </a>
      <ul
        aria-label={{@aria-label}}
        aria-labelledby={{@aria-labelledby}}
        class='cds--header__menu'
      >
        {{yield UIShellHeaderMenuItem}}
      </ul>
    </li>
  </template>
}
