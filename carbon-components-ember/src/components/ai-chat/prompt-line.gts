/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { modifier as eModifier } from 'ember-modifier';

export type Args = {
  /** Current plain-text value. Always-controlled: typing only fires `@onChange`. */
  content?: string;
  disabled?: boolean;
  placeholder?: string;
  /** Defaults to `'Message'`. */
  ariaLabel?: string;
  testId?: string;
  autofocus?: boolean;
  /** Fires with the new value on every input. */
  onChange?: (value: string) => void;
  /**
   * Fires on plain Enter (non-empty field) or Mod-Enter (any field),
   * mirroring upstream's Enter-to-send keymap.
   */
  onSendIntent?: () => void;
};

export interface PromptLineSignature {
  Element: HTMLDivElement;
  Args: Args;
}

/**
 * The editing surface of the chat input stack — typically composed inside a
 * `PromptLineShell`'s `<:editor>` block.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-prompt-line`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/prompt-line)
 * — **textarea mode only**. Upstream defaults to a Tiptap-free `<textarea>`
 * and only loads a rich `@tiptap/*` editor when `rich` is set or
 * `ensureEditor()` is called; that rich mode (plus its `@extensions`,
 * `getEditor()`/`ensureEditor()`, `undo()`/`redo()`, `insertContent()`,
 * `setTextSelection()`) is a genuinely new runtime dependency decision (like
 * `flatpickr` for `DatePicker` or `@carbon/utilities` for `Carousel`) and is
 * deliberately out of scope here — left for a follow-up todo rather than
 * accepted as a silent no-op arg. This component only ever renders the
 * textarea surface, which is also upstream's own default.
 *
 * Also not reproduced: upstream's keyboard-vs-pointer focus-ring
 * distinction (`cds-aichat-prompt-focus`'s `keyboard` detail, which
 * `PromptLineShell`'s CSS keys off of in its expanded layout) and the
 * `cds-aichat-prompt-typing`/`cds-aichat-prompt-keydown` events, which exist
 * upstream to keep a typing-indicator and the rich-mode transfer contract in
 * sync — with only one editing surface, there's nothing to keep in sync.
 * `:focus-within` still gives a focus outline in the non-expanded layout.
 */
export default class PromptLine extends Component<PromptLineSignature> {
  get ariaLabel() {
    return this.args.ariaLabel ?? 'Message';
  }

  @action
  handleInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.syncMirror(target);
    this.args.onChange?.(target.value);
  }

  @action
  handleKeydown(event: KeyboardEvent) {
    if (event.isComposing) {
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      const target = event.target as HTMLTextAreaElement;
      const isModEnter = event.metaKey || event.ctrlKey;
      if (isModEnter || target.value !== '') {
        event.preventDefault();
        this.args.onSendIntent?.();
      }
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      (event.target as HTMLTextAreaElement).blur();
    }
  }

  syncMirror(textarea: HTMLTextAreaElement) {
    const mirror = textarea.nextElementSibling as HTMLElement | null;
    if (mirror) {
      // Trailing newline so the box grows the instant a new line starts.
      mirror.textContent = `${textarea.value}\n`;
    }
  }

  /**
   * Sets the textarea's initial value, and re-syncs it (and the auto-grow
   * mirror) on any later *external* (controlled) `@content` update.
   * `@content` is passed as the modifier's tracked positional argument, so
   * this only re-runs when that value actually changes — typing itself is
   * already kept in sync by `handleInput` and never touches `@content`
   * directly, so it can't retrigger this and clobber the caret mid-input.
   */
  syncContent = eModifier<{
    Element: HTMLTextAreaElement;
    Args: { Positional: [string | undefined] };
  }>((element, [content]) => {
    const value = content ?? '';
    if (element.value !== value) {
      element.value = value;
      this.syncMirror(element);
    }
  });

  /**
   * Focuses the field on mount. A plain native `autofocus` attribute is
   * disallowed by this repo's lint rules (it moves focus without warning
   * regardless of whether the element is actually connected/relevant yet);
   * upstream itself doesn't use it either — it defers an imperative
   * `focus()` call to a microtask after mount so listeners are attached
   * first, which this reproduces via a modifier instead.
   */
  autofocusIfRequested = eModifier<{ Element: HTMLTextAreaElement }>((element) => {
    if (this.args.autofocus) {
      void Promise.resolve().then(() => element.focus());
    }
  });

  <template>
    <div class='cds-aichat-prompt-line' ...attributes>
      <div class='frame'>
        <div class='cds-aichat-prompt-line__grow'>
          <textarea
            class='cds-aichat-prompt-line__field'
            rows='1'
            name='message'
            spellcheck='true'
            placeholder={{@placeholder}}
            readonly={{@disabled}}
            aria-label={{this.ariaLabel}}
            data-testid={{@testId}}
            {{this.autofocusIfRequested}}
            {{this.syncContent @content}}
            {{on 'input' this.handleInput}}
            {{on 'keydown' this.handleKeydown}}
          ></textarea>
          <div class='cds-aichat-prompt-line__mirror' aria-hidden='true'></div>
        </div>
      </div>
    </div>
  </template>
}
