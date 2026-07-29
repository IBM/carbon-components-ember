import Component from '@glimmer/component';
import { on } from '@ember/modifier';

export interface UIShellHeaderPanelSignature {
  Element: HTMLDivElement;
  Args: {
    expanded?: boolean;
    onToggle?: (value: boolean) => void;
  };
  Blocks: {
    default: [];
  };
}

export default class UIShellHeaderPanel extends Component<UIShellHeaderPanelSignature> {
  handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.args.onToggle?.(false);
    }
  };

  <template>
    <div
      class='cds--header-panel
        {{if @expanded "cds--header-panel--expanded"}}'
      {{on 'keydown' this.handleKeydown}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}
