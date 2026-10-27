/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ported near-verbatim from `@carbon/ai-chat-components`'
 * `code-snippet/src/codemirror/language-controller.ts`. It imports
 * `languages` from `./languages.ts` (the real `@codemirror/language-data`,
 * minus one entry) instead of a vendored fork, and debounces with
 * ember-concurrency tasks, which tests wait for, instead of `setTimeout`.
 */
import { task, timeout } from 'ember-concurrency';
import type { Compartment } from '@codemirror/state';
import { LanguageDescription } from '@codemirror/language';
import type { LanguageSupport } from '@codemirror/language';
import { languages } from './languages.ts';
import type { EditorView } from '@codemirror/view';
import { detectLanguage, mapLanguageName } from './language-utils.ts';

export interface LanguageStateUpdate {
  detectedLanguage?: string | null;
  lockLabel?: boolean;
}

interface LanguageControllerConfig {
  getLanguageAttribute(): string;
  getContent(): string;
  isHighlightEnabled(): boolean;
  getEditorView(): EditorView | undefined;
  getLanguageCompartment(): Compartment;
  isLanguageLabelLocked(): boolean;
  getDefaultLanguage(): string;
  getDetectedLanguage(): string | null;
  updateState(update: LanguageStateUpdate): void;
}

function loadLanguageSupport(langDesc: LanguageDescription) {
  return langDesc.load();
}

export class LanguageController {
  private pendingLanguageLoad: Promise<void> | null = null;
  private canDetectForHighlighting = true;

  private readonly config: LanguageControllerConfig;

  constructor(config: LanguageControllerConfig) {
    this.config = config;
  }

  async resolveLanguageSupport(): Promise<LanguageSupport | null> {
    const languageAttr = this.config.getLanguageAttribute();
    const content = this.config.getContent();
    const isHighlightEnabled = this.config.isHighlightEnabled();
    const currentDetectedLanguage = this.config.getDetectedLanguage();

    let languageToUse = languageAttr
      ? (mapLanguageName(languageAttr) ?? languageAttr)
      : '';

    if (!languageToUse && content) {
      const trimmed = content.trim();
      if (trimmed) {
        const detected = detectLanguage(trimmed);
        languageToUse = detected ?? '';
      }
    }

    // Use default language for empty editable content
    if (!languageToUse && this.config.getDefaultLanguage()) {
      const trimmed = content.trim();
      if (!trimmed) {
        languageToUse = this.config.getDefaultLanguage();
      }
    }

    if (!languageToUse) {
      this.config.updateState({ detectedLanguage: null, lockLabel: false });
      return null;
    }

    const langDesc = LanguageDescription.matchLanguageName(
      languages,
      languageToUse,
      true,
    );

    const detectedLanguage = langDesc ? languageToUse : null;

    // Preserve detected language when highlight is toggled. Only update
    // state if the detected language has actually changed or needs to be
    // cleared.
    if (detectedLanguage !== currentDetectedLanguage) {
      this.config.updateState({
        detectedLanguage,
        lockLabel: Boolean(languageAttr && detectedLanguage),
      });
    }

    if (!isHighlightEnabled || !langDesc) {
      return null;
    }

    try {
      return await loadLanguageSupport(langDesc);
    } catch {
      console.warn(`Failed to load language support for "${languageToUse}"`);
      return null;
    }
  }

  handleStreamingLanguageDetection(): void {
    if (this.config.getLanguageAttribute()) {
      return;
    }

    const trimmed = this.config.getContent().trim();
    if (!trimmed) {
      return;
    }

    if (
      !this.config.isLanguageLabelLocked() &&
      this.config.isHighlightEnabled() &&
      this.canDetectForHighlighting
    ) {
      const detected = detectLanguage(trimmed);
      if (detected) {
        const langDesc = LanguageDescription.matchLanguageName(
          languages,
          detected,
          true,
        );

        if (langDesc && !this.pendingLanguageLoad) {
          this.pendingLanguageLoad = loadLanguageSupport(langDesc)
            .then((support) => {
              const view = this.config.getEditorView();
              if (!view) {
                return;
              }
              view.dispatch({
                effects: this.config
                  .getLanguageCompartment()
                  .reconfigure([support]),
              });
            })
            .catch(() => {
              console.warn(`Failed to load language support for "${detected}"`);
            })
            .finally(() => {
              this.pendingLanguageLoad = null;
            });

          this.canDetectForHighlighting = false;
          this.scheduleHighlightingDetectionReset();
        }
      }
    }

    if (this.config.isLanguageLabelLocked()) {
      void this.languageDetection.cancelAll();
    } else {
      void this.languageDetection.perform();
    }
  }

  detectLanguageForEditable(content: string) {
    if (this.config.getLanguageAttribute()) {
      return;
    }

    const trimmed = content.trim();
    if (!trimmed) {
      this.config.updateState({ detectedLanguage: null, lockLabel: false });
      return;
    }

    void this.editableLanguageDetection.perform(trimmed);
  }

  private languageDetection = task({ restartable: true }, async () => {
    await timeout(200);
    this.lockDetectedLanguageFromContent();
  });

  private editableLanguageDetection = task(
    { restartable: true },
    async (trimmed: string) => {
      await timeout(200);
      const detected = detectLanguage(trimmed);
      if (!detected) {
        return;
      }

      const langDesc = LanguageDescription.matchLanguageName(
        languages,
        detected,
        true,
      );

      if (!langDesc) {
        return;
      }

      this.config.updateState({ detectedLanguage: detected, lockLabel: true });

      if (this.config.isHighlightEnabled() && !this.pendingLanguageLoad) {
        this.pendingLanguageLoad = loadLanguageSupport(langDesc)
          .then((support) => {
            const view = this.config.getEditorView();
            if (!view) {
              return;
            }
            view.dispatch({
              effects: this.config
                .getLanguageCompartment()
                .reconfigure([support]),
            });
          })
          .catch(() => {
            console.warn(`Failed to load language support for "${detected}"`);
          })
          .finally(() => {
            this.pendingLanguageLoad = null;
          });
      }
    },
  );

  reset() {
    this.disposeTimers();
    this.pendingLanguageLoad = null;
    this.canDetectForHighlighting = true;
    this.config.updateState({ detectedLanguage: null, lockLabel: false });
  }

  dispose() {
    this.disposeTimers();
    this.pendingLanguageLoad = null;
  }

  private lockDetectedLanguageFromContent() {
    if (
      this.config.getLanguageAttribute() ||
      this.config.isLanguageLabelLocked()
    ) {
      return;
    }

    const trimmed = this.config.getContent().trim();
    if (!trimmed) {
      return;
    }

    const detected = detectLanguage(trimmed);
    if (!detected) {
      return;
    }

    this.config.updateState({ detectedLanguage: detected, lockLabel: true });
  }

  private scheduleHighlightingDetectionReset() {
    void this.highlightingDetectionReset.perform();
  }

  private highlightingDetectionReset = task({ restartable: true }, async () => {
    await timeout(200);
    this.canDetectForHighlighting = true;
  });

  private disposeTimers() {
    void this.languageDetection.cancelAll();
    void this.highlightingDetectionReset.cancelAll();
    void this.editableLanguageDetection.cancelAll();
  }
}
