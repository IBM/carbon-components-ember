import type { TOC } from '@ember/component/template-only';

export interface UIShellSwitcherDividerSignature {
  Element: HTMLLIElement;
}

const UIShellSwitcherDivider: TOC<UIShellSwitcherDividerSignature> = <template>
  <li ...attributes>
    <hr class="cds--switcher__item--divider" />
  </li>
</template>;

export default UIShellSwitcherDivider;
