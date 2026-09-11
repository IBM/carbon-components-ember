/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { modifier as eModifier } from 'ember-modifier';
import type Owner from '@ember/owner';
import type { Editor, Extension } from '@tiptap/core';
import type { EditingSurfaceController } from './-prompt-line/controller.ts';
import { TextareaController } from './-prompt-line/textarea-controller.ts';
import { textOffsetToDocPos } from './-prompt-line/text-utils.ts';

/**
 * Imperative handle to the live editing surface, handed to `@onReady` once
 * after mount. Works the same in both modes — `getEditor()` returns `null`
 * in textarea mode without triggering the Tiptap upgrade; call
 * `ensureEditor()` to force it and get the live editor back.
 */
export interface PromptLineApi {
  getEditor(): Editor | null;
  /**
   * Lazily loads Tiptap (if needed) and upgrades the textarea to the rich
   * editor in place, resolving with the live editor. Resolves immediately
   * if already rich. Concurrent callers share one in-flight upgrade.
   */
  ensureEditor(): Promise<Editor>;
  getValue(): string;
  focus(): void;
  blur(): void;
  hasFocus(): boolean;
  clearContent(): void;
  insertContent(text: string, opts?: { at?: number }): void;
  setTextSelection(pos: number | { from: number; to: number }): void;
  selectAll(): void;
  undo(): boolean;
  redo(): boolean;
}

export type Args = {
  /** Current plain-text value. Always-controlled: typing only fires `@onChange`. */
  content?: string;
  disabled?: boolean;
  placeholder?: string;
  /** Defaults to `'Message'`. */
  ariaLabel?: string;
  testId?: string;
  autofocus?: boolean;
  /** Fires with the new value on every input, in either mode. */
  onChange?: (value: string) => void;
  /**
   * Fires on plain Enter (non-empty field) or Mod-Enter (any field),
   * mirroring upstream's Enter-to-send keymap. Identical in both modes.
   */
  onSendIntent?: () => void;
  /**
   * Selects the rich Tiptap editor. Defaults to the textarea. The element
   * lazy-loads Tiptap (a dynamic `import()`, so a chat that never sets this
   * never ships it) and upgrades the textarea to it in place — text, caret,
   * and focus all carry over, so the swap is a same-frame handoff, not a
   * visible reset. The upgrade is **sticky**: once rich, later setting this
   * back to `false` does not downgrade.
   */
  rich?: boolean;
  /**
   * Host-supplied Tiptap `Extension`s, appended to the base Carbon bundle
   * (schema, undo/redo, placeholder, plain-text paste, the Enter/Mod-Enter/
   * Escape keymap) when the rich editor (re)builds. Ignored in textarea
   * mode — setting these alone does not trigger the upgrade. Compared by
   * reference: a fresh array every render rebuilds the live editor
   * (preserving content/selection/focus but resetting undo history), so
   * memoize it rather than passing an inline literal.
   */
  extensions?: Extension[];
  /** Called once, right after mount, with an imperative handle to the surface. */
  onReady?: (api: PromptLineApi) => void;
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
 * [`cds-aichat-prompt-line`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/prompt-line).
 * Renders a plain `<textarea>` by default, matching upstream's own default,
 * and never statically imports `@tiptap/*` — setting `@rich` (or calling
 * `ensureEditor()` via `@onReady`'s handle) dynamically imports a small
 * Tiptap runtime module and upgrades the surface in place. Both modes
 * accept the same `@content`/`@onChange`/`@onSendIntent` contract and the
 * `PromptLineApi` handle works identically in either, so a consumer never
 * needs to branch on which is currently mounted.
 *
 * Deliberately narrower than upstream's rich mode: no mention/autocomplete
 * extensions (`carbon-mention`/`carbon-autocomplete`/`carbon-starter-trigger`
 * — a separate, not-yet-ported feature; `@extensions` accepts plain Tiptap
 * `Extension`s only), no typing-indicator event (nothing in this port
 * consumes one; a caller can debounce `@onChange` itself), and no
 * IME-composition guard around the textarea→rich swap (an already-narrow
 * edge case — `@rich` toggling mid-keystroke). Also not reproduced: the
 * keyboard-vs-pointer focus-ring distinction upstream derives from a
 * `keyboard` event detail — both surfaces render inside this component's
 * own `.cds-aichat-prompt-line`, whose `:focus-within` rule is already
 * surface-agnostic, so there's nothing to key off of; and the
 * `cds-aichat-prompt-keydown` event — keydown already bubbles from either
 * surface up to this component's root element, which forwards
 * `...attributes`, so a consumer can listen directly on the invocation
 * (`<PromptLine {{on 'keydown' ...}} />`) instead.
 */
export default class PromptLine extends Component<PromptLineSignature> {
  // Captured once at construction so `mountSurface` (below) never reads a
  // tracked arg directly — doing so would make ember-modifier treat it as a
  // dependency and tear down/rebuild the whole surface (discarding the live
  // controller) on every later change, instead of the one-shot initial
  // mount this is meant to be. Later changes flow through the separate
  // small modifiers underneath, each keyed on exactly the arg it reacts to
  // (same split `DatePicker`'s `attachFlatpickr`/`syncValue` already use).
  private readonly initialContent: string;
  private readonly initialPlaceholder: string;
  private readonly initialDisabled: boolean;
  private readonly initialAriaLabel: string;
  private readonly initialTestId: string | undefined;
  private readonly initialAutofocus: boolean;

  // Plain instance state, not `@tracked` - read only inside the modifiers
  // below and never from the template (both editing surfaces manage their
  // own DOM imperatively inside a single, otherwise-static host `<div>`).
  private controller: EditingSurfaceController | null = null;
  private editorHost: HTMLElement | null = null;
  private mode: 'textarea' | 'rich' = 'textarea';
  private upgrading = false;
  private richReadyPromise: Promise<Editor> | null = null;
  private resolveRichReady: ((editor: Editor) => void) | null = null;
  private rejectRichReady: ((reason: unknown) => void) | null = null;

  constructor(owner: Owner, args: Args) {
    super(owner, args);
    this.initialContent = args.content ?? '';
    this.initialPlaceholder = args.placeholder ?? '';
    this.initialDisabled = !!args.disabled;
    this.initialAriaLabel = args.ariaLabel ?? 'Message';
    this.initialTestId = args.testId;
    this.initialAutofocus = !!args.autofocus;
  }

  get placeholder() {
    return this.args.placeholder ?? '';
  }

  get isDisabled() {
    return !!this.args.disabled;
  }

  get ariaLabel() {
    return this.args.ariaLabel ?? 'Message';
  }

  private handleChange = (value: string) => {
    this.args.onChange?.(value);
  };

  private handleSendIntent = () => {
    this.args.onSendIntent?.();
  };

  private readonly api: PromptLineApi = {
    getEditor: () => this.controller?.getEditor() ?? null,
    ensureEditor: () => this.ensureEditor(),
    getValue: () => this.controller?.getValue() ?? '',
    focus: () => this.controller?.focus(),
    blur: () => this.controller?.blur(),
    hasFocus: () => this.controller?.hasFocus() ?? false,
    clearContent: () => this.controller?.clearContent(),
    insertContent: (text, opts) => this.controller?.insertContent(text, opts),
    setTextSelection: (pos) => this.controller?.setTextSelection(pos),
    selectAll: () => this.controller?.selectAll(),
    undo: () => this.controller?.undo() ?? false,
    redo: () => this.controller?.redo() ?? false,
  };

  private ensureEditor(): Promise<Editor> {
    if (this.mode === 'rich') {
      const editor = this.controller?.getEditor();
      if (editor) {
        return Promise.resolve(editor);
      }
    }
    if (!this.editorHost || !this.controller) {
      return Promise.reject(new Error('PromptLine is not currently rendered'));
    }
    if (!this.richReadyPromise) {
      this.richReadyPromise = new Promise((resolve, reject) => {
        this.resolveRichReady = resolve;
        this.rejectRichReady = reject;
      });
    }
    void this.upgradeToRich();
    return this.richReadyPromise;
  }

  private settleRichReady() {
    const editor = this.controller?.getEditor();
    if (editor && this.resolveRichReady) {
      this.resolveRichReady(editor);
      this.resolveRichReady = null;
      this.rejectRichReady = null;
    }
  }

  private failRichReady(reason: unknown) {
    this.rejectRichReady?.(reason);
    this.resolveRichReady = null;
    this.rejectRichReady = null;
    this.richReadyPromise = null;
  }

  /** Lazily load Tiptap and swap the textarea for the rich editor in place. */
  private async upgradeToRich() {
    if (this.mode === 'rich' || this.upgrading) {
      return;
    }
    this.upgrading = true;
    try {
      const { createRichController } = await import('./-prompt-line/rich-controller.ts');
      const host = this.editorHost;
      const previous = this.controller;
      if (!host || !previous) {
        this.failRichReady(new Error('PromptLine is not currently rendered'));
        return;
      }
      const value = previous.getValue();
      const selection = previous.getSelection();
      const hadFocus = previous.hasFocus();
      previous.destroy();
      const rich = createRichController();
      this.controller = rich;
      this.mode = 'rich';
      rich.mount(host, {
        value,
        placeholder: this.placeholder,
        disabled: this.isDisabled,
        ariaLabel: this.ariaLabel,
        testId: this.args.testId,
        extensions: this.args.extensions ?? [],
        onChange: this.handleChange,
        onSendIntent: this.handleSendIntent,
      });
      // Seeded losslessly from the textarea's plain text (which is all a
      // textarea can ever hold), so the caret lands at the same offset.
      rich.setTextSelection({
        from: textOffsetToDocPos(value, selection.from),
        to: textOffsetToDocPos(value, selection.to),
      });
      if (hadFocus) {
        rich.focus();
      }
      this.settleRichReady();
    } catch (error) {
      this.failRichReady(error instanceof Error ? error : new Error(String(error)));
    } finally {
      this.upgrading = false;
    }
  }

  // Mounts the textarea surface once, on install, and tears it (or whatever
  // surface is live by then) down on element removal. Always starts
  // textarea, even when `@rich` is `true` from the start - there's no
  // preloaded-runtime fast path here (unlike upstream's
  // `getRichRuntimeIfLoaded()`), so an initial `@rich={{true}}` renders the
  // textarea for one tick and then swaps, rather than skipping it. `watchRich`
  // below (installed right after, so it runs immediately afterward on the
  // same render) is what actually kicks off that swap.
  mountSurface = eModifier<{ Element: HTMLDivElement }>((element) => {
    this.editorHost = element;
    const controller = new TextareaController();
    this.controller = controller;
    this.mode = 'textarea';
    controller.mount(element, {
      value: this.initialContent,
      placeholder: this.initialPlaceholder,
      disabled: this.initialDisabled,
      ariaLabel: this.initialAriaLabel,
      testId: this.initialTestId,
      extensions: [],
      onChange: this.handleChange,
      onSendIntent: this.handleSendIntent,
    });
    if (this.initialAutofocus) {
      // Deferred so consumer listeners (and, if `@rich` is also set, the
      // upgrade already in flight) are attached first.
      void Promise.resolve().then(() => this.controller?.focus());
    }
    this.args.onReady?.(this.api);

    return () => {
      this.controller?.destroy();
      this.controller = null;
      this.editorHost = null;
    };
  });

  // Sticky: only ever asks to move textarea -> rich, never the reverse.
  // Fires once on install too (a positional-arg modifier runs its body for
  // the initial render as well as later changes), which is what lets a
  // `@rich={{true}}` supplied from the start trigger the upgrade right after
  // `mountSurface` above has mounted the textarea.
  watchRich = eModifier<{
    Element: HTMLDivElement;
    Args: { Positional: [boolean | undefined] };
  }>((_element, [rich]) => {
    if (rich && this.mode === 'textarea' && !this.upgrading) {
      void this.upgradeToRich();
    }
  });

  // No-ops until the surface is actually rich - extensions are only staged
  // until then (read fresh off `@extensions` inside `upgradeToRich`).
  watchExtensions = eModifier<{
    Element: HTMLDivElement;
    Args: { Positional: [Extension[] | undefined] };
  }>((_element, [extensions]) => {
    if (this.mode === 'rich') {
      this.controller?.setExtensions(extensions ?? []);
    }
  });

  // Bundles every in-place (non-structural) sync into one modifier, same as
  // `DatePicker`'s `syncValue` - each of these controller methods is
  // idempotent, so re-calling all of them whenever any one of these named
  // args changes is harmless.
  syncArgs = eModifier<{
    Element: HTMLDivElement;
    Args: {
      Named: {
        content: string | undefined;
        disabled: boolean;
        placeholder: string;
        ariaLabel: string;
        testId: string | undefined;
      };
    };
  }>((_element, _positional, { content, disabled, placeholder, ariaLabel, testId }) => {
    const controller = this.controller;
    if (!controller) {
      return;
    }
    controller.setContent(content ?? '');
    controller.setEditable(!disabled);
    controller.setPlaceholder(placeholder);
    controller.setAriaLabel(ariaLabel);
    controller.setTestId(testId);
  });

  <template>
    <div class='cds-aichat-prompt-line' ...attributes>
      <div
        class='frame'
        {{this.mountSurface}}
        {{this.watchRich @rich}}
        {{this.watchExtensions @extensions}}
        {{this.syncArgs
          content=@content
          disabled=this.isDisabled
          placeholder=this.placeholder
          ariaLabel=this.ariaLabel
          testId=@testId
        }}
      ></div>
    </div>
  </template>
}
