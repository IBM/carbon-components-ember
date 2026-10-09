import type Icon from '../../icon.gts';
import type { TOC } from '@ember/component/template-only';

export interface UIShellSideNavSubMenuSignature {
  Element: HTMLAnchorElement;
  Args: {
    isCurrent: boolean;
    transitionTo: () => void;
    icon?: typeof Icon;
    title: string;
  };
}

const UIShellSideNavSubMenu: TOC<UIShellSideNavSubMenuSignature> = <template>
  <li class="cds--side-nav__menu-item">
    <a
      href="#"
      aria-current="{{if @isCurrent 'page'}}"
      class="cds--side-nav__link"
      {{on "click" @transitionTo}}
      ...attributes
    >
      {{#if @icon}}
        <div class="cds--side-nav__icon">
          <@icon />
        </div>
      {{/if}}
      <span class="cds--side-nav__link-text">
        {{@title}}
      </span>
    </a>
  </li>
</template>;

export default UIShellSideNavSubMenu;
