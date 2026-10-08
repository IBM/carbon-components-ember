import Header from './ui-shell/-header.gts';
import Sidenav from './ui-shell/-sidenav.gts';
import Nav from './ui-shell/-nav.gts';
import Switcher from './ui-shell/-switcher.gts';
import HeaderContainer from './ui-shell/-header-container.gts';
import type UIShellHeader from './ui-shell/-header.gts';
import type { TOC } from '@ember/component/template-only';

export interface UIShellSignature {
  Element: HTMLElement;
  Blocks: {
    shell: [
      {
        Header: typeof UIShellHeader;
        Sidenav: typeof Sidenav;
        Nav: typeof Nav;
        Switcher: typeof Switcher;
        HeaderContainer: typeof HeaderContainer;
      },
    ];
    content: [];
  };
}

const UIShell: TOC<UIShellSignature> = <template>
  {{yield
    (hash
      Header=Header
      Sidenav=Sidenav
      Nav=Nav
      Switcher=Switcher
      HeaderContainer=HeaderContainer
    )
    to="shell"
  }}
  <main id="main-content" class="cds--content" ...attributes>
    {{yield to="content"}}
  </main>
</template>;

export default UIShell;
