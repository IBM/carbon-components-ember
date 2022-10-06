import Component from '@glimmer/component';
import UiShellHeader from './-header';



export interface UiShellSignature {
  Blocks: {
    shell: [{Header: typeof UiShellHeader; Sidenav; Nav}];
    content: [];
  };
}

export default class UiShell extends Component<UiShellSignature> {}



