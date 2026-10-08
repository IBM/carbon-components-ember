/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

import ChevronRight from './icons/chevron-right.ts';
import SkeletonText from './skeleton-text.gts';

export interface AccordionSkeletonSignature {
  Element: HTMLUListElement | HTMLOListElement;
  Args: {
    /** Which side the chevrons sit on. Defaults to `end`. */
    align?: 'start' | 'end';
    /** How many items to show. Defaults to 4. */
    count?: number;
    /** Removes the items' side padding, unless `@align` is `start`. */
    isFlush?: boolean;
    /** Shows the first item open. Defaults to `true`. */
    open?: boolean;
    /** Renders an `<ol>` in place of a `<ul>`. */
    ordered?: boolean;
  };
}

/** A loading placeholder for an `Accordion`. */
export default class AccordionSkeleton extends Component<AccordionSkeletonSignature> {
  get open() {
    return this.args.open ?? true;
  }

  get closedItems() {
    const count = this.args.count ?? 4;

    return Array.from({ length: this.open ? count - 1 : count });
  }

  get classes() {
    const align = this.args.align ?? 'end';
    const classes = [
      'cds--accordion',
      'cds--skeleton',
      `cds--accordion--${align}`,
    ];

    if (this.args.isFlush && align !== 'start')
      classes.push('cds--accordion--flush');

    return classes.join(' ');
  }

  <template>
    {{#let (element (if @ordered "ol" "ul")) as |List|}}
      <List class={{this.classes}} ...attributes>
        {{#if this.open}}
          <li class="cds--accordion__item cds--accordion__item--active">
            <span class="cds--accordion__heading">
              <ChevronRight @size="16" @svgClass="cds--accordion__arrow" />
              <SkeletonText class="cds--accordion__title" />
            </span>
            <div class="cds--accordion__content">
              <SkeletonText @width="90%" />
              <SkeletonText @width="80%" />
              <SkeletonText @width="95%" />
            </div>
          </li>
        {{/if}}
        {{#each this.closedItems}}
          <li class="cds--accordion__item">
            <span class="cds--accordion__heading">
              <ChevronRight @size="16" @svgClass="cds--accordion__arrow" />
              <SkeletonText class="cds--accordion__title" />
            </span>
          </li>
        {{/each}}
      </List>
    {{/let}}
  </template>
}
