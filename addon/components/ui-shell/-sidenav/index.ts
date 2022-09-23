import Component from '@glimmer/component';

export interface UiShellNavSignature {
  Yields: {
    shell: [{Header, Sidenav, Nav}];
    content: [];
  };
}

export default class UiShellNav extends Component<UiShellNavSignature> {}



