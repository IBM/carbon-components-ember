/**
 * Copyright IBM Corp. 2025, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import style from 'ember-style-modifier';
import Tooltip from '../tooltip.gts';
import { observeResize } from '../../utils/resize-observer.ts';
import { isActivationKey } from '../../utils/keyboard.ts';
import type { TooltipSignature } from '../tooltip.gts';
import './truncated-text.scss';

export interface TruncatedTextSignature {
  Element: HTMLDivElement;
  Args: {
    /** Where the tooltip variant's tooltip sits. Defaults to `top`. */
    align?: TooltipSignature['Args']['align'];
    /** Whether the tooltip variant's tooltip moves to stay in view. */
    autoAlign?: TooltipSignature['Args']['autoAlign'];
    /** The expand variant's toggle label once the text is expanded. */
    collapseLabel?: string;
    /** The expand variant's toggle label while the text is truncated. */
    expandLabel?: string;
    /** The text's id. Defaults to `c4p--truncated-text-default-id-` and a unique suffix. */
    id?: string;
    /** The lines to show before truncating. Defaults to 2. */
    lines?: number;
    /** How to show all of the text once it's truncated: in a `tooltip` (the default), or with a toggle that expands it. */
    type?: 'tooltip' | 'expand';
    /** The text. */
    value?: string;
  };
}

export default class TruncatedText extends Component<TruncatedTextSignature> {
  @tracked expanded = false;
  @tracked truncated = false;

  // Upstream's default id is fixed; one per text keeps two on a page apart.
  get id() {
    return this.args.id ?? `c4p--truncated-text-default-id-${guidFor(this)}`;
  }

  get lines() {
    return this.args.lines ?? 2;
  }

  get isExpand() {
    return this.args.type === 'expand';
  }

  get clamp() {
    return {
      '-webkit-line-clamp':
        this.isExpand && this.expanded ? 'none' : String(this.lines),
    };
  }

  toggle = () => {
    this.expanded = !this.expanded;
  };

  toggleOnKey = (event: KeyboardEvent) => {
    if (isActivationKey(event)) {
      // Space would scroll the page, as it doesn't on a button.
      event.preventDefault();
      this.toggle();
    }
  };

  // Re-measures whenever the text, or its element, changes size. Expanded
  // text keeps its toggle.
  measure = modifier(
    (element: HTMLElement, [value, lines]: [string?, number?]) => {
      void value;
      void lines;
      return observeResize(element, () => {
        if (!this.expanded) {
          this.truncated = element.offsetHeight < element.scrollHeight;
        }
      });
    },
  );

  <template>
    <div class="c4p--truncated-text" ...attributes>
      {{#if (and this.truncated (not this.isExpand))}}
        <Tooltip
          @align={{or @align "top"}}
          @autoAlign={{@autoAlign}}
          @label={{@value}}
        >
          <button
            type="button"
            class="c4p--truncated-text__tooltip-trigger"
            aria-label={{@value}}
          >
            <span
              class="c4p--truncated-text__text-content"
              id={{this.id}}
              {{style this.clamp}}
              {{this.measure @value this.lines}}
            >{{@value}}</span>
          </button>
        </Tooltip>
      {{else}}
        <span
          class="c4p--truncated-text__text-content
            {{if this.expanded 'c4p--truncated-text__text-content--expanded'}}"
          id={{this.id}}
          {{style this.clamp}}
          {{this.measure @value this.lines}}
        >{{@value}}</span>
        {{#if this.truncated}}
          <span
            aria-controls={{this.id}}
            aria-expanded={{if this.expanded "true" "false"}}
            class="c4p--truncated-text__expand-toggle"
            role="button"
            tabindex="0"
            {{on "click" this.toggle}}
            {{on "keydown" this.toggleOnKey}}
          >{{if this.expanded @collapseLabel @expandLabel}}</span>
        {{/if}}
      {{/if}}
    </div>
  </template>
}
