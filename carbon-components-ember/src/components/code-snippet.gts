import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { defaultArgs } from '../utils/decorators.ts';
import CopyButton from '../components/copy-button.gts';
import { modifier } from 'ember-modifier';
import style from 'ember-style-modifier';
import { observeResize } from '../utils/resize-observer.ts';
import type { TOC } from '@ember/component/template-only';

export interface CodeSnippetSignature {
  Args: {
    type: 'default' | 'multiline' | 'inline';
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

const captureElement = modifier<{
  Element: HTMLElement;
  Args: { Named: { onInsert: (element: Element) => void } };
}>((element, _positional, { onInsert }) => {
  onInsert(element);
});

interface PreCodeSignature {
  Element: HTMLElement;
  Args: { multiline?: boolean; heights?: Record<string, string> };
  Blocks: { default: [] };
}

// As Carbon React: a multi-line snippet's `<pre>` is the focusable,
// read-only textbox, so its scrollable content is keyboard reachable.
const PreCode: TOC<PreCodeSignature> = <template>
  <pre
    role={{if @multiline "textbox"}}
    tabindex={{if @multiline "0"}}
    aria-label={{if @multiline "Code Snippet Text"}}
    aria-readonly={{if @multiline "true"}}
    aria-multiline={{if @multiline "true"}}
    {{style @heights}}
  >
    {{~noop~}}
    <code ...attributes>
      {{~yield~}}
    </code>
    {{~noop~}}
  </pre>
</template>;

export default class CodeSnippet extends Component<CodeSnippetSignature> {
  @tracked expanded = false;
  @tracked codeElement?: Element;
  @tracked carbonElement?: Element;

  setCodeElement = (element: Element) => {
    this.codeElement = element;
  };

  setCarbonElement = (element: Element) => {
    this.carbonElement = element;
  };

  @tracked showMoreLess = false;

  toggleExpanded = () => {
    this.expanded = !this.expanded;
  };

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

  // Carbon React sets these inline, on the container and the <pre>.
  get heights() {
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
  measureCode = modifier((code: HTMLElement) =>
    observeResize(code.parentElement ?? code, () => {
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
    }),
  );

  @defaultArgs
  args: CodeSnippetSignature['Args'] = {
    type: 'default',
  };

  <template>
    {{#if (eq @type "default")}}
      <div class="cds--snippet cds--snippet--single">
        {{! As Carbon React: the single-line container is a focusable,
          read-only textbox, so its horizontally scrolling content is
          keyboard reachable. }}
        <div
          class="cds--snippet-container"
          role="textbox"
          tabindex="0"
          aria-label="Code Snippet Text"
          aria-readonly="true"
        >
          <PreCode {{captureElement onInsert=this.setCarbonElement}}>
            {{~yield~}}
          </PreCode>
        </div>
        <CopyButton @targetElement={{this.carbonElement}} />
      </div>
    {{/if}}
    {{#if (eq @type "multiline")}}
      <div
        class="cds--snippet cds--snippet--multi
          {{if this.expanded 'cds--snippet--expand'}}"
        data-code-snippet
      >
        <div class="cds--snippet-container" {{style this.heights}}>
          <PreCode
            @multiline={{true}}
            @heights={{this.heights}}
            {{captureElement onInsert=this.setCodeElement}}
            {{this.measureCode}}
          >
            {{~yield~}}
          </PreCode>
        </div>
        <div class="cds--snippet__overflow-indicator--right"></div>
        <CopyButton @targetElement={{this.codeElement}} />
        {{#if this.showMoreLess}}
          <button
            {{on "click" this.toggleExpanded}}
            class="cds--btn cds--btn--ghost cds--btn--sm cds--snippet-btn--expand"
            type="button"
          >
            <span class="cds--snippet-btn--text">{{this.expandText}}</span>
            <svg
              class="cds--icon-chevron--down"
              width="12"
              height="7"
              viewBox="0 0 12 7"
              aria-hidden="true"
            >
              <path
                fill-rule="nonzero"
                d="M6.002 5.55L11.27 0l.726.685L6.003 7 0 .685.726 0z"
              />
            </svg>
          </button>
        {{/if}}
      </div>
    {{/if}}
    {{#if (eq @type "inline")}}
      <CopyButton @inline={{true}}>
        {{~yield~}}
      </CopyButton>
    {{/if}}
  </template>
}
