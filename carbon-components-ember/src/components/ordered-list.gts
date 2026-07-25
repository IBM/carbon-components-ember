import Component from '@glimmer/component';

export type Args = {
  nested?: boolean;
  native?: boolean;
  isExpressive?: boolean;
};

export interface OrderedListSignature {
  Element: HTMLOListElement;
  Args: Args;
  Blocks: {
    default: [];
  };
}

export default class OrderedList extends Component<OrderedListSignature> {
  get classes() {
    const classes = [
      this.args.native ? 'cds--list--ordered--native' : 'cds--list--ordered',
    ];
    if (this.args.nested) classes.push('cds--list--nested');
    if (this.args.isExpressive) classes.push('cds--list--expressive');
    return classes.join(' ');
  }

  <template>
    <ol class={{this.classes}} ...attributes>
      {{yield}}
    </ol>
  </template>
}
