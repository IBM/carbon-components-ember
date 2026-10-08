import Component from '@glimmer/component';
import ListItem from './list-item.gts';

export interface UnorderedListSignature {
  Element: HTMLUListElement;
  Args: {
    nested?: boolean;
    isExpressive?: boolean;
  };
  Blocks: {
    default: [typeof ListItem];
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
      {{yield ListItem}}
    </ul>
  </template>
}
