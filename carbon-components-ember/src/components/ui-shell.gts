import { default as Header } from './ui-shell/-header.gts';
import { default as Sidenav } from './ui-shell/-sidenav.gts';
import { default as Nav } from './ui-shell/-nav.gts';
import Component from '@glimmer/component';
import UiShellHeader from './ui-shell/-header.gts';
import { hash } from '@ember/helper';

export interface UiShellSignature {
  Blocks: {
    shell: [
      {
        Header: typeof UiShellHeader;
        Sidenav: typeof Sidenav;
        Nav: typeof Nav;
      },
    ];
    content: [];
  };
}

export default class UiShell extends Component<UiShellSignature> {
  <template>
    {{yield (hash Header=Header Sidenav=Sidenav Nav=Nav) to='shell'}}
    <main id='main-content' class='cds--content'>
      {{yield to='content'}}
    </main>
  </template>
}
