/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import Popover from '../popover.gts';
import { createOverflowHandler } from './-overflow-handler.ts';

export interface PageHeaderTagOverflowSignature {
  Element: HTMLDivElement;
  Blocks: {
    /** The tags. Those that don't fit are hidden, and listed in the popover. */
    default: [];
    /**
     * The tag that opens the popover of hidden tags: `hiddenTags` are the
     * hidden tags' elements, `handleOverflowClick` toggles the popover,
     * `openPopover` is whether it's open, and `triggerId` goes on the
     * trigger, which names the popover.
     */
    renderOverflowTag: [
      hiddenTags: HTMLElement[],
      handleOverflowClick: (event: MouseEvent) => void,
      openPopover: boolean,
      triggerId: string,
    ];
    /** What lists the hidden tags in the popover. */
    renderPopoverContent: [hiddenTags: HTMLElement[]];
  };
}

/** The tags of a PageHeader's tab bar, with the ones that don't fit in a popover. */
export default class PageHeaderTagOverflow extends Component<PageHeaderTagOverflowSignature> {
  @tracked openPopover = false;
  @tracked hiddenTags: HTMLElement[] = [];

  // Upstream's id is fixed; one per header keeps two on a page apart.
  triggerId = `c4p--page-header--tag-overflow-btn-${guidFor(this)}`;

  handleOverflowClick = (event: MouseEvent) => {
    event.stopPropagation();
    this.openPopover = !this.openPopover;
  };

  close = () => {
    this.openPopover = false;
  };

  manage = modifier((container: HTMLElement) => {
    // Closes the popover when the window resizes, giving the trigger focus
    // first so keyboard users aren't stranded.
    const handleResize = () => {
      if (this.openPopover) {
        container.querySelector<HTMLElement>(`#${this.triggerId}`)?.focus();
      }
      this.openPopover = false;
    };
    window.addEventListener('resize', handleResize);
    const teardown = createOverflowHandler({
      container,
      onChange: (_visible, hidden) => {
        this.hiddenTags = hidden;
      },
    });
    return () => {
      window.removeEventListener('resize', handleResize);
      teardown();
    };
  });

  <template>
    <div
      class="c4p--page-header--tag-overflow-container
        {{unless
          this.hiddenTags.length
          'c4p--page-header--tag-overflow-container__has-no-hidden-items'
        }}"
      {{this.manage}}
      ...attributes
    >
      {{yield}}
      <Popover
        class="c4p--page-header--tag-overflow-popover
          {{unless
            this.hiddenTags.length
            'c4p--page-header--tag-overflow-popover__hidden'
          }}"
        @open={{this.openPopover}}
        @onRequestClose={{this.close}}
        data-fixed="true"
        aria-labelledby={{this.triggerId}}
        as |PopoverContent|
      >
        {{yield
          this.hiddenTags
          this.handleOverflowClick
          this.openPopover
          this.triggerId
          to="renderOverflowTag"
        }}
        <PopoverContent>
          <ul
            class="c4p--page-header__tags-popover-list"
            aria-label="Hidden tags"
          >
            {{yield this.hiddenTags to="renderPopoverContent"}}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  </template>
}
