import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import { task, timeout } from 'ember-concurrency';
import copyToClipboard from '../modifiers/copy-to-clipboard.ts';
import { textOf } from '../utils/clipboard.ts';
import CopyTrigger from './-private/copy-trigger.gts';
import CopyIcon from './icons/copy.ts';
import { LayoutConstraint } from './layout.gts';
import type { ButtonSignature } from './button.gts';
import type { PopoverAlignment } from './popover.gts';

export interface CopyButtonSignature {
  Args: {
    targetElementId?: string;
    targetElement?: Element;
    /** Renders an inline CodeSnippet's button: the block as its content, with the snippet's classes. */
    inline?: boolean;
    align?: PopoverAlignment;
    autoAlign?: boolean;
    disabled?: boolean;
    feedback?: string;
    feedbackTimeout?: number;
    iconDescription?: string;
    /** The button's size. Defaults to `'md'`, and to none when `@inline`. */
    size?: ButtonSignature['Args']['size'];
    /** The text to copy, instead of the target's or the block's. */
    copyText?: string;
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

// As Carbon React's CopyButton.
const SIZE = { default: 'md', max: 'lg' } as const;

export default class CopyButton extends Component<CopyButtonSignature> {
  @tracked didCopy: boolean = false;
  codeElement?: HTMLElement;

  codeId = `${guidFor(this)}-code`;

  get align(): PopoverAlignment {
    return this.args.align ?? 'bottom';
  }

  get feedbackTimeout() {
    return this.args.feedbackTimeout ?? 2000;
  }

  get size() {
    return this.args.size ?? (this.args.inline ? undefined : 'md');
  }

  get label() {
    return this.didCopy
      ? (this.args.feedback ?? 'Copied!')
      : (this.args.iconDescription ?? 'Copy to clipboard');
  }

  // As Carbon React: the feedback stays up for its timeout after the
  // pointer leaves.
  get leaveDelayMs() {
    return this.didCopy ? this.feedbackTimeout : 100;
  }

  captureCodeElement = (element: HTMLElement) => {
    this.codeElement = element;
  };

  hideFeedback = task({ restartable: true }, async () => {
    await timeout(this.feedbackTimeout);
    this.didCopy = false;
  });

  textToCopy = () => {
    if (this.args.copyText !== undefined) return this.args.copyText;
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
    {{#if @inline}}
      <CopyTrigger
        @align={{this.align}}
        @autoAlign={{@autoAlign}}
        @disabled={{@disabled}}
        @label={{this.label}}
        @leaveDelayMs={{this.leaveDelayMs}}
        @size={{this.size}}
        class="cds--snippet cds--snippet--inline"
        aria-describedby={{this.codeId}}
        ...attributes
        {{copyToClipboard text=this.textToCopy onSuccess=this.showFeedback}}
      >
        <code
          id={{this.codeId}}
          {{captureElement onInsert=this.captureCodeElement}}
        >
          {{~yield~}}
        </code>
      </CopyTrigger>
    {{else}}
      <LayoutConstraint @size={{SIZE}}>
        <CopyTrigger
          @align={{this.align}}
          @autoAlign={{@autoAlign}}
          @disabled={{@disabled}}
          @label={{this.label}}
          @leaveDelayMs={{this.leaveDelayMs}}
          @size={{this.size}}
          class="cds--copy-btn"
          ...attributes
          {{copyToClipboard text=this.textToCopy onSuccess=this.showFeedback}}
        >
          {{#if (has-block)}}
            <code
              class="cds--visually-hidden"
              {{captureElement onInsert=this.captureCodeElement}}
            >
              {{~yield~}}
            </code>
          {{/if}}
          <CopyIcon @svgClass="cds--snippet__icon" />
        </CopyTrigger>
      </LayoutConstraint>
    {{/if}}
  </template>
}
