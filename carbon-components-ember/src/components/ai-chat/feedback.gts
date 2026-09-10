/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { default as didUpdate } from '@ember/render-modifiers/modifiers/did-update';
import { default as Button } from '../button.gts';
import { default as Tooltip } from '../tooltip.gts';
import { default as Checkbox } from '../checkbox.gts';
import { default as Markdown } from './markdown.gts';
import { Close } from '../../icons.ts';

export type FeedbackDetails = {
  text?: string;
  selectedCategories?: string[];
};

export type Args = {
  /** Whether the feedback panel is expanded. */
  isOpen?: boolean;
  /** Renders every control disabled/non-interactive without dimming the panel. */
  isReadonly?: boolean;
  /** Seeds (and, on identity change, resets) the text area and selected categories. */
  initialValues?: FeedbackDetails | null;
  maxLength?: number;
  /** Defaults to `'Provide additional feedback'`. */
  title?: string;
  /** Shown only when `@showBody` is `true`. Defaults to `'What do you think of this response?'`. */
  body?: string;
  /** Toggle-able category chips. */
  categories?: string[];
  /** Rendered through `Markdown` below the categories/text area. */
  disclaimer?: string;
  /**
   * Label for a checkbox gating the submit button. When set, submit starts
   * disabled until the checkbox is checked; when omitted, no checkbox
   * renders and submit is enabled from the start (matching upstream).
   */
  disclaimerCheckbox?: string;
  /** Defaults to `'Provide additional feedback...'`. */
  placeholder?: string;
  /** Defaults to `'Submit'`. */
  primaryLabel?: string;
  /** Defaults to `'Feedback categories'`. */
  categoriesLabel?: string;
  showTextArea?: boolean;
  showBody?: boolean;
  id?: string;
  onSubmit?: (details: FeedbackDetails) => void;
  onClose?: () => void;
};

export interface FeedbackSignature {
  Element: HTMLDivElement;
  Args: Args;
}

/**
 * Panel requesting free-text and/or categorized feedback on a chat
 * response, typically opened from a `FeedbackButtons` thumbs-down click.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-feedback`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/feedback).
 * Doesn't collide with any Carbon React component name, so it stays
 * unprefixed.
 *
 * Category chips are plain `<button>`s styled to match upstream's
 * `cds-selectable-tag` (no `SelectableTag` component exists in this addon —
 * Carbon React's own `Tag` has no selectable variant either), not a shared
 * component. The disclaimer renders through this port's own `Markdown`
 * component, matching upstream's use of its sibling `cds-aichat-markdown`.
 */
export default class Feedback extends Component<FeedbackSignature> {
  @tracked textInput = '';
  @tracked selectedCategories: string[] = [];
  @tracked disclaimerChecked = false;

  guid = guidFor(this);

  get id() {
    return this.args.id ?? `cds-aichat-feedback-${this.guid}`;
  }

  get isSubmitDisabled() {
    if (this.args.isReadonly) {
      return true;
    }
    return Boolean(this.args.disclaimerCheckbox) && !this.disclaimerChecked;
  }

  @action
  applyInitialValues() {
    const values = this.args.initialValues;
    this.textInput = values?.text ?? '';
    this.selectedCategories = [...(values?.selectedCategories ?? [])];
    this.disclaimerChecked = false;
  }

  @action
  handleTextInput(event: Event) {
    this.textInput = (event.currentTarget as HTMLTextAreaElement).value;
  }

  @action
  isCategorySelected(category: string) {
    return this.selectedCategories.includes(category);
  }

  @action
  toggleCategory(category: string) {
    if (this.args.isReadonly) {
      return;
    }
    this.selectedCategories = this.selectedCategories.includes(category)
      ? this.selectedCategories.filter((c) => c !== category)
      : [...this.selectedCategories, category];
  }

  @action
  handleDisclaimerCheckboxChange(checked: boolean) {
    this.disclaimerChecked = checked;
  }

  @action
  handleSubmit() {
    this.args.onSubmit?.({
      text: this.textInput,
      selectedCategories: this.selectedCategories,
    });
  }

  @action
  handleClose() {
    this.args.onClose?.();
  }

  <template>
    <div
      id={{this.id}}
      class='cds-aichat-feedback'
      {{didUpdate this.applyInitialValues @initialValues}}
      ...attributes
    >
      <div
        class='cds-aichat-feedback__container
          {{unless @isOpen "cds-aichat-feedback__container--closed"}}'
      >
        <div class='cds-aichat-feedback__close'>
          <Tooltip @label='Close'>
            <Button
              @ghost={{true}}
              @iconOnly={{true}}
              @size='lg'
              @disabled={{@isReadonly}}
              @onClick={{this.handleClose}}
            >
              <Close @size='16' />
            </Button>
          </Tooltip>
        </div>
        <div class='cds-aichat-feedback__title-row'>
          <div class='cds-aichat-feedback__title'>
            {{if @title @title 'Provide additional feedback'}}
          </div>
        </div>
        <div class='cds-aichat-feedback__body-content'>
          <div class='cds-aichat-feedback__prompt-categories'>
            {{#if @showBody}}
              <div class='cds-aichat-feedback__prompt'>
                {{if @body @body 'What do you think of this response?'}}
              </div>
            {{/if}}
            {{#if @categories.length}}
              <div
                class='cds-aichat-feedback__tag-list'
                role='group'
                aria-label={{if @categoriesLabel @categoriesLabel 'Feedback categories'}}
              >
                {{#each @categories as |category|}}
                  <button
                    type='button'
                    class='cds-aichat-feedback__tag
                      {{if
                        (this.isCategorySelected category)
                        "cds-aichat-feedback__tag--selected"
                      }}'
                    disabled={{@isReadonly}}
                    {{on 'click' (fn this.toggleCategory category)}}
                  >
                    {{category}}
                  </button>
                {{/each}}
              </div>
            {{/if}}
          </div>
          <div class='cds-aichat-feedback__text'>
            {{#if @showTextArea}}
              <div class='cds-aichat-feedback__input'>
                <textarea
                  id='{{this.id}}-text-area'
                  class='cds-aichat-feedback__text-area'
                  disabled={{@isReadonly}}
                  placeholder={{if
                    @placeholder
                    @placeholder
                    'Provide additional feedback...'
                  }}
                  rows='3'
                  maxlength={{@maxLength}}
                  {{on 'input' this.handleTextInput}}
                >{{this.textInput}}</textarea>
              </div>
            {{/if}}
            {{#if @disclaimer}}
              <div class='cds-aichat-feedback__disclaimer'>
                <Markdown @markdown={{@disclaimer}} />
              </div>
            {{/if}}
          </div>
          {{#if @disclaimerCheckbox}}
            <Checkbox
              class='cds-aichat-feedback__disclaimer-checkbox'
              @disabled={{@isReadonly}}
              @checked={{this.disclaimerChecked}}
              @onChange={{this.handleDisclaimerCheckboxChange}}
              @label={{@disclaimerCheckbox}}
            />
          {{/if}}
        </div>
        <div class='cds-aichat-feedback__buttons'>
          <div class='cds-aichat-feedback__submit'>
            <Button
              @type='primary'
              @size='lg'
              @disabled={{this.isSubmitDisabled}}
              @onClick={{this.handleSubmit}}
            >
              {{if @primaryLabel @primaryLabel 'Submit'}}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </template>
}
