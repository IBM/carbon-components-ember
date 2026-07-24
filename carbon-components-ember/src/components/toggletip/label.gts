import Component from '@glimmer/component';

export interface ToggletipLabelComponentSignature {
  Element: HTMLSpanElement;
  Blocks: {
    default: [];
  };
}

/**
 * Used to render the label for a `Toggletip`.
 */
export default class ToggletipLabelComponent extends Component<ToggletipLabelComponentSignature> {
  <template>
    <span class='cds--toggletip-label' ...attributes>
      {{yield}}
    </span>
  </template>
}
