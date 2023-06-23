import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import or from 'carbon-components-ember/helpers/or';
import { WithBoundArgs } from '@glint/template';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

interface AccordionSignature {
  Args: {
    disabled?: boolean;
    align?: 'start'|'end';
  };
  Element: null;
  Blocks: {
    default: [WithBoundArgs<typeof Item, 'accordion'>];
  };
}

interface ItemSignature {
  Args: {
    accordion: Accordion;
    isOpen?: boolean;
    isDisabled?: boolean;
    title: string;
  };
  Element: null;
  Blocks: {
    default: [];
  };
}

class Item extends Component<ItemSignature> {

  get itemId() {
    return guidFor(this)
  }

  get isActive() {
    return this.args.isOpen ?? this.args.accordion.isActive(this);
  }

  <template>
    <li
      class='cds--accordion__item
        {{if this.isActive "cds--accordion__item--activ"}}
        {{if @isDisabled "cds--accordion__item--disable"}}'
    >
      <button
        type='button'
        aria-controls='accordion-item-{{this.itemId}}'
        aria-expanded={{if @isActive 'true' 'false'}}
        class='cds--accordion__heading'
        {{on 'click' (fn @accordion.setActiveItem this)}}
      >
        <svg
          focusable='false'
          preserveAspectRatio='xMidYMid meet'
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          width='16'
          height='16'
          viewBox='0 0 16 16'
          aria-hidden='true'
          class='cds--accordion__arrow'
        >
          <path d='M11 8L6 13 5.3 12.3 9.6 8 5.3 3.7 6 3z'></path>
        </svg>
        <div class='cds--accordion__title' dir='auto'>
          {{@title}}
        </div>
      </button>
      <div id='accordion-item-{{this.itemId}}' class='cds--accordion__content'>
        {{yield}}
      </div>
    </li>
  </template>
}


export default class Accordion extends Component<AccordionSignature> {
  @tracked currentItem: Item;

  isActive(item: Item) {
    return this.currentItem === item;
  }

  setActiveItem(item: Item) {
    this.currentItem = item
  }

  <template>
    <ul
      class='cds--accordion cds--accordion--{{or @align "end"}}
        cds--accordion--md'
    >
      {{yield (component Item accordion=this)}}
    </ul>
  </template>
}
