/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export type Args = {
  /** Reflects to a class so consumer CSS can target the rounded variant. */
  rounded?: boolean;
  /**
   * Expanded layout: the editor fills its own full-width row, with the
   * message actions and send control on a second row beneath it. The
   * reflow is driven purely by a container class — the rendered DOM is
   * identical in both modes.
   */
  expanded?: boolean;
  hasError?: boolean;
  disabled?: boolean;
  /**
   * Whether the `<:fileUploads>` block currently has real uploads to show.
   * Upstream derives this by watching the slotted file-uploads element's
   * own `has-uploads` attribute via a `MutationObserver`; Ember has no
   * equivalent DOM-introspection hook for a block's rendered content, so
   * this port takes it as a plain controlled arg instead — pass it
   * straight through from whatever tracks the upload list.
   */
  hasFileUploads?: boolean;
};

export interface PromptLineShellSignature {
  Element: HTMLDivElement;
  Args: Args;
  Blocks: {
    /** A `PromptLine` (or equivalent) the caller owns directly; no fallback is rendered. */
    editor: [];
    /** Action icons beside the text area. */
    messageActions: [];
    /** Visual list of files being uploaded. */
    fileUploads: [];
    /** Suggestion overlay above the input. */
    autocompleteContent: [];
    /** Inline error / status content beneath the autocomplete row. */
    fieldMessaging: [];
    /** Send / stop-streaming button. */
    sendControl: [];
  };
}

/**
 * Layout-only composer chrome for the chat input. Defines six named blocks
 * and the spacing/border treatment around them — it carries no chat-domain
 * logic and forwards no editor methods.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-prompt-line-shell`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/prompt-line).
 * Doesn't collide with any Carbon React component name, so it stays
 * unprefixed. Upstream's five kebab-case slots become six camelCase named
 * blocks here (`message-actions` → `<:messageActions>`, etc.) — the extra
 * one, `editor`, is unnamed upstream's own JSDoc but is a real slot in its
 * implementation.
 *
 * Also not reproduced: the keyboard-vs-pointer focus-ring class upstream
 * derives from `cds-aichat-prompt-focus`'s event detail (see `PromptLine`'s
 * class doc for why) — the base `:focus-within` rule still gives a visible
 * focus outline in the non-expanded layout.
 */
export default class PromptLineShell extends Component<PromptLineShellSignature> {
  get hasFileUploads() {
    return Boolean(this.args.hasFileUploads);
  }

  <template>
    <div
      class='cds-aichat-prompt-line-shell
        {{if @rounded "cds-aichat-prompt-line-shell--rounded"}}
        {{if @expanded "cds-aichat-prompt-line-shell--expanded"}}
        {{if @hasError "cds-aichat-prompt-line-shell--has-error"}}
        {{if @disabled "cds-aichat-prompt-line-shell--disabled"}}'
      ...attributes
    >
      <div
        class='cds-aichat-prompt-line-shell__input-container
          {{if (has-block "messageActions") "cds-aichat-prompt-line-shell__input-container--has-message-actions"}}
          {{if @expanded "cds-aichat-prompt-line-shell__input-container--expanded"}}'
      >
        <div
          class='cds-aichat-prompt-line-shell__uploads-and-autocomplete
            {{if this.hasFileUploads "cds-aichat-prompt-line-shell__uploads-and-autocomplete--has-uploads"}}'
        >
          {{#if (has-block "fileUploads")}}
            <div class='cds-aichat-prompt-line-shell__file-uploads'>
              {{yield to='fileUploads'}}
            </div>
          {{/if}}
          {{#if (has-block "autocompleteContent")}}
            <div class='cds-aichat-prompt-line-shell__autocomplete-content'>
              {{yield to='autocompleteContent'}}
            </div>
          {{/if}}
        </div>
        <div class='cds-aichat-prompt-line-shell__field-messaging'>
          {{yield to='fieldMessaging'}}
        </div>
        <div class='cds-aichat-prompt-line-shell__text-and-actions'>
          <div class='cds-aichat-prompt-line-shell__message-actions'>
            {{yield to='messageActions'}}
          </div>
          <div class='cds-aichat-prompt-line-shell__text-area'>
            {{yield to='editor'}}
          </div>
        </div>
        <div class='cds-aichat-prompt-line-shell__send-control'>
          {{yield to='sendControl'}}
        </div>
      </div>
    </div>
  </template>
}
