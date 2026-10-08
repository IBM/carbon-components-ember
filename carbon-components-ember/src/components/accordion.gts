import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import type { WithBoundArgs } from '@glint/template';
import { tracked } from '@glimmer/tracking';
import { concat } from '@ember/helper';

export interface AccordionSignature {
  Args: {
    disabled?: boolean;
    open?: boolean;
    align?: 'start' | 'end';
    /**
     * Size of the accordion. When not set, no size class is applied (matching
     * @carbon/react's default behaviour — it only adds `cds--accordion--\${size}`
     * when a `size` prop is explicitly passed).
     */
    size?: 'sm' | 'md' | 'lg';
  };
  Blocks: {
    default: [WithBoundArgs<typeof AccordionItem, 'accordion'>];
  };
}

export interface AccordionItemSignature {
  Args: {
    accordion: Accordion;
    isOpen?: boolean;
    isDisabled?: boolean;
    title: string;
  };
  Blocks: {
    default: [];
  };
}

class AccordionItem extends Component<AccordionItemSignature> {
  get itemId() {
    return guidFor(this);
  }

  /**
   * A per-item `@isDisabled` overrides the accordion-level `@disabled`,
   * matching @carbon/react's `AccordionItem`, whose own `disabled` prop wins
   * over the `Accordion`'s whenever it's a boolean.
   */
  get disabled() {
    return this.args.isDisabled ?? this.args.accordion.args.disabled ?? false;
  }

  get isActive() {
    if (this.disabled) {
      return false;
    }
    return this.args.isOpen ?? this.args.accordion.isActive(this);
  }

  <template>
    <li
      class="cds--accordion__item
        {{if this.isActive 'cds--accordion__item--active'}}
        {{if this.disabled 'cds--accordion__item--disabled'}}"
    >
      <button
        type="button"
        aria-controls="accordion-item-{{this.itemId}}"
        aria-expanded={{if this.isActive "true" "false"}}
        class="cds--accordion__heading"
        {{on "click" (fn @accordion.setActiveItem this)}}
        disabled={{this.disabled}}
      >
        <svg
          focusable="false"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          aria-hidden="true"
          class="cds--accordion__arrow"
        >
          <path d="M11 8 6 13 5.3 12.3 9.6 8 5.3 3.7 6 3z"></path>
        </svg>
        <div class="cds--accordion__title" dir="auto">
          {{@title}}
        </div>
      </button>
      <div class="cds--accordion__wrapper">
        <div
          id="accordion-item-{{this.itemId}}"
          class="cds--accordion__content"
        >
          {{yield}}
        </div>
      </div>
    </li>
  </template>
}

export default class Accordion extends Component<AccordionSignature> {
  @tracked currentItem?: AccordionItem;

  isActive(item: AccordionItem) {
    return this.currentItem === item || this.args.open;
  }

  setActiveItem = (item: AccordionItem) => {
    if (this.currentItem === item) {
      this.currentItem = undefined;
      return;
    }
    this.currentItem = item;
  };

  <template>
    <ul
      class="cds--accordion cds--accordion--{{or @align 'end'}}
        {{if @size (concat 'cds--accordion--' @size)}}"
    >
      {{yield (component AccordionItem accordion=this)}}
    </ul>
  </template>
}
