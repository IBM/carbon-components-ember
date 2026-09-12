/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import { ChevronDown } from '../../icons.ts';
import AiChatTruncatedText from './truncated-text.gts';

export type Args = {
  titleText?: string;
  subTitleText?: string;
  /**
   * When `true`, the header renders as a `<details>`/`<summary>` that
   * starts collapsed and can be toggled open. When `false` (the default),
   * the header always renders fully expanded.
   */
  collapsible?: boolean;
  /** Called with the new open state whenever a collapsible header is toggled. */
  onToggle?: (open: boolean) => void;
};

export interface WorkspaceShellHeaderSignature {
  Element: HTMLDivElement | HTMLDetailsElement;
  Args: Args;
  Blocks: {
    /** Extra description content, rendered after `@subTitleText`. */
    headerDescription: [];
    /** Action content (e.g. buttons), rendered outside the collapsible area. */
    headerAction: [];
  };
}

const watchToggle = modifier((element: HTMLDetailsElement, [onToggle]: [((open: boolean) => void) | undefined]) => {
  const handler = () => onToggle?.(element.open);
  element.addEventListener('toggle', handler);
  return () => element.removeEventListener('toggle', handler);
});

/**
 * The header section of a `WorkspaceShell`: a title, an optional
 * subtitle/description, and action content - optionally collapsible.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-workspace-shell-header`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/workspace-shell).
 * Doesn't collide with any Carbon React component name, so it stays
 * unprefixed.
 */
export default class WorkspaceShellHeader extends Component<WorkspaceShellHeaderSignature> {
  @action
  handleToggle(open: boolean) {
    this.args.onToggle?.(open);
  }

  <template>
    {{#if @collapsible}}
      <details class='cds-aichat-workspace-shell__header-details cds-aichat-workspace-shell__header-content' ...attributes {{watchToggle this.handleToggle}}>
        <summary class='cds-aichat-workspace-shell__header-summary'>
          {{#if @titleText}}
            <h1 class='cds-aichat-workspace-shell__header-title'>
              <AiChatTruncatedText @value={{@titleText}} @lines={{1}} @type='tooltip' />
            </h1>
          {{/if}}
          <span class='cds-aichat-workspace-shell__header-chevron'>
            <ChevronDown @size='16' />
          </span>
        </summary>
        <div class='cds-aichat-workspace-shell__header-content'>
          {{#if @subTitleText}}
            <h2 class='cds-aichat-workspace-shell__header-sub-title'>{{@subTitleText}}</h2>
          {{/if}}
          {{yield to='headerDescription'}}
          {{yield to='headerAction'}}
        </div>
      </details>
    {{else}}
      <div class='cds-aichat-workspace-shell__header' ...attributes>
        <div class='cds-aichat-workspace-shell__header-content'>
          {{#if @titleText}}
            <h1 class='cds-aichat-workspace-shell__header-title'>
              <AiChatTruncatedText @value={{@titleText}} @lines={{1}} @type='tooltip' />
            </h1>
          {{/if}}
          {{#if @subTitleText}}
            <h2 class='cds-aichat-workspace-shell__header-sub-title'>{{@subTitleText}}</h2>
          {{/if}}
          {{yield to='headerDescription'}}
        </div>
        {{yield to='headerAction'}}
      </div>
    {{/if}}
  </template>
}
