import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { defaultArgs } from '../utils/decorators.ts';
import CopyButton from '../components/copy-button.gts';
import { concat, fn } from '@ember/helper';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import eq from 'ember-truth-helpers/helpers/eq';
import { on } from '@ember/modifier';
import set from '../helpers/set.ts';
import not from 'ember-truth-helpers/helpers/not';
import htmlSafe from '../helpers/html-safe.ts';
import { type TemplateOnlyComponent } from '@ember/component/template-only';

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

const PreCode: TemplateOnlyComponent<{
  Element: HTMLElement;
  Blocks: { default: [] };
}> = <template>
  <pre>
    {{~noop~}}
    <code ...attributes>
      {{~yield~}}
    </code>
    {{~noop~}}
  </pre>
</template>;

export default class CarbonCodeSnippet extends Component<CarbonCodeSnippetSignature> {
  @tracked expanded = false;
  codeElement?: Element;
  carbonElement?: Element;

  @defaultArgs
  args: Args = {
    type: 'default',
  };

  <template>
    {{#if (eq @type 'default')}}
      <div class='cds--snippet cds--snippet--single'>
        <div class='cds--snippet-container' aria-label='Code Snippet Text'>
          <PreCode {{didInsert (set this 'carbonElement')}}>
            {{~yield~}}
          </PreCode>
        </div>
        <span
          class='cds--popover-container cds--popover--caret cds--popover--high-contrast cds--popover--bottom cds--tooltip cds--icon-tooltip'
        >
          <CopyButton @targetElement={{this.carbonElement}} />
        </span>
      </div>
    {{/if}}
    {{#if (eq @type 'multiline')}}
      <div
        class='cds--snippet cds--snippet--multi
          {{if this.expanded "cds--snippet--expand"}}'
        data-code-snippet
      >
        <div
          class='cds--snippet-container'
          aria-label='Code Snippet Text'
          style={{htmlSafe
            (concat
              'width: 100%; min-height: 48px;'
              (unless this.expanded 'max-height: 240px;')
            )
          }}
        >
          <PreCode {{didInsert (set this 'codeElement')}}>
            {{~yield~}}
          </PreCode>
        </div>
        <div class='cds--snippet__overflow-indicator--right'></div>
        <span
          class='cds--popover-container cds--popover--caret cds--popover--high-contrast cds--popover--bottom cds--tooltip cds--icon-tooltip'
        >
          <CopyButton @targetElement={{this.codeElement}} />
        </span>
        <button
          {{on 'click' (fn (set this 'expanded') (not this.expanded))}}
          class='cds--btn cds--btn--ghost cds--btn--sm cds--snippet-btn--expand'
          type='button'
        >
          <span
            class='cds--snippet-btn--text'
            data-show-more-text='Show more'
            data-show-less-text='Show less'
          >
            Show more
          </span>
          <svg
            class='cds--icon-chevron--down'
            width='12'
            height='7'
            viewBox='0 0 12 7'
            aria-label='Show more icon'
          >
            <title>
              Show more icon
            </title>
            <path
              fill-rule='nonzero'
              d='M6.002 5.55L11.27 0l.726.685L6.003 7 0 .685.726 0z'
            />
          </svg>
        </button>
      </div>
    {{/if}}
    {{#if (eq @type 'inline')}}
      <CopyButton @inline={{true}}>
        {{~yield~}}
      </CopyButton>
    {{/if}}
  </template>
}
