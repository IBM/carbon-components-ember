import Component from '@glimmer/component';

export interface UiShellHeaderSignature {
  Args: {
    title: string;
    subtitle: string;
    open?: boolean
    onToggle?: (value: boolean) => void
  };
  Blocks: {
    header: [];
    'header-global': []
  }
}

export default class UiShellHeader extends Component<UiShellHeaderSignature> {}



