import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import EmberTooltip from 'ember-tooltips/components/ember-tooltip';
import Button from '../components/button.gts';
import or from '../helpers/or.ts';

type Args = {
  targetElementId?: string;
  targetElement?: Element;
  inline?: boolean;
};

export interface CarbonCopyButtonSignature {
  Args: Args;
  Element: null;
  Blocks: {
    default: [];
  };
}

export default class CarbonCopyButton extends Component<CarbonCopyButtonSignature> {
  <template>
    {{#if (or @targetElement @targetElementId)}}
      <Button
        data-copy-btn
        aria-label='Copy code'
        tabindex='0'
        @type='primary'
        @size='md'
        @iconOnly={{true}}
        @onClick={{this.copyToClipboard}}
        class='cds--copy
          {{if @inline "cds--snippet cds--snippet--inline" "cds--copy-btn"}}'
        {{didInsert this.loadCarbonComponent}}
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
        <EmberTooltip @event='{{if this.didCopy "none" "hover"}}'>
          {{#if this.didCopy}}
            Copied!
          {{else}}
            Copy to clipboard
          {{/if}}
        </EmberTooltip>
      </Button>
    {{else}}
      <Button
        data-copy-btn
        aria-label='Copy code'
        tabindex='0'
        @type='primary'
        @size='md'
        @iconOnly={{true}}
        @onClick={{this.copyToClipboard}}
        class='cds--copy
          {{if @inline "cds--snippet cds--snippet--inline" "cds--copy-btn"}}'
        {{didInsert this.loadCarbonComponent}}
      >
        {{~#if (has-block)}}
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
              d='M11 4.2V8h3.8L11 4.2zM15 9h-4c-.6 0-1-.4-1-1V4H4.5c-.3 0-.5.2-.5.5v10c0
              .3.2.5.5.5h10c.3 0 .5-.2.5-.5V9zm-4-6c.1 0 .3.1.4.1l4.5 4.5c0 .1.1.3.1.4v6.5c0 .8-.7 1.5-1.5 1.5h-10c-.8 0-1.5-.7-1.5-1.5v-10C3 3.7 3.7 3 4.5 3H11z'
            />
          </svg>
        {{/unless}}
        <EmberTooltip
          @isShown={{this.didCopy}}
          @event={{if this.didCopy 'none' 'hover'}}
        >
          {{#if this.didCopy}}
            Copied!
          {{else}}
            Copy to clipboard
          {{/if}}
        </EmberTooltip>
      </Button>
    {{/if}}
  </template>

  carbonElement: any;
  @tracked didCopy: boolean = false;
  get options() {
    return {
      targetElement: this.args.targetElement,
      targetElementId: this.args.targetElementId,
    };
  }

  @action
  loadCarbonComponent(carbonElement: HTMLElement) {
    this.carbonElement = carbonElement;
  }

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
    setTimeout(() => {
      this.didCopy = false;
    }, 3000);
  }
}
