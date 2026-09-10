/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { default as eq } from 'ember-truth-helpers/helpers/eq';
import { default as Loading } from '../loading.gts';
import {
  default as IconIndicator,
  type IconIndicatorKind,
} from '../icon-indicator.gts';

export type CardStep = {
  title: string;
  description?: string;
  kind?: IconIndicatorKind;
  label?: string;
};

export type Args = {
  steps?: CardStep[];
};

export interface AiChatCardStepsSignature {
  Element: HTMLDivElement;
  Args: Args;
}

/**
 * Renders a vertical list of steps (e.g. an agent's reasoning/progress
 * trail) for use inside `AiChatCard`.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-card-steps`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/card).
 * Upstream special-cases the `in-progress` kind to render a spinner
 * instead of `IconIndicator`'s icon — that's ported below as-is (a step
 * with no `kind` at all renders only its `label`, matching upstream too).
 */
export default class AiChatCardSteps extends Component<AiChatCardStepsSignature> {
  get steps() {
    return this.args.steps ?? [];
  }

  <template>
    <div class='cds-aichat-card-steps' ...attributes>
      {{#each this.steps as |step|}}
        <div class='cds-aichat-card-step'>
          {{#if step.kind}}
            <div class='cds-aichat-card-step-indicator'>
              {{#if (eq step.kind 'in-progress')}}
                <Loading @small={{true}} @withOverlay={{false}} @description='Loading' />
                {{step.label}}
              {{else}}
                <IconIndicator
                  @kind={{step.kind}}
                  @label={{if step.label step.label ''}}
                  @size={{16}}
                />
              {{/if}}
            </div>
          {{else}}
            {{step.label}}
          {{/if}}
          <div class='cds-aichat-card-step-content'>
            <p class='cds-aichat-card-step-title'>{{step.title}}</p>
            {{#if step.description}}
              <div class='cds-aichat-card-step-description'>
                {{step.description}}
              </div>
            {{/if}}
          </div>
        </div>
      {{/each}}
    </div>
  </template>
}
