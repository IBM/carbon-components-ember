import { default as Header } from './-header';
import { default as Sidenav } from './-sidenav';
import { default as Nav } from './-nav';
import Component from '@glimmer/component';
import UiShellHeader from './-header';

export interface UiShellSignature {
  Blocks: {
    shell: [{ Header: typeof UiShellHeader; Sidenav; Nav }];
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
