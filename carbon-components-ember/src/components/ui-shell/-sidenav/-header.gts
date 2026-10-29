import UIShellSideNavIcon from './-icon.gts';
import type { IconComponent } from '../../icon.gts';
import type { TOC } from '@ember/component/template-only';

export interface UIShellSideNavHeaderSignature {
  Element: HTMLElement;
  Args: {
    icon: IconComponent;
  };
  Blocks: {
    default: [];
  };
}

const UIShellSideNavHeader: TOC<UIShellSideNavHeaderSignature> = <template>
  {{! Yielded into the side nav's list, so it sits in a list item. }}
  <li>
    <header class="cds--side-nav__header" ...attributes>
      <UIShellSideNavIcon>
        <@icon />
      </UIShellSideNavIcon>
      {{yield}}
    </header>
  </li>
</template>;

export default UIShellSideNavHeader;
