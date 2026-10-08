import type { TOC } from '@ember/component/template-only';

export interface UIShellSideNavDividerSignature {
  Element: HTMLLIElement;
}

const UIShellSideNavDivider: TOC<UIShellSideNavDividerSignature> = <template>
  <li class="cds--side-nav__divider" ...attributes></li>
</template>;

export default UIShellSideNavDivider;
