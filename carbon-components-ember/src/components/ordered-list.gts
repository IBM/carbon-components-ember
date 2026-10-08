import Component from '@glimmer/component';
import ListItem from './list-item.gts';

export interface OrderedListSignature {
  Element: HTMLOListElement;
  Args: {
    nested?: boolean;
    native?: boolean;
    isExpressive?: boolean;
  };
  Blocks: {
    default: [typeof ListItem];
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
      {{yield ListItem}}
    </ol>
  </template>
}
