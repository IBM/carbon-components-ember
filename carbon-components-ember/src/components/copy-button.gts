import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import { task, timeout } from 'ember-concurrency';
import copyToClipboard from '../modifiers/copy-to-clipboard.ts';
import { textOf } from '../utils/clipboard.ts';
import Popover, { PopoverContent } from './popover.gts';
import type { PopoverAlignment } from './popover.gts';
import ButtonBase from './-private/button-base.gts';
import type { ButtonSignature } from '../components/button.gts';

export interface CopyButtonSignature {
  Args: {
    targetElementId?: string;
    targetElement?: Element;
    inline?: boolean;
    align?: PopoverAlignment;
    autoAlign?: boolean;
    disabled?: boolean;
    feedback?: string;
    feedbackTimeout?: number;
    iconDescription?: string;
  };
  Element: ButtonSignature['Element'];
  Blocks: {
    default: [];
  };
}

const captureElement = modifier<{
  Element: HTMLElement;
  Args: { Named: { onInsert: (element: HTMLElement) => void } };
}>((element, _positional, { onInsert }) => {
  onInsert(element);
});

// Drops the template's own indentation around the copied text, keeping the
// code's.
function dedent(text: string) {
  const lines = text
    .replace(/^\s*\n/, '')
    .trimEnd()
    .split('\n');
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => /^[ \t]*/.exec(line)![0].length);
  const indent = Math.min(...indents, Infinity);
  return lines
    .map((line) => line.slice(Number.isFinite(indent) ? indent : 0))
    .join('\n');
}

export default class CopyButton extends Component<CopyButtonSignature> {
  @tracked didCopy: boolean = false;
  @tracked isHovered: boolean = false;
  codeElement?: HTMLElement;

  tooltipId = `${guidFor(this)}-copy-btn-tooltip`;

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

  captureCodeElement = (element: HTMLElement) => {
    this.codeElement = element;
  };

  hideFeedback = task({ restartable: true }, async () => {
    await timeout(this.args.feedbackTimeout ?? 2000);
    this.didCopy = false;
  });

  textToCopy = () => {
    const target =
      this.args.targetElement ??
      (this.args.targetElementId
        ? document.getElementById(this.args.targetElementId)
        : null) ??
      this.codeElement;
    return target ? dedent(textOf(target)) : '';
  };

  showFeedback = () => {
    this.didCopy = true;
    void this.hideFeedback.perform();
  };

  <template>
    <Popover
      @open={{this.isOpen}}
      @align={{this.align}}
      @autoAlign={{@autoAlign}}
      @highContrast={{true}}
      class="cds--tooltip cds--icon-tooltip"
    >
      <ButtonBase
        @kind="primary"
        @hasIconOnly={{true}}
        @size="md"
        @disabled={{@disabled}}
        aria-label={{this.label}}
        data-copy-btn
        aria-describedby={{this.tooltipId}}
        tabindex="0"
        class="cds--copy
          {{if @inline 'cds--snippet cds--snippet--inline' 'cds--copy-btn'}}"
        ...attributes
        {{on "mouseenter" this.show}}
        {{on "mouseleave" this.hide}}
        {{on "focusin" this.show}}
        {{on "focusout" this.hide}}
        {{copyToClipboard text=this.textToCopy onSuccess=this.showFeedback}}
      >
        {{#if (has-block)}}
          <code
            class={{unless @inline "cds--visually-hidden"}}
            {{captureElement onInsert=this.captureCodeElement}}
          >
            {{~yield~}}
          </code>
        {{/if}}
        {{#unless @inline}}
          <svg
            class="cds--snippet__icon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path d="M1 10H0V2C0 .9.9 0 2 0h8v1H2c-.6 0-1 .5-1 1v8z" />
            <path
              d="M11 4.2V8h3.8L11 4.2zM15 9h-4c-.6 0-1-.4-1-1V4H4.5c-.3 0-.5.2-.5.5v10c0 .3.2.5.5.5h10c.3 0 .5-.2.5-.5V9zm-4-6c.1 0 .3.1.4.1l4.5 4.5c0
              .1.1.3.1.4v6.5c0 .8-.7 1.5-1.5 1.5h-10c-.8 0-1.5-.7-1.5-1.5v-10C3 3.7 3.7 3 4.5 3H11z"
            />
          </svg>
        {{/unless}}
      </ButtonBase>
      <PopoverContent
        id={{this.tooltipId}}
        role="tooltip"
        class="cds--tooltip-content"
        aria-hidden={{if this.isOpen "false" "true"}}
      >
        {{this.label}}
      </PopoverContent>
    </Popover>
  </template>
}
