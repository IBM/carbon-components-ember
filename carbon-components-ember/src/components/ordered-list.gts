import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

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

  // Carbon's counter-based numbering and nested-item spacing only apply to
  // `<li>` elements carrying `cds--list__item`. Consumers author plain `<li>`
  // tags, so add the class to the direct children ourselves, keeping it in
  // sync if items are added or removed later.
  addItemClass = modifier((element: HTMLOListElement) => {
    const apply = () => {
      for (const child of element.children) {
        if (child.tagName === 'LI') {
          child.classList.add('cds--list__item');
        }
      }
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(element, { childList: true });
    return () => observer.disconnect();
  });

  <template>
    <ol class={{this.classes}} {{this.addItemClass}} ...attributes>
      {{yield}}
    </ol>
  </template>
}
