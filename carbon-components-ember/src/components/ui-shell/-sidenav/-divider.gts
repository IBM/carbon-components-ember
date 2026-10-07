import type { TOC } from '@ember/component/template-only';

export interface Signature {
  Element: HTMLLIElement;
}

const UIShellSideNavDivider: TOC<Signature> = <template>
  <li class="cds--side-nav__divider" ...attributes></li>
</template>;

export default UIShellSideNavDivider;
