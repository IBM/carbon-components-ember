import type Icon from '../../../components/icon.gts';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import SubMenuComponent from './-sub-menu.gts';
import { ChevronDown } from '../../../icons.ts';

export type SubMenu = {
  icon: typeof Icon;
  title: string;
};

export interface UIShellSideNavMenuSignature {
  Args: {
    transitionTo: () => void;
    hidden?: boolean;
    open?: boolean;
    isCurrent: boolean;
    icon: typeof Icon;
    title: string;
    submenus: SubMenu[];
  };
  Blocks: {
    default: [typeof SubMenuComponent];
  };
}

export default class UIShellSideNavMenu extends Component<UIShellSideNavMenuSignature> {
  @tracked expanded = false;

  toggleExpanded = () => {
    this.expanded = !this.expanded;
  };

  <template>
    {{#if @submenus}}
      <li class="cds--side-nav__item {{if @icon 'cds--side-nav__item--icon'}}">
        <button
          class="cds--side-nav__submenu"
          aria-haspopup="true"
          aria-expanded="{{or @open this.expanded}}"
          type="button"
          {{on "click" this.toggleExpanded}}
        >
          {{#if @icon}}
            <div class="cds--side-nav__icon">
              <this.args.icon />
            </div>
          {{/if}}
          <span class="cds--side-nav__submenu-title">
            {{@title}}
          </span>
          <div
            class="cds--side-nav__icon cds--side-nav__icon--small cds--side-nav__submenu-chevron"
          >
            <ChevronDown />
          </div>
        </button>
        {{#if (or @open this.expanded)}}
          <ul class="cds--side-nav__menu">
            {{yield SubMenuComponent}}
          </ul>
        {{/if}}
      </li>
    {{else}}
      {{#unless @hidden}}
        <li class="cds--side-nav__item">
          <a
            href="#"
            class="cds--side-nav__link"
            aria-current="{{if @isCurrent 'page'}}"
            role="button"
            {{on "click" @transitionTo}}
          >
            {{#if @icon}}
              <div class="cds--side-nav__icon cds--side-nav__icon--small">
                <this.args.icon />
              </div>
            {{/if}}
            <span class="cds--side-nav__link-text">
              {{@title}}
            </span>
          </a>
        </li>
      {{/unless}}
    {{/if}}
  </template>
}
