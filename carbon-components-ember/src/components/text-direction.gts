import Component from '@glimmer/component';
import type { TextDir } from './text.gts';

export interface TextDirectionSignature {
  Element: HTMLElement;
  Args: {
    as?: keyof HTMLElementTagNameMap;
    dir?: TextDir;
  };
  Blocks: {
    default: [];
  };
}

export default class TextDirection extends Component<TextDirectionSignature> {
  get tag(): keyof HTMLElementTagNameMap {
    return this.args.as ?? 'div';
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
