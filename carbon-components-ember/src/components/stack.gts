/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import style from 'ember-style-modifier';

export type StackOrientation = 'horizontal' | 'vertical';

export interface StackSignature {
  Element: HTMLElement;
  Args: {
    /**
     * The element type to render the stack as.
     */
    as?: keyof HTMLElementTagNameMap;
    /**
     * The spacing between items in the stack. Provide a number between 1
     * and 13 to use one of the steps in the spacing scale, or a string to
     * set a custom CSS gap value.
     */
    gap?: number | string;
    /**
     * The direction items are stacked in.
     */
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

  get styles() {
    return typeof this.args.gap === 'string'
      ? { '--cds-stack-gap': this.args.gap }
      : undefined;
  }

  <template>
    {{#let (element this.tag) as |Tag|}}
      <Tag class={{this.classes}} {{style this.styles}} ...attributes>
        {{yield}}
      </Tag>
    {{/let}}
  </template>
}
