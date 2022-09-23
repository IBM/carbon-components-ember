import Component from '@glimmer/component';
import UiShellHeader from 'carbon-components-ember/components/ui-shell/-header';



export interface UiShellSignature {
  Yields: {
    shell: [{Header: UiShellHeader, Sidenav, Nav}];
    content: [];
  };
}

export default class UiShell extends Component<UiShellSignature> {}



