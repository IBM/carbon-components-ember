import type { TOC } from '@ember/component/template-only';

export interface UIShellSideNavIconSignature {
  Element: HTMLDivElement;
  Args: {
    small?: boolean;
  };
  Blocks: {
    default: [];
  };
}

const UIShellSideNavIcon: TOC<UIShellSideNavIconSignature> = <template>
  <div
    class="cds--side-nav__icon {{if @small 'cds--side-nav__icon--small'}}"
    ...attributes
  >
    {{yield}}
  </div>
</template>;

export default UIShellSideNavIcon;
