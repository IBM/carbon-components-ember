/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import style from 'ember-style-modifier';

export interface CardTitleSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * Cuts the title off with an ellipsis: `true` after one line, or a
     * number of lines.
     */
    titleTruncate?: boolean | number;
    /** The widest a truncated title gets. Defaults to `100%`. */
    maxWidth?: string;
    /** A label above the title. */
    label?: string;
    /** Cuts the label off: `true` after one line, or a number of lines. */
    labelTruncate?: boolean | number;
    /** A description below the title. */
    description?: string;
    /**
     * Cuts the description off: `true` after one line, or a number of
     * lines.
     */
    descriptionTruncate?: boolean | number;
  };
  Blocks: {
    default: [];
    /** An icon before the title, Carbon React's `titleStart`. */
    titleStart: [];
    /** An icon after the title, Carbon React's `titleEnd`. */
    titleEnd: [];
  };
}

function lineClamp(property: string, truncate?: boolean | number) {
  return typeof truncate === 'number'
    ? { [`--cds--card--${property}-line-clamp`]: String(truncate) }
    : {};
}

function truncateClass(block: string, truncate?: boolean | number) {
  if (truncate === true) return `${block}--truncate`;
  if (typeof truncate === 'number') return `${block}--truncate-multi`;
  return '';
}

/**
 * A `Card`'s title, in its header, with an optional label above and
 * description below. The card's `@density` sets its type style.
 */
export default class CardTitle extends Component<CardTitleSignature> {
  get textRowClass() {
    return truncateClass('cds--card__title-text-row', this.args.titleTruncate);
  }

  get labelClass() {
    return truncateClass('cds--card__label', this.args.labelTruncate);
  }

  get descriptionClass() {
    return truncateClass(
      'cds--card__description',
      this.args.descriptionTruncate,
    );
  }

  get titleStyles() {
    const { titleTruncate, maxWidth } = this.args;
    if (!titleTruncate) return {};
    return {
      '--cds--card--title-max-width': maxWidth ?? '100%',
      ...lineClamp('title', titleTruncate),
    };
  }

  get labelStyles() {
    return lineClamp('label', this.args.labelTruncate);
  }

  get descriptionStyles() {
    return lineClamp('description', this.args.descriptionTruncate);
  }

  <template>
    <div class="cds--card__title" ...attributes>
      {{#if @label}}
        <div
          class="cds--card__label {{this.labelClass}}"
          {{style this.labelStyles}}
        >{{@label}}</div>
      {{/if}}
      <span
        class="cds--card__title-text-row
          {{this.textRowClass}}
          {{if
            (has-block 'titleStart')
            'cds--card__title-text-row--with-start-icon'
          }}
          {{if
            (has-block 'titleEnd')
            'cds--card__title-text-row--with-end-icon'
          }}"
        {{style this.titleStyles}}
      >
        {{#if (has-block "titleStart")}}
          <span class="cds--card__title-start-icon">{{yield
              to="titleStart"
            }}</span>
        {{/if}}
        {{yield}}
        {{#if (has-block "titleEnd")}}
          <span class="cds--card__title-end-icon">{{yield to="titleEnd"}}</span>
        {{/if}}
      </span>
      {{#if @description}}
        <div
          class="cds--card__description {{this.descriptionClass}}"
          {{style this.descriptionStyles}}
        >{{@description}}</div>
      {{/if}}
    </div>
  </template>
}
