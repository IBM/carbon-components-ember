import Component from '@glimmer/component';
import { element } from 'ember-element-helper';
import { htmlSafe } from '@ember/template';

export type StackOrientation = 'horizontal' | 'vertical';

export interface StackSignature {
  Element: HTMLElement;
  Args: {
    as?: keyof HTMLElementTagNameMap;
    gap?: number | string;
    orientation?: StackOrientation;
  };
  Blocks: {
    default: [];
  };
}

export default class Stack extends Component<StackSignature> {
  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'div';
  }

  get orientation(): StackOrientation {
    return this.args.orientation ?? 'vertical';
  }

  get classes() {
    const classes = [`cds--stack-${this.orientation}`];
    if (typeof this.args.gap === 'number') {
      classes.push(`cds--stack-scale-${this.args.gap}`);
    }
    return classes.join(' ');
  }

  get style() {
    if (typeof this.args.gap === 'string') {
      return htmlSafe(`--cds-stack-gap: ${this.args.gap};`);
    }
    return undefined;
  }

  <template>
    {{#let (element this.tag) as |Tag|}}
      <Tag class={{this.classes}} style={{this.style}} ...attributes>
        {{yield}}
      </Tag>
    {{/let}}
  </template>
}
