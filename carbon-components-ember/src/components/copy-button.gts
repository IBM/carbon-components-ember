import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import { modifier as eModifier } from 'ember-modifier';
import { task, timeout } from 'ember-concurrency';
import Popover, { PopoverContent, type PopoverAlignment } from './popover.gts';
import Button from '../components/button.gts';

export type Args = {
  targetElementId?: string;
  targetElement?: Element;
  inline?: boolean;
  align?: PopoverAlignment;
  autoAlign?: boolean;
  disabled?: boolean;
  feedback?: string;
  feedbackTimeout?: number;
  iconDescription?: string;
  onClick?: () => void;
};

export interface CarbonCopyButtonSignature {
  Args: Args;
  Element: HTMLButtonElement;
  Blocks: {
    default: [];
  };
}

const captureElement = eModifier<{
  Element: HTMLElement;
  Args: { Named: { onInsert: (element: HTMLElement) => void } };
}>((element, _positional, { onInsert }) => {
  onInsert(element);
});

export default class CarbonCopyButton extends Component<CarbonCopyButtonSignature> {
  @tracked didCopy: boolean = false;
  @tracked isHovered: boolean = false;
  carbonElement?: HTMLElement;

  tooltipId = `${guidFor(this)}-copy-btn-tooltip`;

  get options() {
    return {
      targetElement: this.args.targetElement,
      targetElementId: this.args.targetElementId,
    };
  }

  get align(): PopoverAlignment {
    return this.args.align ?? 'bottom';
  }

  get feedback() {
    return this.args.feedback ?? 'Copied!';
  }

  get iconDescription() {
    return this.args.iconDescription ?? 'Copy to clipboard';
  }

  get isOpen() {
    return this.didCopy || this.isHovered;
  }

  get label() {
    return this.didCopy ? this.feedback : this.iconDescription;
  }

  show = () => {
    this.isHovered = true;
  };

  hide = () => {
    this.isHovered = false;
  };

  @action
  captureCarbonElement(element: HTMLElement) {
    this.carbonElement = element;
  }

  hideFeedback = task({ restartable: true }, async () => {
    await timeout(this.args.feedbackTimeout ?? 2000);
    this.didCopy = false;
  });

  @action
  copyToClipboard() {
    let targetElement: any = this.options.targetElement;
    if (!targetElement && this.options.targetElementId) {
      targetElement = document.getElementById(this.options.targetElementId);
    }
    targetElement = targetElement || this.carbonElement;
    const el = document.createElement('textarea'); // Create a <textarea> element
    // Set its value to the string that you want copied
    el.value = targetElement.textContent
      .trim()
      .split('\n')
      .map((x: string) => x.trim())
      .join('\n');
    el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px'; // Move outside the screen to make it invisible
    document.body.appendChild(el); // Append the <textarea> element to the HTML document
    const selected =
      document.getSelection()!.rangeCount > 0 // Check if there is any content selected previously
        ? document.getSelection()!.getRangeAt(0) // Store selection if found
        : false; // Mark as false to know no selection existed before
    el.select(); // Select the <textarea> content
    document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el); // Remove the <textarea> element
    if (selected) {
      // If a selection existed before copying
      document.getSelection()!.removeAllRanges(); // Unselect everything on the HTML document
      document.getSelection()!.addRange(selected); // Restore the original selection
    }
    this.didCopy = true;
    void this.hideFeedback.perform();
    this.args.onClick?.();
  }

  <template>
    <Popover
      @open={{this.isOpen}}
      @align={{this.align}}
      @autoAlign={{@autoAlign}}
      @highContrast={{true}}
      class='cds--tooltip cds--icon-tooltip'
    >
      <Button
        data-copy-btn
        aria-label={{this.label}}
        aria-describedby={{this.tooltipId}}
        tabindex='0'
        @type='primary'
        @size='md'
        @iconOnly={{true}}
        @disabled={{@disabled}}
        @onClick={{this.copyToClipboard}}
        class='cds--copy
          {{if @inline "cds--snippet cds--snippet--inline" "cds--copy-btn"}}'
        ...attributes
        {{on 'mouseenter' this.show}}
        {{on 'mouseleave' this.hide}}
        {{on 'focusin' this.show}}
        {{on 'focusout' this.hide}}
        {{captureElement onInsert=this.captureCarbonElement}}
      >
        {{#if (has-block)}}
          <code>
            {{~yield~}}
          </code>
        {{/if}}
        {{#unless @inline}}
          <svg
            class='cds--snippet__icon'
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 16 16'
          >
            <path d='M1 10H0V2C0 .9.9 0 2 0h8v1H2c-.6 0-1 .5-1 1v8z' />
            <path
              d='M11 4.2V8h3.8L11 4.2zM15 9h-4c-.6 0-1-.4-1-1V4H4.5c-.3 0-.5.2-.5.5v10c0 .3.2.5.5.5h10c.3 0 .5-.2.5-.5V9zm-4-6c.1 0 .3.1.4.1l4.5 4.5c0
              .1.1.3.1.4v6.5c0 .8-.7 1.5-1.5 1.5h-10c-.8 0-1.5-.7-1.5-1.5v-10C3 3.7 3.7 3 4.5 3H11z'
            />
          </svg>
        {{/unless}}
      </Button>
      <PopoverContent
        id={{this.tooltipId}}
        role='tooltip'
        class='cds--tooltip-content'
        aria-hidden={{if this.isOpen 'false' 'true'}}
      >
        {{this.label}}
      </PopoverContent>
    </Popover>
  </template>
}
