import Component from '@glimmer/component';

export type Args = {
  nested?: boolean;
  isExpressive?: boolean;
};

export interface UnorderedListSignature {
  Element: HTMLUListElement;
  Args: Args;
  Blocks: {
    default: [];
  };
}

export default class UnorderedList extends Component<UnorderedListSignature> {
  get classes() {
    const classes = ['cds--list--unordered'];
    if (this.args.nested) classes.push('cds--list--nested');
    if (this.args.isExpressive) classes.push('cds--list--expressive');
    return classes.join(' ');
  }

  <template>
    <ul class={{this.classes}} ...attributes>
      {{yield}}
    </ul>
  </template>
}
