/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier as eModifier } from 'ember-modifier';
import { and } from 'ember-truth-helpers';
import type Owner from '@ember/owner';
import type { EditorView } from '@codemirror/view';
import type { Compartment } from '@codemirror/state';
import Button from '../button.gts';
import SkeletonText from '../skeleton-text.gts';
import AiChatToolbar, { type ToolbarAction } from './toolbar.gts';
import { Copy, ChevronDown } from '../../icons.ts';
import type {
  LanguageController,
  LanguageStateUpdate,
} from './-code-snippet/language-controller.ts';
import type { ContentSyncHandle } from './-code-snippet/content-sync.ts';
import {
  buildContainerStyles,
  evaluateShowMoreButton,
} from './-code-snippet/layout-utils.ts';
import {
  defaultLineCountText,
  type LineCountFormatter,
} from './-code-snippet/formatters.ts';
import {
  loadCodeMirrorRuntime,
  type CodeMirrorRuntimeModule,
} from './-code-snippet/codemirror-loader.ts';

export type Args = {
  /** The code to display/edit. The sole content source - see the class doc. */
  code?: string;
  /** Language used for syntax highlighting (an exact `@codemirror/language-data` name, or a common alias/extension - see `-code-snippet/language-utils.ts`). */
  language?: string;
  /** Whether the snippet is an editable surface rather than a read-only display. */
  editable?: boolean;
  /** Enables syntax highlighting (language detection/label-locking still runs either way). */
  highlight?: boolean;
  /** Fallback language used for empty editable content when nothing else resolves one. Defaults to `'javascript'`. */
  defaultLanguage?: string;
  /** Show the detected language label in the header. When `false` (the default), only an explicit `@language` renders a label. */
  detectLanguage?: boolean;
  disabled?: boolean;
  hideCopyButton?: boolean;
  hideHeader?: boolean;
  hideLineNumbers?: boolean;
  /** Hides the fold gutter, removing the ability to collapse/expand code blocks (drops the fold keymap too). */
  hideFold?: boolean;
  /** Max rows shown when collapsed. `0` (with `@maxExpandedNumberOfRows` also `0`) enables fill-container mode; `Infinity` grows with content instead of scrolling. Defaults to `15`. */
  maxCollapsedNumberOfRows?: number;
  /** Max rows shown when expanded (`0` = unlimited). Defaults to `0`. */
  maxExpandedNumberOfRows?: number;
  /** Min rows shown when collapsed. Defaults to `3`. */
  minCollapsedNumberOfRows?: number;
  /** Min rows shown when expanded. Defaults to `16`. */
  minExpandedNumberOfRows?: number;
  showLessText?: string;
  showMoreText?: string;
  copyButtonTooltipContent?: string;
  foldCollapseLabel?: string;
  foldExpandLabel?: string;
  /** Aria-label for the editable surface. `{language}` is replaced with the detected/declared language once locked in. Defaults to `'Code editor'`. */
  ariaLabelEditable?: string;
  /** Aria-label for the read-only surface. `{language}` is replaced with the detected/declared language once locked in. Defaults to `'Code snippet'`. */
  ariaLabelReadOnly?: string;
  /** Formats the line-count label. Defaults to `${count} lines`. */
  getLineCountText?: LineCountFormatter;
  /** Extra toolbar actions, rendered after the copy button (unless `@hideCopyButton`). */
  actions?: ToolbarAction[];
  /** Enables responsive overflow on the toolbar - see `Toolbar`'s own `@overflow`. */
  overflow?: boolean;
  /** Fires with the new content on every edit. Only meaningful with `@editable={{true}}` - a read-only snippet never changes its own doc. */
  onChange?: (content: string) => void;
};

export interface AiChatCodeSnippetSignature {
  Element: HTMLDivElement;
  Args: Args;
}

/**
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-code-snippet`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/code-snippet) -
 * a CodeMirror 6 powered code display/editor with language detection,
 * folding, and a collapse/expand affordance for long snippets. Exported as
 * `AiChatCodeSnippet` (an existing Carbon React `CodeSnippet` already
 * occupies the plain name - see `scripts/parity-check.mjs`'s
 * `AI_CHAT_EXPORT_OVERRIDES`).
 *
 * **CodeMirror itself is entirely dynamically imported** - `code-snippet.gts`
 * never statically imports `@codemirror/*`/`@lezer/*`; every real import
 * lives in `-code-snippet/codemirror-runtime.ts`, reached only through
 * `-code-snippet/codemirror-loader.ts`'s `loadCodeMirrorRuntime()`, so a
 * bundler splits CodeMirror's core into its own lazy chunk (same pattern as
 * `PromptLine`'s Tiptap `rich-controller.ts`). Each of the 23
 * `@codemirror/lang-*` grammars (plus `@codemirror/legacy-modes`) is a
 * *further*, separate lazy chunk of its own - see the class doc on
 * `-code-snippet/languages.ts` for why this port uses the real
 * `@codemirror/language-data` (whose own `LanguageDescription.load()`
 * bodies already do their own per-language `import()`) instead of
 * vendoring upstream's ~1,250-line forked copy.
 *
 * **Scope cuts from upstream, all deliberate:**
 * - **`@code` is the sole content source.** Upstream also accepts plain
 *   light-DOM/slotted text for backward compatibility with a pre-`code`-
 *   property era of the widget, watched via a `StreamingManager`
 *   (`MutationObserver` + `<slot>` machinery) so a `<cds-aichat-code-snippet>`
 *   streaming raw text nodes into its light DOM stays in sync. Nothing in a
 *   Glimmer template can "stream text nodes into a component's DOM" the way
 *   raw custom-element HTML usage could - a consumer just reassigns a
 *   tracked `@code` string each token, which is what `@code` is for. Ported
 *   `createContentSync`'s throttled diff-apply (append-only/prefix-shrink
 *   fast paths, full replace otherwise) so that streaming still updates the
 *   live doc incrementally instead of resetting scroll/selection every
 *   token; dropped `StreamingManager`/`adoptLightDomCode`/`copyText`
 *   entirely (`copyText` only ever applied when slotted content was empty
 *   in upstream's own `_slottedContent || copyText` fallback - with `@code`
 *   the sole source there is no scenario where it would ever be consulted,
 *   so it would be dead surface here).
 * - **No `focusEditor()`/`@onReady` imperative API and no
 *   `code-snippet-render-end` event.** Both exist upstream to feed a
 *   not-yet-ported surrounding scroll/focus manager (the chat message
 *   list) - same "public surface, not the manager it feeds" call already
 *   made for `ReasoningSteps`' `data-last-item`/animation events. Add if a
 *   real consumer needs one.
 * - **Modern Clipboard API + a `document.execCommand('copy')` fallback**,
 *   matching upstream, but via a plain inline-styled off-screen `<textarea>`
 *   (same technique this addon's own `copy-button.gts` already uses)
 *   instead of upstream's CSP-safe dynamic-stylesheet trick - this addon
 *   doesn't target a strict `style-src-attr` CSP anywhere else.
 * - **`wrap-text` (a `:host([wrap-text])` rule in upstream's own SCSS) has
 *   no backing property anywhere in upstream's own `code-snippet.ts`
 *   either** - a pre-existing dead CSS hook, not something this port
 *   dropped. Not reproduced.
 *
 * Container CSS custom properties (`--cds-snippet-max-height`/`-min-height`)
 * are applied via a plain `style` attribute binding (`containerStyle`,
 * following `AiChatTruncatedText`'s existing precedent) rather than
 * upstream's CSP-safe dynamic-stylesheet helper, for the same reason as the
 * copy fallback above.
 */
export default class AiChatCodeSnippet extends Component<AiChatCodeSnippetSignature> {
  @tracked private detectedLanguage: string | null = null;
  @tracked private languageLabelLocked = false;
  @tracked private lineCount: number | null = null;
  @tracked private isEditorLoading = true;
  @tracked private expandedCode = false;
  @tracked private shouldShowMoreLessButton = false;

  private container: HTMLElement | null = null;
  private editorContainer: HTMLElement | null = null;
  private editorView: EditorView | undefined;
  private resizeObserver: ResizeObserver | undefined;
  private contentSync: ContentSyncHandle | undefined;
  private languageController: LanguageController | null = null;
  private codemirrorRuntime: CodeMirrorRuntimeModule | null = null;
  private codemirrorRuntimePromise: Promise<CodeMirrorRuntimeModule> | null = null;
  private languageCompartment: Compartment | null = null;
  private readOnlyCompartment: Compartment | null = null;
  private wrapCompartment: Compartment | null = null;
  private contentAttributesCompartment: Compartment | null = null;
  private isCreatingEditor = false;
  private fontSettleScheduled = false;
  private readonly rowHeightInPixels = 16;

  constructor(owner: Owner, args: Args) {
    super(owner, args);
  }

  private get code(): string {
    return this.args.code ?? '';
  }

  private get maxCollapsedNumberOfRows(): number {
    return this.args.maxCollapsedNumberOfRows ?? 15;
  }

  private get maxExpandedNumberOfRows(): number {
    return this.args.maxExpandedNumberOfRows ?? 0;
  }

  private get minCollapsedNumberOfRows(): number {
    return this.args.minCollapsedNumberOfRows ?? 3;
  }

  private get minExpandedNumberOfRows(): number {
    return this.args.minExpandedNumberOfRows ?? 16;
  }

  get isFillMode(): boolean {
    return this.maxCollapsedNumberOfRows === 0 && this.maxExpandedNumberOfRows === 0;
  }

  get containerStyle(): string {
    const properties = buildContainerStyles({
      expanded: this.expandedCode,
      maxCollapsed: this.maxCollapsedNumberOfRows,
      maxExpanded: this.maxExpandedNumberOfRows,
      minCollapsed: this.minCollapsedNumberOfRows,
      minExpanded: this.minExpandedNumberOfRows,
      rowHeight: this.rowHeightInPixels,
    });
    return Object.entries(properties)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ');
  }

  get ariaLabelEditable(): string {
    return this.args.ariaLabelEditable ?? 'Code editor';
  }

  get ariaLabelReadOnly(): string {
    return this.args.ariaLabelReadOnly ?? 'Code snippet';
  }

  private get ariaLabel(): string {
    const language = this.detectedLanguage;
    const label = this.args.editable ? this.ariaLabelEditable : this.ariaLabelReadOnly;
    return language ? label.replace('{language}', language) : label;
  }

  get containerAriaLabel(): string {
    return this.args.editable ? this.ariaLabelEditable : this.code || 'code-snippet';
  }

  get showLanguageLabel(): boolean {
    return (
      !!this.detectedLanguage &&
      this.languageLabelLocked &&
      (!!this.args.detectLanguage || !!this.args.language)
    );
  }

  get lineCountText(): string {
    const formatter = this.args.getLineCountText ?? defaultLineCountText;
    return formatter({ count: this.lineCount ?? 0 });
  }

  get expandButtonText(): string {
    return this.expandedCode
      ? (this.args.showLessText ?? 'Show less')
      : (this.args.showMoreText ?? 'Show more');
  }

  get toolbarActions(): ToolbarAction[] {
    const extra = this.args.actions ?? [];
    if (this.args.hideCopyButton) {
      return extra;
    }
    return [
      {
        text: this.args.copyButtonTooltipContent ?? 'Copy to clipboard',
        icon: Copy,
        onClick: () => void this.handleCopyClick(),
      },
      ...extra,
    ];
  }

  private async handleCopyClick() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(this.code);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = this.code;
        textArea.setAttribute('aria-hidden', 'true');
        textArea.setAttribute('tabindex', '-1');
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }

  toggleExpanded = () => {
    this.expandedCode = !this.expandedCode;
  };

  private applyLanguageState(update: LanguageStateUpdate) {
    if ('detectedLanguage' in update) {
      this.detectedLanguage = update.detectedLanguage ?? null;
    }
    if (update.lockLabel !== undefined) {
      this.languageLabelLocked = update.lockLabel;
    }
  }

  private async ensureCodeMirrorRuntime(): Promise<boolean> {
    if (this.codemirrorRuntime && this.languageController) {
      return true;
    }

    if (!this.codemirrorRuntimePromise) {
      this.isEditorLoading = true;
      this.codemirrorRuntimePromise = loadCodeMirrorRuntime();
    }

    try {
      const runtime = await this.codemirrorRuntimePromise;
      if (!this.codemirrorRuntime) {
        this.codemirrorRuntime = runtime;
        this.languageCompartment = new runtime.Compartment();
        this.readOnlyCompartment = new runtime.Compartment();
        this.wrapCompartment = new runtime.Compartment();
        this.contentAttributesCompartment = new runtime.Compartment();
        this.languageController = new runtime.LanguageController({
          getLanguageAttribute: () => this.args.language ?? '',
          getContent: () => this.code,
          isHighlightEnabled: () => !!this.args.highlight,
          getEditorView: () => this.editorView,
          getLanguageCompartment: () => {
            if (!this.languageCompartment) {
              this.languageCompartment = new runtime.Compartment();
            }
            return this.languageCompartment;
          },
          isLanguageLabelLocked: () => this.languageLabelLocked,
          getDefaultLanguage: () => this.args.defaultLanguage ?? 'javascript',
          getDetectedLanguage: () => this.detectedLanguage,
          updateState: (update) => this.applyLanguageState(update),
        });
      }
      return true;
    } catch (error) {
      console.error('Failed to load CodeMirror runtime', error);
      this.isEditorLoading = false;
      this.codemirrorRuntimePromise = null;
      return false;
    }
  }

  private destroyEditor() {
    if (this.editorView) {
      this.editorView.destroy();
      this.editorView = undefined;
    }
    this.languageController?.reset();
  }

  private checkShowMoreButton() {
    const { shouldShowButton, shouldCollapse } = evaluateShowMoreButton({
      container: this.container,
      rowHeight: this.rowHeightInPixels,
      expanded: this.expandedCode,
      maxCollapsed: this.maxCollapsedNumberOfRows,
      maxExpanded: this.maxExpandedNumberOfRows,
      minExpanded: this.minExpandedNumberOfRows,
    });

    if (this.shouldShowMoreLessButton !== shouldShowButton) {
      this.shouldShowMoreLessButton = shouldShowButton;
    }

    if (shouldCollapse) {
      this.expandedCode = false;
    }
  }

  private scheduleFontSettle() {
    if (this.fontSettleScheduled || !document.fonts) {
      return;
    }
    this.fontSettleScheduled = true;
    void document.fonts.ready.then(() => {
      if (!this.editorView) {
        return;
      }
      this.checkShowMoreButton();
    });
  }

  private async createEditor() {
    const container = this.editorContainer;
    const runtime = this.codemirrorRuntime;
    const languageController = this.languageController;
    const languageCompartment = this.languageCompartment;
    const readOnlyCompartment = this.readOnlyCompartment;
    const wrapCompartment = this.wrapCompartment;
    const contentAttributesCompartment = this.contentAttributesCompartment;

    if (
      !container ||
      !runtime ||
      !languageController ||
      !languageCompartment ||
      !readOnlyCompartment ||
      !wrapCompartment ||
      !contentAttributesCompartment
    ) {
      return;
    }

    this.isEditorLoading = true;

    const languageSupport = await languageController.resolveLanguageSupport();

    try {
      container.replaceChildren();
      this.editorView = runtime.createEditorView({
        container,
        doc: this.code,
        languageSupport,
        languageCompartment,
        readOnlyCompartment,
        wrapCompartment,
        contentAttributesCompartment,
        editable: !!this.args.editable,
        disabled: !!this.args.disabled,
        ariaLabel: this.ariaLabel,
        detectedLanguage: this.detectedLanguage,
        onDocChanged: ({ content, lineCount }) => {
          this.lineCount = lineCount;
          this.args.onChange?.(content);
          if (this.args.editable) {
            languageController.detectLanguageForEditable(content);
          }
        },
        setupOptions: {
          foldCollapseLabel: this.args.foldCollapseLabel ?? 'Collapse code block',
          foldExpandLabel: this.args.foldExpandLabel ?? 'Expand code block',
          hideLineNumbers: !!this.args.hideLineNumbers,
          hideFold: !!this.args.hideFold,
        },
      });
    } finally {
      this.isEditorLoading = false;
    }

    this.lineCount = this.editorView.state.doc.lines;

    requestAnimationFrame(() => {
      this.checkShowMoreButton();
    });

    // IBM Plex Mono is a web font that can arrive after first paint and
    // reflow the code, changing height - re-measure once fonts are ready.
    this.scheduleFontSettle();

    languageController.handleStreamingLanguageDetection();
  }

  private async recreateEditor() {
    const ready = await this.ensureCodeMirrorRuntime();
    if (!ready || !this.codemirrorRuntime || !this.languageController) {
      return;
    }
    if (this.isCreatingEditor) {
      return;
    }
    this.isCreatingEditor = true;
    this.destroyEditor();
    await this.createEditor();
    this.isCreatingEditor = false;
  }

  /**
   * Owns the outer container: setup that must happen exactly once
   * (ResizeObserver, kicking off the CodeMirror runtime load) and final
   * teardown. Deliberately separate from `mountEditor` below (which reacts
   * to structural arg changes and tears down/rebuilds *just* the editor
   * view on every one of those) - mirrors `PromptLine`'s `mountSurface` vs.
   * `watchRich`/`watchExtensions`/`syncArgs` split for the same reason: a
   * modifier with reactive args re-runs its own returned teardown on every
   * reactive re-invocation, not just final removal, so one-shot setup has
   * to live in a modifier with no reactive args of its own.
   */
  mountContainer = eModifier<{ Element: HTMLDivElement }>((element) => {
    this.container = element;
    const observer = new ResizeObserver(() => {
      // Defer to requestAnimationFrame to avoid ResizeObserver loop errors
      // (see the `Toolbar`/`WorkspaceShell` precedent in batch 3).
      requestAnimationFrame(() => {
        this.checkShowMoreButton();
      });
    });
    observer.observe(element);
    this.resizeObserver = observer;

    void this.ensureCodeMirrorRuntime();

    return () => {
      observer.disconnect();
      this.resizeObserver = undefined;
      this.contentSync?.cancel();
      this.languageController?.dispose();
      this.destroyEditor();
      this.container = null;
    };
  });

  /**
   * Full recreate on structural changes, mirroring upstream's `updateEditor`
   * `needsRecreate` branch (`!editorView || editable/hideLineNumbers/hideFold
   * changed`). Fires on install too (a positional-arg modifier always runs
   * its body for the initial render), which is exactly what creates the
   * *first* editor once the CodeMirror runtime resolves - `recreateEditor`
   * itself awaits readiness and no-ops until then.
   */
  mountEditor = eModifier<{
    Element: HTMLDivElement;
    Args: { Positional: [boolean | undefined, boolean | undefined, boolean | undefined] };
  }>((element) => {
    this.editorContainer = element;
    void this.recreateEditor();
  });

  /** In-place diff-apply of `@code`, throttled - never a full recreate. */
  syncContent = eModifier<{
    Element: HTMLDivElement;
    Args: { Positional: [string] };
  }>((_element, [code]) => {
    void (async () => {
      const ready = await this.ensureCodeMirrorRuntime();
      if (!ready || !this.editorView || !this.codemirrorRuntime || !this.languageController) {
        return;
      }
      const { createContentSync } = this.codemirrorRuntime;
      const languageController = this.languageController;
      if (!this.contentSync) {
        this.contentSync = createContentSync({
          getEditorView: () => this.editorView,
          onAfterApply: () => {
            if (this.editorView) {
              this.lineCount = this.editorView.state.doc.lines;
            }
            this.checkShowMoreButton();
          },
        });
      }
      this.contentSync.update(code);
      languageController.handleStreamingLanguageDetection();
    })();
  });

  /** In-place language-support swap on `@language`/`@highlight` changes. */
  syncLanguage = eModifier<{
    Element: HTMLDivElement;
    Args: { Positional: [string | undefined, boolean | undefined] };
  }>(() => {
    void (async () => {
      const ready = await this.ensureCodeMirrorRuntime();
      if (
        !ready ||
        !this.editorView ||
        !this.codemirrorRuntime ||
        !this.languageController ||
        !this.languageCompartment
      ) {
        return;
      }
      const languageSupport = await this.languageController.resolveLanguageSupport();
      this.codemirrorRuntime.applyLanguageSupport(
        this.editorView,
        this.languageCompartment,
        languageSupport
      );
    })();
  });

  /** In-place readonly-configuration swap on `@disabled` changes. */
  syncDisabled = eModifier<{
    Element: HTMLDivElement;
    Args: { Positional: [boolean | undefined] };
  }>((_element, [disabled]) => {
    void (async () => {
      const ready = await this.ensureCodeMirrorRuntime();
      if (!ready || !this.editorView || !this.codemirrorRuntime || !this.readOnlyCompartment) {
        return;
      }
      this.codemirrorRuntime.updateReadOnlyConfiguration(
        this.editorView,
        this.readOnlyCompartment,
        { editable: !!this.args.editable, disabled: !!disabled }
      );
    })();
  });

  /**
   * In-place `aria-label`/`aria-readonly`/`aria-multiline` content-attribute
   * swap, keyed on everything `ariaLabel` (above) reads plus `@editable`
   * (the contentAttributes compartment also carries the editor's editable
   * state's aria-multiline, matching upstream) - fires whenever the
   * resolved label text could have changed.
   */
  syncAriaAttrs = eModifier<{
    Element: HTMLDivElement;
    Args: {
      Positional: [string | null, boolean | undefined, string, string];
    };
  }>(() => {
    void (async () => {
      const ready = await this.ensureCodeMirrorRuntime();
      if (!ready || !this.editorView || !this.codemirrorRuntime || !this.contentAttributesCompartment) {
        return;
      }
      this.codemirrorRuntime.updateContentAttributes(
        this.editorView,
        this.contentAttributesCompartment,
        this.ariaLabel
      );
    })();
  });

  <template>
    <div
      class='cds-aichat-code-snippet
        {{if this.isFillMode "cds-aichat-code-snippet--fill-mode"}}
        {{if @disabled "cds-aichat-code-snippet--disabled"}}'
      ...attributes
    >
      <div class='cds-aichat-snippet'>
        {{#unless @hideHeader}}
          <AiChatToolbar
            class='cds-aichat-snippet__header'
            @actions={{this.toolbarActions}}
            @overflow={{@overflow}}
          >
            <:title>
              <div class='cds-aichat-snippet__meta'>
                {{#if this.showLanguageLabel}}
                  <div class='cds-aichat-snippet__language'>{{this.detectedLanguage}}</div>
                {{/if}}
                {{#if (and this.showLanguageLabel this.lineCount)}}
                  <div class='cds-aichat-snippet__header-separator'>&mdash;</div>
                {{/if}}
                {{#if this.lineCount}}
                  <div class='cds-aichat-snippet__linecount'>{{this.lineCountText}}</div>
                {{/if}}
              </div>
            </:title>
          </AiChatToolbar>
        {{/unless}}

        <div
          class='cds-aichat-snippet-container
            {{if this.isFillMode
              "cds-aichat-snippet-container--fill-mode"
              (unless this.expandedCode "cds-aichat-snippet-container--collapsed")
            }}'
          style={{this.containerStyle}}
          role={{if @editable 'textbox'}}
          aria-label={{this.containerAriaLabel}}
          aria-readonly={{if @editable 'false'}}
          aria-multiline={{if @editable 'true'}}
          {{this.mountContainer}}
        >
          <div
            class='cds-aichat-code-editor'
            {{this.mountEditor @editable @hideLineNumbers @hideFold}}
            {{this.syncContent this.code}}
            {{this.syncLanguage @language @highlight}}
            {{this.syncDisabled @disabled}}
            {{this.syncAriaAttrs this.detectedLanguage @editable this.ariaLabelReadOnly this.ariaLabelEditable}}
          ></div>
          {{#if this.isEditorLoading}}
            <div class='cds-aichat-snippet__editor-skeleton' aria-hidden='true'>
              <SkeletonText @paragraph={{true}} @lineCount={{4}} />
            </div>
          {{/if}}
        </div>

        {{#if this.shouldShowMoreLessButton}}
          <div class='cds-aichat-snippet__footer'>
            <Button
              @ghost={{true}}
              @size='sm'
              @disabled={{@disabled}}
              @onClick={{this.toggleExpanded}}
            >
              <span class='cds-aichat-snippet-btn--text'>{{this.expandButtonText}}</span>
              <ChevronDown
                @size={{16}}
                @svgClass='cds-aichat-snippet__icon cds-aichat-icon-chevron--down {{if this.expandedCode "cds-aichat-icon-chevron--down--expanded"}}'
              />
            </Button>
          </div>
        {{/if}}
      </div>
    </div>
  </template>
}
