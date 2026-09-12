/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ported verbatim from `@carbon/ai-chat-components`'
 * `code-snippet/src/codemirror/theme.ts` - a CodeMirror `EditorView.theme()`
 * plus a `HighlightStyle` built entirely from `--cds-syntax-*` custom
 * properties, so the editor tracks Carbon's light/dark theme automatically.
 */
import { EditorView, ViewPlugin } from '@codemirror/view';
import type { ViewUpdate } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import type { TagStyle } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import type { Tag } from '@lezer/highlight';

/**
 * Makes `.cm-scroller` keyboard focusable (tabindex 0 instead of -1), fixing
 * the "scrollable-region-focusable" accessibility violation.
 */
export function makeScrollerFocusable() {
  return ViewPlugin.fromClass(
    class {
      constructor(view: EditorView) {
        this.updateScrollerTabIndex(view);
      }

      update(update: ViewUpdate) {
        // Re-apply on any update to ensure it persists
        this.updateScrollerTabIndex(update.view);
      }

      updateScrollerTabIndex(view: EditorView) {
        const scroller = view.scrollDOM;
        if (scroller && scroller.getAttribute('tabindex') === '-1') {
          scroller.setAttribute('tabindex', '0');
        }
      }
    }
  );
}

/**
 * A CodeMirror theme built from Carbon CSS custom properties, so the editor
 * automatically adapts to Carbon's light/dark themes.
 */
export function createCarbonTheme() {
  return EditorView.theme({
    '.cm-editor': {
      background: 'var(--cds-layer, #ffffff)',
      color: 'var(--cds-text-primary, #161616)',
    },

    // Cursor / caret
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: 'var(--cds-text-primary, #161616)',
    },

    // Gutters. Match the snippet surface (chat-shell-background) so the gutter
    // and code area read as one surface. The disabled state overrides both to
    // $layer in code-snippet.scss (:host([disabled])), keeping them matched.
    '.cm-gutters': {
      backgroundColor: 'var(--cds-chat-shell-background, #ffffff)',
      color: 'var(--cds-text-helper, #6f6f6f)',
      border: 'none',
    },

    '.cm-gutterElement .cm-lineNumbers': {
      textAlign: 'end',
    },

    '.cm-foldGutter': {
      paddingInlineEnd: '0.25rem',
    },

    // Editor content
    '.cm-content': {
      flexBasis: '0 !important',
      caretColor: 'var(--cds-text-primary, #161616)',
    },

    // The snippet's container element is the single source of truth for
    // height. It declares its own min/max-block-size and overflow rules in
    // code-snippet.scss; the scroller sits inside it and should inherit
    // those bounds rather than fight them with its own independent
    // floor/ceiling.
    '.cm-scroller': {
      fontFamily: "var(--cds-code-01-font-family, 'IBM Plex Mono', monospace)",
      fontSize: 'var(--cds-code-01-font-size, 0.875rem)',
      fontWeight: 'var(--cds-code-01-font-weight, 400)',
      letterSpacing: 'var(--cds-code-01-letter-spacing, 0.16px)',
      lineHeight: 'var(--cds-code-01-line-height, 1.5)',
      maxBlockSize: 'var(--cds-snippet-max-height, 16rem)',
      minBlockSize: 'var(--cds-snippet-min-height, auto)',
    },

    // Fold gutter / caret icons
    '.cm-foldGutter .cm-gutterElement': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '16px',
    },

    '.cm-foldGutter svg': {
      width: '12px',
      height: '12px',
      cursor: 'pointer',
      transition: 'transform 0.11s cubic-bezier(0.2, 0, 0.38, 0.9)',
      fill: 'var(--cds-icon-primary, #161616)',
    },

    ".cm-foldGutter svg[aria-expanded='true']": {
      transform: 'rotate(0deg)',
    },

    ".cm-foldGutter svg[aria-expanded='false']": {
      transform: 'rotate(-90deg)',
    },

    '.cm-foldGutter svg:focus': {
      outline: '2px solid var(--cds-focus, #0f62fe)',
    },

    // Search / selection highlights
    '.cm-searchMatch': {
      backgroundColor: 'var(--cds-highlight, #d0e2ff)',
    },
    '.cm-searchMatch-selected': {
      backgroundColor: 'var(--cds-highlight, #d0e2ff)',
    },
    '.cm-selectionBackground': {
      backgroundColor: 'var(--cds-highlight, #d0e2ff)',
    },
    '.cm-selectionMatch': {
      backgroundColor: 'var(--cds-highlight, #d0e2ff)',
    },

    '&.cm-focused .cm-selectionBackground': {
      backgroundColor: 'var(--cds-highlight, #d0e2ff) !important',
    },

    '&.cm-focused .cm-selectionMatch': {
      backgroundColor: 'var(--cds-highlight, #d0e2ff) !important',
    },

    // Native selection fallback
    '.cm-content ::selection': {
      backgroundColor: 'var(--cds-highlight, #d0e2ff) !important',
    },
    '&.cm-focused .cm-content ::selection': {
      backgroundColor: 'var(--cds-highlight, #d0e2ff) !important',
    },
  });
}

/**
 * Syntax highlighting built entirely from `--cds-syntax-*` custom
 * properties (emitted per-theme in `code-snippet.scss`), so highlight
 * colors follow Carbon's light/dark theme automatically. Fallback values
 * mirror VSCode Light defaults.
 */
export function createCarbonHighlightStyle() {
  return syntaxHighlighting(carbonHighlightStyle);
}

type StyleSpec = TagStyle & { color: string };

const TAG_REGISTRY = t as unknown as Record<string, Tag | readonly Tag[]>;

const toVarName = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Za-z])([0-9])/g, '$1-$2')
    .toLowerCase();

const colorVar = (token: string) =>
  `var(--cds-syntax-${token}, var(--cds-text-primary, #161616))`;

const resolveTag = (tagName: string) => TAG_REGISTRY[tagName];

const BASE_TAG_NAMES = [
  'comment',
  'lineComment',
  'blockComment',
  'docComment',
  'name',
  'variableName',
  'typeName',
  'tagName',
  'propertyName',
  'attributeName',
  'className',
  'labelName',
  'namespace',
  'macroName',
  'literal',
  'string',
  'docString',
  'character',
  'attributeValue',
  'number',
  'integer',
  'float',
  'bool',
  'regexp',
  'escape',
  'color',
  'url',
  'keyword',
  'self',
  'null',
  'atom',
  'unit',
  'modifier',
  'operatorKeyword',
  'controlKeyword',
  'definitionKeyword',
  'moduleKeyword',
  'operator',
  'derefOperator',
  'arithmeticOperator',
  'logicOperator',
  'bitwiseOperator',
  'compareOperator',
  'updateOperator',
  'definitionOperator',
  'typeOperator',
  'controlOperator',
  'punctuation',
  'separator',
  'bracket',
  'angleBracket',
  'squareBracket',
  'paren',
  'brace',
  'content',
  'heading',
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
  'contentSeparator',
  'list',
  'quote',
  'emphasis',
  'strong',
  'link',
  'monospace',
  'strikethrough',
  'invalid',
  'meta',
  'documentMeta',
  'annotation',
  'processingInstruction',
] as const;

const HEADING_TAG_NAMES = [
  'heading',
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
] as const;

const manualConfigs: Array<{
  tagName: string;
  style: Partial<Omit<StyleSpec, 'tag'>>;
}> = [
  ...HEADING_TAG_NAMES.map((tagName) => ({
    tagName,
    style: {
      fontWeight: 'bold',
      textDecoration: 'underline',
    },
  })),
  { tagName: 'link', style: { textDecoration: 'underline' } },
  { tagName: 'emphasis', style: { fontStyle: 'italic' } },
  { tagName: 'strong', style: { fontWeight: 'bold' } },
  { tagName: 'strikethrough', style: { textDecoration: 'line-through' } },
];

const MANUAL_TAG_NAMES = new Set(manualConfigs.map(({ tagName }) => tagName));

const manualTokenStyles: StyleSpec[] = manualConfigs
  .map(({ tagName, style }) => {
    const tag = resolveTag(tagName);
    if (!tag) {
      return null;
    }
    return {
      tag,
      color: colorVar(toVarName(tagName)),
      ...style,
    };
  })
  .filter((style): style is StyleSpec => Boolean(style));

const autoTagStyles: StyleSpec[] = BASE_TAG_NAMES.filter(
  (tagName) => !MANUAL_TAG_NAMES.has(tagName)
)
  .map((tagName) => {
    const tag = resolveTag(tagName);
    if (!tag) {
      return null;
    }
    return {
      tag,
      color: colorVar(toVarName(tagName)),
    };
  })
  .filter((style): style is StyleSpec => Boolean(style));

const modifierTokenStyles: StyleSpec[] = [
  { tag: t.definition(t.variableName), color: colorVar('definition') },
  { tag: t.definition(t.propertyName), color: colorVar('definition') },
  { tag: t.definition(t.typeName), color: colorVar('definition') },
  { tag: t.definition(t.className), color: colorVar('definition') },
  { tag: t.constant(t.variableName), color: colorVar('constant') },
  { tag: t.constant(t.propertyName), color: colorVar('constant') },
  { tag: t.constant(t.typeName), color: colorVar('constant') },
  { tag: t.function(t.variableName), color: colorVar('function') },
  { tag: t.function(t.propertyName), color: colorVar('function') },
  { tag: t.function(t.typeName), color: colorVar('function') },
  { tag: t.standard(t.variableName), color: colorVar('standard') },
  { tag: t.standard(t.propertyName), color: colorVar('standard') },
  { tag: t.local(t.variableName), color: colorVar('local') },
  { tag: t.local(t.propertyName), color: colorVar('local') },
  { tag: t.special(t.variableName), color: colorVar('special') },
  { tag: t.special(t.propertyName), color: colorVar('special') },
  { tag: t.special(t.string), color: colorVar('special-string') },
];

const carbonHighlightStyle = HighlightStyle.define([
  ...modifierTokenStyles,
  ...manualTokenStyles,
  ...autoTagStyles,
]);
