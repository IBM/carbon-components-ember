import type { TOC } from '@ember/component/template-only';

export interface UIShellSwitcherDividerSignature {
  Element: HTMLHRElement;
}

const UIShellSwitcherDivider: TOC<UIShellSwitcherDividerSignature> = <template>
  <li>
    <hr ...attributes class="cds--switcher__item--divider" />
  </li>
</template>;

export default UIShellSwitcherDivider;
