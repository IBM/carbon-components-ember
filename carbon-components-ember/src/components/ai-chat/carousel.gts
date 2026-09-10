/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { modifier as eModifier } from 'ember-modifier';
import {
  initCarousel,
  type CarouselResponse,
  type InitCarousel,
} from '@carbon/utilities/carousel';
import { default as Button } from '../button.gts';
import { default as Tooltip } from '../tooltip.gts';
import { default as ChevronLeft } from '../icons/chevron-left.ts';
import { default as ChevronRight } from '../icons/chevron-right.ts';

export type Args = {
  /** Tooltip/assistive text for the "next" button. */
  nextBtnText?: string;
  /** Tooltip/assistive text for the "previous" button. */
  previousBtnText?: string;
  /** Called whenever the active view finishes transitioning. */
  onChange?: (data: CarouselResponse) => void;
};

export interface CarouselSignature {
  Element: HTMLDivElement;
  Args: Args;
  Blocks: {
    /**
     * Each direct child rendered here becomes one carousel view (upstream's
     * unnamed/"body" slot - its own JSDoc calls it `body`, but the actual
     * implementation never names the slot, an upstream doc/code mismatch
     * this port doesn't "fix", matching this addon's own precedent for
     * upstream inconsistencies).
     */
    default: [];
  };
}

/**
 * View-stack carousel for Carbon AI Chat.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-carousel`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/carousel).
 * Doesn't collide with any Carbon React component name, so it stays
 * unprefixed (same reasoning as `Launcher`/`ChatShell`/`Table`).
 *
 * Unlike the rest of this port, `next()`/`prev()`/the change event/the index
 * readout aren't reimplemented here - they delegate directly to
 * `@carbon/utilities`'s `initCarousel`, the same view-stack engine upstream
 * itself uses (imported via its `@carbon/utilities/carousel` subpath, not
 * the package root, to avoid pulling in the root barrel's unrelated
 * `@internationalized/number`/`temporal-polyfill` re-exports).
 *
 * `initCarousel` wraps the container's children into its own
 * `.carousel__itemsWrapper` on first call (`wrapAllItems()`) - the wrapper
 * is rendered up front here (`class='carousel__itemsWrapper'`, matching the
 * exact class its own no-op guard checks for) so `initCarousel` never
 * reparents a Glimmer-owned node itself; only genuinely upstream-owned
 * elements (the wrapper, the live region) move around after that.
 *
 * Matches upstream's own deliberate 100ms delay before calling
 * `initCarousel` ("temp solution to account for image load time", per its
 * source comment) so multi-line/image-bearing views get an accurate initial
 * height measurement. Also matches upstream in having no bounds-disabled
 * state for the prev/next buttons - `initCarousel`'s own index clamping
 * makes clicking past either end a no-op.
 *
 * ```gjs
 * import { Carousel } from 'carbon-components-ember/components';
 *
 * <template>
 *   <Carousel @previousBtnText='Previous' @nextBtnText='Next'>
 *     <div>View 1</div>
 *     <div>View 2</div>
 *   </Carousel>
 * </template>
 * ```
 */
export default class Carousel extends Component<CarouselSignature> {
  @tracked currentIndex = 0;
  @tracked lastIndex = 0;

  carousel?: InitCarousel;

  // Upstream's own indicator ("N / M") is 1-based; `currentIndex`/
  // `lastIndex` above stay 0-based, matching `CarouselResponse`'s own
  // shape, so the +1 lives only in these display getters.
  get displayCurrentIndex() {
    return this.currentIndex + 1;
  }

  get displayLastIndex() {
    return this.lastIndex + 1;
  }

  @action
  handleViewChangeEnd(data: CarouselResponse) {
    this.currentIndex = data.currentIndex;
    this.lastIndex = data.lastIndex;
    this.args.onChange?.(data);
  }

  @action
  prev() {
    this.carousel?.prev();
  }

  @action
  next() {
    this.carousel?.next();
  }

  // Deliberately takes no named args: `initCarousel` fully owns the DOM it's
  // given once constructed, so re-running this on every arg-identity change
  // (e.g. a fresh `@onChange` closure) would tear down and rebuild the
  // carousel, silently resetting the active view back to index 0.
  // `@onChange` is read from `this.args` inside the closure instead.
  attachCarousel = eModifier<{ Element: HTMLDivElement }>((element) => {
    const timeoutId = setTimeout(() => {
      this.carousel = initCarousel(element, {
        onViewChangeEnd: (data) => this.handleViewChangeEnd(data),
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      this.carousel?.destroyEvents?.();
      this.carousel = undefined;
    };
  });

  <template>
    <div class='cds-aichat-carousel' ...attributes>
      <div {{this.attachCarousel}}>
        <div class='carousel__itemsWrapper'>{{yield}}</div>
      </div>
      <div class='cds-aichat-carousel__controls'>
        <Tooltip @label={{@previousBtnText}}>
          <Button
            class='cds-aichat-carousel__previous-btn'
            @ghost={{true}}
            @iconOnly={{true}}
            @onClick={{this.prev}}
          >
            <ChevronLeft
              @size={{16}}
              @fill='currentColor'
              @svgClass='cds-aichat-carousel__nav-icon'
            />
          </Button>
        </Tooltip>
        <span class='cds-aichat-carousel__indicator'>
          {{this.displayCurrentIndex}}
          /
          {{this.displayLastIndex}}
        </span>
        <Tooltip @label={{@nextBtnText}}>
          <Button
            class='cds-aichat-carousel__next-btn'
            @ghost={{true}}
            @iconOnly={{true}}
            @onClick={{this.next}}
          >
            <ChevronRight
              @size={{16}}
              @fill='currentColor'
              @svgClass='cds-aichat-carousel__nav-icon'
            />
          </Button>
        </Tooltip>
      </div>
    </div>
  </template>
}
