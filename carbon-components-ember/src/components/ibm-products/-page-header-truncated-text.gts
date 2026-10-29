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
import type { PopoverAlignment } from '../popover.gts';

export interface PageHeaderTruncatedTextSignature {
  Element: HTMLDivElement;
  Args: {
    /** Where the tooltip sits. Defaults to `top`. */
    align?: PopoverAlignment;
    /** Defaults to `c4p--truncated-text-default-id-` and a unique suffix. */
    id?: string;
    /** The lines to show before truncating. Defaults to 2. */
    lines?: number;
    value: string;
  };
}

// The tooltip variant of Carbon for IBM Products' TruncatedText, which a
// PageHeader's title is in: text clamped to some lines, with a tooltip
// showing all of it once it's cut off.
export default class PageHeaderTruncatedText extends Component<PageHeaderTruncatedTextSignature> {
  @tracked truncated = false;

  // Upstream's default id is fixed; one per text keeps two on a page apart.
  get id() {
    return this.args.id ?? `c4p--truncated-text-default-id-${guidFor(this)}`;
  }

  get lines() {
    return this.args.lines ?? 2;
  }

  get clamp() {
    return { '-webkit-line-clamp': String(this.lines) };
  }

  // Re-measures whenever the text, or its element, changes size.
  measure = modifier((element: HTMLElement, [value]: [string]) => {
    void value;
    return observeResize(element, () => {
      this.truncated = element.offsetHeight < element.scrollHeight;
    });
  });

  <template>
    <div class="c4p--truncated-text" ...attributes>
      {{#if this.truncated}}
        <Tooltip @align={{or @align "top"}} @label={{@value}}>
          <button
            type="button"
            class="c4p--truncated-text__tooltip-trigger"
            aria-label={{@value}}
          >
            <span
              class="c4p--truncated-text__text-content"
              id={{this.id}}
              {{style this.clamp}}
              {{this.measure @value}}
            >{{@value}}</span>
          </button>
        </Tooltip>
      {{else}}
        <span
          class="c4p--truncated-text__text-content"
          id={{this.id}}
          {{style this.clamp}}
          {{this.measure @value}}
        >{{@value}}</span>
      {{/if}}
    </div>
  </template>
}
