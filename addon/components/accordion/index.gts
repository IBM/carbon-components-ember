import Component from '@glimmer/component';

interface AccordionSignature {
  Args: {};
  Element: null;
  Blocks: {};
}

export default class Accordion extends Component<AccordionSignature> {
  <template>
    <ul class='cds--accordion cds--accordion--end cds--accordion--md'>
      <li class='cds--accordion__item'>
        <button
          type='button'
          aria-controls='accordion-item-57'
          aria-expanded='false'
          class='cds--accordion__heading'
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
            Title 1
          </div>
        </button>
        <div id='accordion-item-57' class='cds--accordion__content'>
          <p>
            The accordion component delivers large amounts of content in a small
            space through progressive disclosure. The user gets key details about
            the underlying content and can choose to expand that content within
            the constraints of the accordion. Accordions work especially well on
            mobile interfaces or whenever vertical space is at a premium.
          </p>
        </div>
      </li>
      <li class='cds--accordion__item'>
        <button
          type='button'
          aria-controls='accordion-item-58'
          aria-expanded='false'
          class='cds--accordion__heading'
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
            Title 2
          </div>
        </button>
        <div id='accordion-item-58' class='cds--accordion__content'>
          <p>
            The accordion component delivers large amounts of content in a small
            space through progressive disclosure. The user gets key details about
            the underlying content and can choose to expand that content within
            the constraints of the accordion. Accordions work especially well on
            mobile interfaces or whenever vertical space is at a premium.
          </p>
        </div>
      </li>
      <li class='cds--accordion__item'>
        <button
          type='button'
          aria-controls='accordion-item-59'
          aria-expanded='false'
          class='cds--accordion__heading'
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
            Title 3
          </div>
        </button>
        <div id='accordion-item-59' class='cds--accordion__content'>
          <p>
            The accordion component delivers large amounts of content in a small
            space through progressive disclosure. The user gets key details about
            the underlying content and can choose to expand that content within
            the constraints of the accordion. Accordions work especially well on
            mobile interfaces or whenever vertical space is at a premium.
          </p>
        </div>
      </li>
    </ul>
  </template>
}

