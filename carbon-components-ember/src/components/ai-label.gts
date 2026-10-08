/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';

import AILabelActions from './ai-label/-actions.gts';
import AILabelContent from './ai-label/-content.gts';
import Button from './button.gts';
import Undo from './icons/undo.ts';
import Toggletip from './toggletip.gts';

import type { ToggletipAlignment } from './toggletip.gts';
import type { WithBoundArgs } from '@glint/template';

export type AILabelSize = 'mini' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AILabelSignature {
  Element: HTMLDivElement;
  Args: {
    /** The text in the label's button. Defaults to `AI`. */
    aiText?: string;
    /**
     * With `@kind="inline"`, text shown after `@aiText`, which then also names
     * the button.
     */
    textLabel?: string;
    /** `default` is a small tag-like button; `inline` sits in running text. */
    kind?: 'default' | 'inline';
    /** Defaults to `xs`. Components that host an AI label pass their own. */
    size?: AILabelSize;
    /** Where the label's content opens relative to its button. */
    align?: ToggletipAlignment;
    /** Opens the content on first render. */
    defaultOpen?: boolean;
    /**
     * Read after `@aiText` to name the button. Defaults to
     * `Show information`.
     */
    ariaLabel?: string;
    /**
     * Shows a button that reverts AI-changed content, in place of the label,
     * for when the user has edited it.
     */
    revertActive?: boolean;
    /** Names the revert button. Defaults to `Revert to AI input`. */
    revertLabel?: string;
    onRevertClick?: () => void;
  };
  Blocks: {
    default: [
      {
        Content: WithBoundArgs<typeof AILabelContent, 'Content'>;
        Actions: typeof AILabelActions;
      },
    ];
  };
}

/**
 * Marks AI-generated content. Its button opens a toggletip explaining how AI
 * was used: put that explanation in the yielded `Content`, and any buttons in
 * `Actions` inside it.
 */
export default class AILabel extends Component<AILabelSignature> {
  id = guidFor(this);

  get aiText() {
    return this.args.aiText ?? 'AI';
  }

  get kind() {
    return this.args.kind ?? 'default';
  }

  get size() {
    return this.args.size ?? 'xs';
  }

  get inlineText() {
    return this.kind === 'inline' ? this.args.textLabel : undefined;
  }

  // An inline label's visible text names it; a default one reads its
  // `@aiText` followed by `@textLabel` or `@ariaLabel`.
  get buttonLabel() {
    if (this.kind === 'inline') return '';

    return `${this.aiText} ${this.args.textLabel ?? this.args.ariaLabel ?? 'Show information'}`;
  }

  get buttonClasses() {
    const classes = [
      'cds--ai-label__button',
      `cds--ai-label__button--${this.size}`,
      `cds--ai-label__button--${this.kind}`,
    ];

    if (this.inlineText)
      classes.push('cds--ai-label__button--inline-with-content');

    return classes.join(' ');
  }

  <template>
    <div
      id={{this.id}}
      class="cds--ai-label {{if @revertActive 'cds--ai-label--revert'}}"
      ...attributes
    >
      {{#if @revertActive}}
        <Button
          @iconOnly={{true}}
          @ghost={{true}}
          @size="sm"
          @onClick={{@onRevertClick}}
          aria-label={{if @revertLabel @revertLabel "Revert to AI input"}}
        >
          <Undo @size="16" />
        </Button>
      {{else}}
        <Toggletip
          @align={{@align}}
          @defaultOpen={{@defaultOpen}}
          as |toggletip|
        >
          <toggletip.Button
            @label={{this.buttonLabel}}
            class={{this.buttonClasses}}
          >
            <span class="cds--ai-label__text">{{this.aiText}}</span>
            {{#if this.inlineText}}
              <span class="cds--ai-label__additional-text">
                {{this.inlineText}}
              </span>
            {{/if}}
          </toggletip.Button>
          {{yield
            (hash
              Content=(component AILabelContent Content=toggletip.Content)
              Actions=AILabelActions
            )
          }}
        </Toggletip>
      {{/if}}
    </div>
  </template>
}
