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
import type { WithBoundArgs } from '@glint/template';
import { ChevronRight } from '../../icons.ts';

export type StepArgs = {
  /** Title shown in the step's own trigger/static header. */
  title?: string;
  /** Whether the step's body panel is expanded. */
  open?: boolean;
  /** When `true`, `@open` is the sole source of truth; a click only calls `@onToggle`. */
  controlled?: boolean;
  /** Called after the step's open state changes. */
  onToggle?: (open: boolean) => void;
};

export interface ReasoningStepSignature {
  Element: HTMLDivElement;
  Args: StepArgs;
  Blocks: {
    /**
     * The step's body content. As with `ChainOfThoughtStep`, whether a
     * header is interactive is decided by `{{has-block}}` (static per
     * invocation), not upstream's live slot-occupancy sniffing.
     */
    default: [];
  };
}

class ReasoningStep extends Component<ReasoningStepSignature> {
  @tracked internalOpen = false;

  guid = guidFor(this);
  contentId = `cds-aichat-reasoning-step-content-${this.guid}`;
  headerId = `cds-aichat-reasoning-step-header-${this.guid}`;

  get isOpen() {
    return this.args.controlled ? Boolean(this.args.open) : this.internalOpen;
  }

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
    <div class='cds-aichat-reasoning-step {{if this.isOpen "cds-aichat-reasoning-step--open"}}'
      role='listitem'
      ...attributes
    >
      {{#if (has-block)}}
        <button
          id={{this.headerId}}
          type='button'
          class='cds-aichat-reasoning-step__trigger'
          aria-expanded={{if this.isOpen 'true' 'false'}}
          aria-controls={{this.contentId}}
          {{on 'click' this.toggle}}
          {{on 'keydown' this.handleKeydown}}
        >
          <span class='cds-aichat-reasoning-step__icon' aria-hidden='true'>
            <ChevronRight @size='16' />
          </span>
          <div class='cds-aichat-reasoning-step__title'>
            {{@title}}
          </div>
        </button>
      {{else}}
        <div class='cds-aichat-reasoning-step__static' id={{this.headerId}}>
          <span class='cds-aichat-reasoning-step__static-icon' aria-hidden='true'>&mdash;</span>
          <div class='cds-aichat-reasoning-step__title'>
            {{@title}}
          </div>
        </div>
      {{/if}}
      <div
        id={{this.contentId}}
        class='cds-aichat-reasoning-step__panel
          {{unless (has-block) "cds-aichat-reasoning-step__panel--hidden"}}'
        aria-hidden={{if this.isOpen 'false' 'true'}}
        hidden={{if (has-block) false true}}
      >
        {{#if (has-block)}}
          <div class='cds-aichat-reasoning-step__panel-body'>
            {{yield}}
          </div>
        {{/if}}
      </div>
    </div>
  </template>
}

export type Args = {
  /** Whether the panel that wraps this reasoning-steps list is open. */
  open?: boolean;
  /** When `true`, propagated to every yielded step as its own `@controlled`. */
  controlled?: boolean;
};

export interface ReasoningStepsSignature {
  Element: HTMLDivElement;
  Args: Args;
  Blocks: {
    /**
     * Renders one `<ReasoningStep>` per step. Yields the step component
     * pre-bound with `@controlled`, mirroring `Layer`'s `WithBoundArgs`
     * pattern.
     */
    default: [WithBoundArgs<typeof ReasoningStep, 'controlled'>];
  };
}

/**
 * Container for a list of `ReasoningStep`s, collapsible as a whole via
 * `@open` (typically paired with a `ReasoningStepsToggle` button — DOM-
 * decoupled from this container, same as `ChainOfThought`/
 * `ChainOfThoughtToggle`).
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-reasoning-steps`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/reasoning-steps).
 * Doesn't collide with any Carbon React component name, so it stays
 * unprefixed.
 *
 * Upstream also emits `reasoning-animation-start`/`reasoning-animation-end`
 * composed events timed against the panel's CSS transition, purely for its
 * own (unported) message-list scroll manager to resync scroll position
 * against. Not reproduced — no consumer in this port needs them, and
 * without the scroll manager there's nothing to keep in sync. Likewise,
 * upstream's `markLastVisibleStep()` (a DOM query tagging the last non-
 * hidden step with `data-last-item`) has no matching CSS rule anywhere in
 * this port's own or upstream's fetched `.scss` — a pre-existing dead hook
 * even upstream doesn't currently style — so it isn't reproduced either.
 */
export default class ReasoningSteps extends Component<ReasoningStepsSignature> {
  get open() {
    return Boolean(this.args.open);
  }

  <template>
    <div class='cds-aichat-reasoning-steps' ...attributes>
      <div
        class='cds-aichat-reasoning-steps__wrapper
          {{if this.open "cds-aichat-reasoning-steps__wrapper--open"}}'
        aria-hidden={{if this.open 'false' 'true'}}
      >
        <div class='cds-aichat-reasoning-steps__body' role='list'>
          {{yield (component ReasoningStep controlled=@controlled)}}
        </div>
      </div>
    </div>
  </template>
}
