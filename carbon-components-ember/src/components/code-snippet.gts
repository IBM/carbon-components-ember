import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import style from 'ember-style-modifier';
import Button from './button.gts';
import CopyButton from './copy-button.gts';
import ChevronDown from './icons/chevron-down.ts';
import { observeResize } from '../utils/resize-observer.ts';
import './code-snippet.scss';
import type { CopyButtonSignature } from './copy-button.gts';
import type { PopoverAlignment } from './popover.gts';

export interface CodeSnippetSignature {
  Element: HTMLDivElement | HTMLSpanElement | CopyButtonSignature['Element'];
  Args: {
    /** The variant: `single` (one line, the default), `multi` or `inline`. */
    type?: 'single' | 'multi' | 'inline';
    /** How the copy button's tooltip aligns with it. Defaults to `'bottom'`. */
    align?: PopoverAlignment;
    /** **Experimental**: keeps the copy button's tooltip in view. */
    autoAlign?: boolean;
    /**
     * Labels the code's textbox, or an inline snippet's copy button.
     * Defaults to `'Copy to clipboard'`, as in Carbon React.
     */
    ariaLabel?: string;
    /** The copy button's description. Defaults to `'Copy to clipboard'`. */
    copyButtonDescription?: string;
    /** The text to copy, instead of the code's. */
    copyText?: string;
    /** Disables the copy and Show more buttons, and takes the code out of the tab order. */
    disabled?: boolean;
    /** Shown once the code is copied. Defaults to `'Copied!'`. */
    feedback?: string;
    /** How long the feedback shows, in milliseconds. Defaults to `2000`. */
    feedbackTimeout?: number;
    /** Leaves out the copy button. */
    hideCopyButton?: boolean;
    /** Called when the copy button is clicked. */
    onClick?: (event: MouseEvent) => void;
    /** Wraps long lines instead of scrolling them. */
    wrapText?: boolean;
    /**
     * The most rows a collapsed multi-line snippet shows; longer code gets
     * a Show more button. `0` removes the limit. Defaults to `15`.
     */
    maxCollapsedNumberOfRows?: number;
    /**
     * The most rows an expanded multi-line snippet shows; at or below
     * `@maxCollapsedNumberOfRows`, there's no Show more. Defaults to `0`, no
     * limit.
     */
    maxExpandedNumberOfRows?: number;
    /** The fewest rows a collapsed multi-line snippet takes. Defaults to `3`. */
    minCollapsedNumberOfRows?: number;
    /** The fewest rows an expanded multi-line snippet takes. Defaults to `16`. */
    minExpandedNumberOfRows?: number;
    /** The Show more button's text while collapsed. Defaults to `'Show more'`. */
    showMoreText?: string;
    /** The Show more button's text while expanded. Defaults to `'Show less'`. */
    showLessText?: string;
  };
  Blocks: {
    default: [];
  };
}

const noop = () => '';

// Carbon React's row height, which the row limits multiply.
const ROW_HEIGHT = 16;

export default class CodeSnippet extends Component<CodeSnippetSignature> {
  @tracked expanded = false;
  @tracked codeElement?: HTMLElement;
  @tracked showMoreLess = false;

  codeId = `${guidFor(this)}-code`;

  captureCode = modifier((element: HTMLElement) => {
    this.codeElement = element;
  });

  toggleExpanded = () => {
    this.expanded = !this.expanded;
  };

  handleCopyClick = (event: MouseEvent) => {
    this.args.onClick?.(event);
  };

  get type() {
    return this.args.type ?? 'single';
  }

  get isMulti() {
    return this.type === 'multi';
  }

  // Which of the container and the <pre> takes focus; neither while disabled.
  get focusContainer() {
    return !this.isMulti && !this.args.disabled;
  }

  get focusPre() {
    return this.isMulti && !this.args.disabled;
  }

  // Only a multi-line snippet has Show more, whatever @type was before.
  get showMore() {
    return this.isMulti && this.showMoreLess;
  }

  get ariaLabel() {
    return this.args.ariaLabel ?? 'Copy to clipboard';
  }

  get maxCollapsedNumberOfRows() {
    return this.args.maxCollapsedNumberOfRows ?? 15;
  }

  get maxExpandedNumberOfRows() {
    return this.args.maxExpandedNumberOfRows ?? 0;
  }

  get minCollapsedNumberOfRows() {
    return this.args.minCollapsedNumberOfRows ?? 3;
  }

  get minExpandedNumberOfRows() {
    return this.args.minExpandedNumberOfRows ?? 16;
  }

  get expandText() {
    return this.expanded
      ? (this.args.showLessText ?? 'Show less')
      : (this.args.showMoreText ?? 'Show more');
  }

  get classes() {
    const { disabled, hideCopyButton, wrapText } = this.args;
    return [
      'cds--snippet',
      `cds--snippet--${this.type}`,
      this.type !== 'inline' && disabled && 'cds--snippet--disabled',
      this.isMulti && this.expanded && 'cds--snippet--expand',
      hideCopyButton && 'cds--snippet--no-copy',
      wrapText && 'cds--snippet--wraptext',
    ]
      .filter(Boolean)
      .join(' ');
  }

  // Carbon React sets these inline, on the container and the <pre>.
  get heights() {
    if (!this.isMulti) return {};
    const [max, min] = this.expanded
      ? [this.maxExpandedNumberOfRows, this.minExpandedNumberOfRows]
      : [this.maxCollapsedNumberOfRows, this.minCollapsedNumberOfRows];
    const heights: Record<string, string> = {};
    if (max > 0) heights['max-height'] = `${max * ROW_HEIGHT}px`;
    if (min > 0) heights['min-height'] = `${min * ROW_HEIGHT}px`;
    return heights;
  }

  // As Carbon React: Show more only when the code is taller than the
  // collapsed snippet, and an expanded snippet that fits its minimum
  // collapses. The <code> is inline, so its <pre> is what resizes, and
  // offsetHeight, unlike getBoundingClientRect, ignores transforms.
  measureCode = modifier((code: HTMLElement) => {
    if (!this.isMulti) return;
    return observeResize(code.parentElement ?? code, () => {
      const height = code.offsetHeight;
      const maxCollapsed = this.maxCollapsedNumberOfRows;
      const maxExpanded = this.maxExpandedNumberOfRows;
      const minExpanded = this.minExpandedNumberOfRows;
      this.showMoreLess =
        maxCollapsed > 0 &&
        (maxExpanded <= 0 || maxExpanded > maxCollapsed) &&
        height > maxCollapsed * ROW_HEIGHT;
      if (
        this.expanded &&
        minExpanded > 0 &&
        height <= minExpanded * ROW_HEIGHT
      ) {
        this.expanded = false;
      }
    });
  });

  <template>
    {{#if (eq this.type "inline")}}
      {{#if @hideCopyButton}}
        <span class={{this.classes}} ...attributes>
          <code id={{this.codeId}}>{{yield}}</code>
        </span>
      {{else}}
        <CopyButton
          @inline={{true}}
          @align={{@align}}
          @autoAlign={{@autoAlign}}
          @copyText={{@copyText}}
          @disabled={{@disabled}}
          @feedback={{@feedback}}
          @feedbackTimeout={{@feedbackTimeout}}
          @iconDescription={{this.ariaLabel}}
          class={{if @wrapText "cds--snippet--wraptext"}}
          ...attributes
          {{on "click" this.handleCopyClick}}
        >
          {{~yield~}}
        </CopyButton>
      {{/if}}
    {{else}}
      <div class={{this.classes}} ...attributes>
        {{! What scrolls is the focusable textbox, so a keyboard can scroll the
          code: a multi-line snippet's <pre>, unlike Carbon React's. }}
        <div
          class="cds--snippet-container"
          role={{unless this.isMulti "textbox"}}
          tabindex={{if this.focusContainer "0"}}
          aria-label={{unless this.isMulti this.ariaLabel}}
          aria-readonly={{unless this.isMulti "true"}}
          {{style this.heights}}
        >
          <pre
            role={{if this.isMulti "textbox"}}
            tabindex={{if this.focusPre "0"}}
            aria-label={{if this.isMulti this.ariaLabel}}
            aria-readonly={{if this.isMulti "true"}}
            aria-multiline={{if this.isMulti "true"}}
            {{style this.heights}}
          >
            {{~noop~}}
            <code {{this.captureCode}} {{this.measureCode}}>
              {{~yield~}}
            </code>
            {{~noop~}}
          </pre>
        </div>
        {{#unless @hideCopyButton}}
          <CopyButton
            @targetElement={{this.codeElement}}
            @align={{@align}}
            @autoAlign={{@autoAlign}}
            @copyText={{@copyText}}
            @disabled={{@disabled}}
            @feedback={{@feedback}}
            @feedbackTimeout={{@feedbackTimeout}}
            @iconDescription={{@copyButtonDescription}}
            @size={{if this.isMulti "sm" "md"}}
            {{on "click" this.handleCopyClick}}
          />
        {{/unless}}
        {{#if this.showMore}}
          <Button
            @kind="ghost"
            @size="sm"
            @disabled={{@disabled}}
            class="cds--snippet-btn--expand"
            {{on "click" this.toggleExpanded}}
          >
            <span class="cds--snippet-btn--text">{{this.expandText}}</span>
            <ChevronDown
              @svgClass="cds--icon-chevron--down cds--snippet__icon"
            />
          </Button>
        {{/if}}
      </div>
    {{/if}}
  </template>
}
