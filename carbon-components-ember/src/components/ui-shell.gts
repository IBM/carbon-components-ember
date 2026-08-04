import { default as Header } from './ui-shell/-header.gts';
import { default as Sidenav } from './ui-shell/-sidenav.gts';
import { default as Nav } from './ui-shell/-nav.gts';
import { default as Switcher } from './ui-shell/-switcher.gts';
import { default as HeaderContainer } from './ui-shell/-header-container.gts';
import Component from '@glimmer/component';
import UIShellHeader from './ui-shell/-header.gts';
import { hash } from '@ember/helper';

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
      to='shell'
    }}
    <main id='main-content' class='cds--content'>
      {{yield to='content'}}
    </main>
  </template>
}
