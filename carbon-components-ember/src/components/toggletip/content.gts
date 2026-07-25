import Component from '@glimmer/component';

export interface ToggletipContentComponentSignature {
  Args: {
    id: string;
  };
  Element: HTMLSpanElement;
  Blocks: {
    default: [];
  };
}

/**
 * Renders the popover content of a `Toggletip`. Yielded by `Toggletip` as
 * `t.Content`.
 */
export default class ToggletipContentComponent extends Component<ToggletipContentComponentSignature> {
  <template>
    <span class='cds--popover'>
      <span id={{@id}} class='cds--popover-content' ...attributes>
        <div class='cds--toggletip-content'>
          {{yield}}
        </div>
      </span>
      <span class='cds--popover-caret'></span>
    </span>
  </template>
}
