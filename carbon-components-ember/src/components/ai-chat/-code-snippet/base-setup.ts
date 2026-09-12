/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ported verbatim from `@carbon/ai-chat-components`'
 * `code-snippet/src/codemirror/base-setup.ts`.
 *
 * Minimal editor affordances for snippets:
 *  - keep the layout oriented (gutters, folding)
 *  - preserve indentation and basic syntax cues
 *  - avoid heavier behaviors like search, autocomplete, multi-caret history
 *
 * `hideLineNumbers` drops the line-number gutter and `hideFold` drops the
 * folding affordances (gutter, marker key handler, and fold keymap) so callers
 * can render a leaner surface for short, static snippets.
 */
import { lineNumbers, drawSelection, keymap } from '@codemirror/view';
import {
  foldGutter,
  indentOnInput,
  syntaxHighlighting,
  defaultHighlightStyle,
  foldKeymap,
} from '@codemirror/language';
import { defaultKeymap } from '@codemirror/commands';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import type { Extension } from '@codemirror/state';
import {
  createCarbonFoldMarker,
  carbonFoldMarkerKeyHandler,
} from './marker-utils.ts';
import { createCarbonHighlightStyle } from './theme.ts';
import { createDiffDecorator } from './diff-decorator.ts';

export interface BaseCodeMirrorSetupOptions {
  foldCollapseLabel?: string;
  foldExpandLabel?: string;
  enableDiffDecorator?: boolean;
  hideLineNumbers?: boolean;
  hideFold?: boolean;
}

export function baseCodeMirrorSetup(
  options: BaseCodeMirrorSetupOptions = {}
): Extension {
  const {
    foldCollapseLabel = 'Collapse code block',
    foldExpandLabel = 'Expand code block',
    enableDiffDecorator = false,
    hideLineNumbers = false,
    hideFold = false,
  } = options;

  return [
    // Line number column for navigation and copy context
    ...(hideLineNumbers ? [] : [lineNumbers()]),
    // Folding affordances: keyboard handler + Carbon chevron gutter. Dropped
    // together when folding is hidden so no open/close control survives.
    ...(hideFold
      ? []
      : [
          carbonFoldMarkerKeyHandler(),
          foldGutter({
            markerDOM: createCarbonFoldMarker({
              collapseLabel: foldCollapseLabel,
              expandLabel: foldExpandLabel,
            }),
          }),
        ]),
    // Selection rendering that respects multiple carets
    drawSelection(),
    // Maintain indentation on new lines
    indentOnInput(),
    // Fallback syntax highlight style when no language-specific theme exists
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    // Add in Carbon theme
    createCarbonHighlightStyle(),
    // Auto-insert closing brackets and quotes
    closeBrackets(),
    // Bundle the keymaps we still rely on
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...(hideFold ? [] : foldKeymap),
      ...lintKeymap,
    ]),
    // Conditionally add diff line decorator for diff language
    ...(enableDiffDecorator ? [createDiffDecorator()] : []),
  ];
}
