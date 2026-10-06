import Header from './ui-shell/-header.gts';
import Sidenav from './ui-shell/-sidenav.gts';
import Nav from './ui-shell/-nav.gts';
import Switcher from './ui-shell/-switcher.gts';
import HeaderContainer from './ui-shell/-header-container.gts';
import Component from '@glimmer/component';
import type UIShellHeader from './ui-shell/-header.gts';

export interface UIShellSignature {
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

export default class UIShell extends Component<UIShellSignature> {
  <template>
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
    <main id="main-content" class="cds--content">
      {{yield to="content"}}
    </main>
  </template>
}
