import type { TOC } from '@ember/component/template-only';

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

const UIShellSwitcherItem: TOC<UIShellSwitcherItemSignature> = <template>
  <li class="cds--switcher__item">
    <a
      class="cds--switcher__item-link
        {{if @isSelected 'cds--switcher__item-link--selected'}}"
      href={{if @href @href "#"}}
      aria-label={{@aria-label}}
      ...attributes
    >
      {{yield}}
    </a>
  </li>
</template>;

export default UIShellSwitcherItem;
