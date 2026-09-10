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
import { default as eq } from 'ember-truth-helpers/helpers/eq';
import type { WithBoundArgs } from '@glint/template';
import { default as Loading } from '../loading.gts';
import { CheckmarkFilled, ChevronRight, ErrorFilled } from '../../icons.ts';

export type ChainOfThoughtStepStatus = 'processing' | 'failure' | 'success';

export type StepArgs = {
  /** Numbered label, e.g. `"1: Searching the web"`. Ignored if `@labelText` is set. */
  title?: string;
  /** 1-based position, used to number the title and alternate row shading. */
  stepNumber?: number;
  /** Overrides the numbered `@title` entirely when set. */
  labelText?: string;
  /** Defaults to `'success'`. */
  status?: ChainOfThoughtStepStatus;
  /** Whether the step's body panel is expanded. */
  open?: boolean;
  /** When `true`, `@open` is the sole source of truth; a click only calls `@onToggle`. */
  controlled?: boolean;
  statusSucceededLabelText?: string;
  statusFailedLabelText?: string;
  statusProcessingLabelText?: string;
  /** Called after the step's open state changes (click, or an external `@open` update). */
  onToggle?: (open: boolean) => void;
};

export interface ChainOfThoughtStepSignature {
  Element: HTMLDivElement;
  Args: StepArgs;
  Blocks: {
    /**
     * The step's body content. Upstream derives whether a header is
     * interactive from live slot occupancy (and auto-closes an empty,
     * uncontrolled step); this port uses `{{has-block}}` instead, which is
     * static per invocation — a step is either given body content or it
     * isn't, so the auto-close-when-emptied behavior doesn't apply here.
     */
    default: [];
  };
}

const numberFormatter = new Intl.NumberFormat('en-US');

class ChainOfThoughtStep extends Component<ChainOfThoughtStepSignature> {
  @tracked internalOpen = false;

  guid = guidFor(this);

  get isOpen() {
    return this.args.controlled ? Boolean(this.args.open) : this.internalOpen;
  }

  get headerTitle() {
    if (this.args.labelText) {
      return this.args.labelText;
    }
    if (this.args.stepNumber && this.args.stepNumber > 0) {
      const formatted = numberFormatter.format(this.args.stepNumber);
      return `${formatted}: ${this.args.title ?? ''}`;
    }
    return this.args.title ?? '';
  }

  get status(): ChainOfThoughtStepStatus {
    return this.args.status ?? 'success';
  }

  get stepParityClass() {
    if (!this.args.stepNumber || this.args.stepNumber <= 0) {
      return '';
    }
    return this.args.stepNumber % 2 === 0
      ? 'cds-aichat-chain-of-thought-step--even'
      : 'cds-aichat-chain-of-thought-step--odd';
  }

  contentId = `cds-aichat-chain-of-thought-step-content-${this.guid}`;
  headerId = `cds-aichat-chain-of-thought-step-header-${this.guid}`;

  @action
  toggle() {
    const next = !this.isOpen;
    if (!this.args.controlled) {
      this.internalOpen = next;
    }
    this.args.onToggle?.(next);
  }

  @action
  handleKeydown(event: KeyboardEvent) {
    if (this.isOpen && (event.key === 'Escape' || event.key === 'Esc')) {
      event.stopPropagation();
      if (!this.args.controlled) {
        this.internalOpen = false;
      }
      this.args.onToggle?.(false);
    }
  }

  <template>
    <div
      class='cds-aichat-chain-of-thought-step {{this.stepParityClass}}'
      role='listitem'
      ...attributes
    >
      {{#if (has-block)}}
        <button
          id={{this.headerId}}
          type='button'
          class='cds-aichat-chain-of-thought-step__header'
          aria-expanded={{if this.isOpen 'true' 'false'}}
          aria-controls={{this.contentId}}
          {{on 'click' this.toggle}}
          {{on 'keydown' this.handleKeydown}}
        >
          <span
            class='cds-aichat-chain-of-thought-step__header-chevron
              {{if this.isOpen "cds-aichat-chain-of-thought-step__header-chevron--open"}}'
            aria-hidden='true'
          >
            <ChevronRight @size='16' />
          </span>
          <span class='cds-aichat-chain-of-thought-step__header-title'>
            {{this.headerTitle}}
          </span>
          <span class='cds-aichat-chain-of-thought-step__header-status'>
            {{#if (eq this.status 'processing')}}
              <Loading
                @inline={{true}}
                @small={{true}}
                @withOverlay={{false}}
                @description={{if
                  @statusProcessingLabelText
                  @statusProcessingLabelText
                  'Processing'
                }}
              />
            {{else if (eq this.status 'failure')}}
              <span
                class='cds-aichat-chain-of-thought-step__header-status--failure'
                aria-label={{if @statusFailedLabelText @statusFailedLabelText 'Failed'}}
              >
                <ErrorFilled @size='16' />
              </span>
            {{else}}
              <span
                class='cds-aichat-chain-of-thought-step__header-status--success'
                aria-label={{if
                  @statusSucceededLabelText
                  @statusSucceededLabelText
                  'Succeeded'
                }}
              >
                <CheckmarkFilled @size='16' />
              </span>
            {{/if}}
          </span>
        </button>
      {{else}}
        <div class='cds-aichat-chain-of-thought-step__static' id={{this.headerId}}>
          <span class='cds-aichat-chain-of-thought-step__header-chevron' aria-hidden='true'>
            &mdash;
          </span>
          <span class='cds-aichat-chain-of-thought-step__header-title'>
            {{this.headerTitle}}
          </span>
        </div>
      {{/if}}
      <div
        id={{this.contentId}}
        class='cds-aichat-chain-of-thought-step__content
          {{if this.isOpen "cds-aichat-chain-of-thought-step__content--open"}}'
        aria-hidden={{if this.isOpen 'false' 'true'}}
        hidden={{if (has-block) false true}}
      >
        {{#if (has-block)}}
          <div class='cds-aichat-chain-of-thought-step__item'>
            {{yield}}
          </div>
        {{/if}}
      </div>
    </div>
  </template>
}

export type Args = {
  /** Whether the panel that wraps this chain of thought's steps is open. */
  open?: boolean;
  /** When `true`, propagated to every yielded step as its own `@controlled`. */
  controlled?: boolean;
  /** ID applied to the content panel `<div>`. */
  panelId?: string;
  /** Called when `@open` changes. */
  onToggle?: (open: boolean) => void;
};

export interface ChainOfThoughtSignature {
  Element: HTMLDivElement;
  Args: Args;
  Blocks: {
    /**
     * Renders one `<ChainOfThoughtStep>` per step. Yields the step
     * component pre-bound with `@controlled`, mirroring `Layer`'s
     * `WithBoundArgs` pattern for propagating a single arg down an
     * arbitrary number of children.
     */
    default: [WithBoundArgs<typeof ChainOfThoughtStep, 'controlled'>];
  };
}

/**
 * Container for a list of `ChainOfThoughtStep`s, wrapped in its own
 * open/closed panel (typically revealed via a `ChainOfThoughtToggle`
 * button, linked by `@panelId`/`aria-controls` — this addon doesn't wire
 * that link automatically, matching upstream, which also leaves the two
 * components DOM-decoupled).
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-chain-of-thought`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chain-of-thought).
 * Doesn't collide with any Carbon React component name, so it stays
 * unprefixed.
 *
 * Upstream also aggregates a `chain-of-thought-step-toggled` DOM event
 * bubbling up from any child step into its own `@onStepToggle` callback.
 * That relies on DOM-tree event bubbling, which has no clean equivalent
 * for a block-yielded child in Ember — not reproduced; pass a step-level
 * `@onToggle` to each individual step instead.
 */
export default class ChainOfThought extends Component<ChainOfThoughtSignature> {
  get open() {
    return Boolean(this.args.open);
  }

  get panelId() {
    return this.args.panelId ?? `cds-aichat-chain-of-thought-panel-${guidFor(this)}`;
  }

  <template>
    <div class='cds-aichat-chain-of-thought' ...attributes>
      <div
        id={{this.panelId}}
        class='cds-aichat-chain-of-thought__content
          {{if this.open "cds-aichat-chain-of-thought__content--open"}}'
        aria-hidden={{if this.open 'false' 'true'}}
        hidden={{if this.open false true}}
      >
        {{yield (component ChainOfThoughtStep controlled=@controlled)}}
      </div>
    </div>
  </template>
}
