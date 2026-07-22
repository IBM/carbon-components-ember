/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { registerDestructor } from '@ember/destroyable';
import { runTask } from 'ember-lifeline';
import { A, type NativeArray } from '@ember/array';
import type { WithBoundArgs } from '@glint/template';
import CheckmarkOutline from './icons/checkmark-outline.ts';
import Warning from './icons/warning.ts';
import CircleDash from './icons/circle-dash.ts';
import Incomplete from './icons/incomplete.ts';

export type Args = {
  /**
   * Optionally specify the current step array index
   */
  currentIndex?: number;
  /**
   * Optional callback called if a ProgressStep is clicked on. Returns the index of the step.
   */
  onChange?: (index: number) => void;
  /**
   * Specify whether the progress steps should be split equally in size in the div
   */
  spaceEqually?: boolean;
  /**
   * Determines whether or not the ProgressIndicator should be rendered vertically.
   */
  vertical?: boolean;
};

export type ProgressStepArgs = {
  /**
   * Provide the label for the ProgressStep
   */
  label: string;
  /**
   * Provide a description for the ProgressStep
   */
  description?: string;
  /**
   * Provide an optional secondary label
   */
  secondaryLabel?: string;
  /**
   * Specify whether the step is invalid
   */
  invalid?: boolean;
  /**
   * Specify whether the step is disabled
   */
  disabled?: boolean;
  /**
   * Specify whether the step has been completed. Only relevant for steps
   * that are not before the current step, since earlier steps are always
   * considered complete.
   */
  complete?: boolean;
};

class ProgressStep extends Component<{
  Args: ProgressStepArgs & { indicator: ProgressIndicator };
  Element: HTMLLIElement;
}> {
  constructor(owner: any, args: ProgressStep['args']) {
    super(owner, args);
    runTask(this, () => {
      if (this.isDestroyed) {
        return;
      }
      this.args.indicator.registerStep(this);
      registerDestructor(this, () => {
        this.args.indicator.unregisterStep(this);
      });
    });
  }

  get index() {
    return this.args.indicator.steps.indexOf(this);
  }

  get isComplete() {
    if (this.index < this.args.indicator.currentIndex) {
      return true;
    }
    return this.args.complete ?? false;
  }

  get isCurrent() {
    return this.index === this.args.indicator.currentIndex && !this.isComplete;
  }

  get isIncomplete() {
    return !this.isComplete && !this.isCurrent;
  }

  get isUnclickable() {
    return !this.args.indicator.args.onChange || this.isCurrent;
  }

  get message() {
    if (this.args.invalid) {
      return 'Invalid';
    }
    if (this.isCurrent) {
      return 'Current';
    }
    if (this.isComplete) {
      return 'Complete';
    }
    return 'Incomplete';
  }

  get liClasses() {
    const classes = ['cds--progress-step'];
    if (this.isCurrent) classes.push('cds--progress-step--current');
    if (this.isComplete) classes.push('cds--progress-step--complete');
    if (this.isIncomplete) classes.push('cds--progress-step--incomplete');
    if (this.args.disabled) classes.push('cds--progress-step--disabled');
    return classes.join(' ');
  }

  get buttonClasses() {
    const classes = ['cds--progress-step-button'];
    if (this.isUnclickable) classes.push('cds--progress-step-button--unclickable');
    return classes.join(' ');
  }

  @action
  handleClick() {
    if (this.args.disabled || this.isCurrent) {
      return;
    }
    this.args.indicator.args.onChange?.(this.index);
  }

  @action
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleClick();
    }
  }

  <template>
    <li class={{this.liClasses}} ...attributes>
      <button
        type='button'
        class={{this.buttonClasses}}
        disabled={{@disabled}}
        aria-disabled={{if @disabled 'true'}}
        tabindex={{if @disabled '-1' '0'}}
        title={{@label}}
        {{on 'click' this.handleClick}}
        {{on 'keydown' this.handleKeyDown}}
      >
        {{#if @invalid}}
          <Warning @size={{16}} @svgClass='cds--progress__warning' @fill='currentColor' />
        {{else if this.isCurrent}}
          <Incomplete @size={{16}} @fill='currentColor' />
        {{else if this.isComplete}}
          <CheckmarkOutline @size={{16}} @fill='currentColor' />
        {{else}}
          <CircleDash @size={{16}} @fill='currentColor' />
        {{/if}}
        <div class='cds--progress-text'>
          <span class='cds--progress-label'>{{@label}}</span>
          {{#if @secondaryLabel}}
            <span class='cds--progress-optional'>{{@secondaryLabel}}</span>
          {{/if}}
        </div>
        <span class='cds--assistive-text'>{{this.message}}</span>
        <span class='cds--progress-line'></span>
      </button>
    </li>
  </template>
}

export interface ProgressIndicatorSignature {
  Args: Args;
  Element: HTMLUListElement;
  Blocks: {
    default: [WithBoundArgs<typeof ProgressStep, 'indicator'>];
  };
}

/**
 The Carbon ProgressIndicator

 ```handlebars
 <ProgressIndicator @currentIndex={{1}} as |Step|>
   <Step @label='First step' />
   <Step @label='Second step' />
   <Step @label='Third step' />
 </ProgressIndicator>
 ```
 @class ProgressIndicator
 @public
 **/
export default class ProgressIndicator extends Component<ProgressIndicatorSignature> {
  @tracked steps: NativeArray<ProgressStep> = A([]);

  get currentIndex() {
    return this.args.currentIndex ?? 0;
  }

  get classes() {
    const classes = ['cds--progress'];
    if (this.args.vertical) classes.push('cds--progress--vertical');
    if (this.args.spaceEqually && !this.args.vertical) {
      classes.push('cds--progress--space-equal');
    }
    return classes.join(' ');
  }

  registerStep(step: ProgressStep) {
    this.steps.pushObject(step);
  }

  unregisterStep(step: ProgressStep) {
    this.steps.removeObject(step);
  }

  <template>
    <ul class={{this.classes}} ...attributes>
      {{yield (component ProgressStep indicator=this)}}
    </ul>
  </template>
}
