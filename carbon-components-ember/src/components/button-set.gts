/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { afterRender } from '../utils/after-render.ts';
import { observeResize } from '../utils/resize-observer.ts';

export interface ButtonSetSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * Grows with its container, up to a width set by the number of buttons,
     * and stacks the buttons when the container is too narrow for them.
     */
    fluid?: boolean;
    /** Stacks the buttons vertically. A fluid set stacks by itself. */
    stacked?: boolean;
  };
  Blocks: {
    default: [];
  };
}

/**
 * Buttons side by side, or stacked. They keep the order they're written in:
 * where Carbon React's fluid set sorts them by kind and moves the primary
 * button to the top when it stacks, ours keeps it where it's written. List
 * the primary button last side by side, and first with `@stacked`.
 */
export default class ButtonSet extends Component<ButtonSetSignature> {
  // Whether a fluid set's container queries have stacked its buttons.
  @tracked fluidStacked = false;

  get isStacked() {
    return this.args.fluid ? this.fluidStacked : !!this.args.stacked;
  }

  watchStacking = modifier((element: HTMLElement) => {
    const check = () => {
      const stacked =
        getComputedStyle(element).getPropertyValue('--flex-direction') ===
        'column';
      if (stacked !== this.fluidStacked) this.fluidStacked = stacked;
    };
    // Before the first paint, as React's layout effect does.
    const cancel = afterRender(this, check);
    const stop = observeResize(element, check);
    return () => {
      cancel();
      stop();
    };
  });

  <template>
    <div
      class="cds--btn-set
        {{if this.isStacked 'cds--btn-set--stacked'}}
        {{if @fluid 'cds--btn-set--fluid'}}"
      ...attributes
    >
      {{#if @fluid}}
        <div
          class="cds--btn-set__fluid-inner cds--btn-set__fluid-inner--auto-stack"
          {{this.watchStacking}}
        >{{yield}}</div>
      {{else}}
        {{yield}}
      {{/if}}
    </div>
  </template>
}
