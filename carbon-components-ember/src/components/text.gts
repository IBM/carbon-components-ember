import Component from '@glimmer/component';
import { element } from 'ember-element-helper';

export type TextDir = 'ltr' | 'rtl' | 'auto';

export interface TextSignature {
  Element: HTMLElement;
  Args: {
    as?: keyof HTMLElementTagNameMap;
    dir?: TextDir;
  };
  Blocks: {
    default: [];
  };
}

export default class Text extends Component<TextSignature> {
  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'span';
  }

  get dir() {
    return this.args.dir ?? 'auto';
  }

  <template>
    {{#let (element this.tag) as |Tag|}}
      <Tag dir={{this.dir}} ...attributes>
        {{yield}}
      </Tag>
    {{/let}}
  </template>
}
