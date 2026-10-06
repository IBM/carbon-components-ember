import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { defaultArgs } from '../utils/decorators.ts';
import CopyButton from '../components/copy-button.gts';
import { concat } from '@ember/helper';
import { modifier as eModifier } from 'ember-modifier';
import { htmlSafe } from '@ember/template';
import type { TemplateOnlyComponent } from '@ember/component/template-only';

export type Args = {
  type: 'default' | 'multiline' | 'inline';
};

export interface CarbonCodeSnippetSignature {
  Args: Args;
  Blocks: {
    default: [];
  };
}

const noop = () => '';

const captureElement = eModifier<{
  Element: HTMLElement;
  Args: { Named: { onInsert: (element: Element) => void } };
}>((element, _positional, { onInsert }) => {
  onInsert(element);
});

// As Carbon React: a multi-line snippet's `<pre>` is the focusable,
// read-only textbox, so its scrollable content is keyboard reachable.
const PreCode: TemplateOnlyComponent<{
  Element: HTMLElement;
  Args: { multiline?: boolean };
  Blocks: { default: [] };
}> = <template>
  <pre
    role={{if @multiline "textbox"}}
    tabindex={{if @multiline "0"}}
    aria-label={{if @multiline "Code Snippet Text"}}
    aria-readonly={{if @multiline "true"}}
    aria-multiline={{if @multiline "true"}}
  >
    {{~noop~}}
    <code ...attributes>
      {{~yield~}}
    </code>
    {{~noop~}}
  </pre>
</template>;

export default class CarbonCodeSnippet extends Component<CarbonCodeSnippetSignature> {
  @tracked expanded = false;
  @tracked codeElement?: Element;
  @tracked carbonElement?: Element;

  setCodeElement = (element: Element) => {
    this.codeElement = element;
  };

  setCarbonElement = (element: Element) => {
    this.carbonElement = element;
  };

  toggleExpanded = () => {
    this.expanded = !this.expanded;
  };

  @defaultArgs
  args: Args = {
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
        <div
          class="cds--snippet-container"
          style={{htmlSafe
            (concat
              "width: 100%; min-height: 48px;"
              (unless this.expanded "max-height: 240px;")
            )
          }}
        >
          <PreCode
            @multiline={{true}}
            {{captureElement onInsert=this.setCodeElement}}
          >
            {{~yield~}}
          </PreCode>
        </div>
        <div class="cds--snippet__overflow-indicator--right"></div>
        <CopyButton @targetElement={{this.codeElement}} />
        <button
          {{on "click" this.toggleExpanded}}
          class="cds--btn cds--btn--ghost cds--btn--sm cds--snippet-btn--expand"
          type="button"
        >
          <span
            class="cds--snippet-btn--text"
            data-show-more-text="Show more"
            data-show-less-text="Show less"
          >
            Show more
          </span>
          <svg
            class="cds--icon-chevron--down"
            width="12"
            height="7"
            viewBox="0 0 12 7"
            aria-label="Show more icon"
          >
            <title>
              Show more icon
            </title>
            <path
              fill-rule="nonzero"
              d="M6.002 5.55L11.27 0l.726.685L6.003 7 0 .685.726 0z"
            />
          </svg>
        </button>
      </div>
    {{/if}}
    {{#if (eq @type "inline")}}
      <CopyButton @inline={{true}}>
        {{~yield~}}
      </CopyButton>
    {{/if}}
  </template>
}
