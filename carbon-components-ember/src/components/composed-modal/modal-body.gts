/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import ModalContentSize from '../-private/modal-content-size.ts';
import type ComposedModal from '../composed-modal.gts';

export interface ModalBodySignature {
  Element: HTMLDivElement;
  Args: {
    /** The ComposedModal it's in. */
    modal: ComposedModal;
    /**
     * Provide whether the modal content has a form element. If `true` is
     * used here, non-form child content should have
     * `cds--modal-content__regular-content` class.
     */
    hasForm?: boolean;
    /** Specify whether the modal contains scrolling content */
    hasScrollingContent?: boolean;
  };
  Blocks: {
    /** The modal's content. */
    default: [];
  };
}

/**
 * ComposedModal's content. Content taller than its box scrolls, and is
 * named after the header's label or title.
 */
export default class ModalBody extends Component<ModalBodySignature> {
  content = new ModalContentSize();

  get scrolls() {
    return !!this.args.hasScrollingContent || this.content.scrollable;
  }

  get labelledBy() {
    const header = this.args.modal.header;
    return header?.labelId ?? header?.titleId;
  }

  <template>
    <div
      class="cds--modal-content cds--layer-two
        {{if @hasForm 'cds--modal-content--with-form'}}
        {{if this.scrolls 'cds--modal-scroll-content'}}
        {{if
          (lte this.content.height 300)
          'cds--modal-scroll-content--no-fade'
        }}"
      tabindex={{if this.scrolls "0"}}
      role={{if this.scrolls "region"}}
      aria-labelledby={{if this.scrolls this.labelledBy}}
      ...attributes
      {{this.content.measure}}
    >
      {{~yield~}}
    </div>
  </template>
}
