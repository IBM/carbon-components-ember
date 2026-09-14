/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { languages as allLanguages } from '@codemirror/language-data';

/**
 * Upstream (`@carbon/ai-chat-components`) vendors its own fork of
 * `@codemirror/language-data` (`code-snippet/src/codemirror/language-data.ts`,
 * ~1,250 lines) purely to drop one entry ("Brainfuck" - an esoteric
 * language whose name reads as profanity, undesirable in a chat UI) from
 * the descriptor list. That's the *only* difference from the real package
 * (diffed directly against the real npm build) - every `LanguageDescription`
 * entry's own `load()` already does its own `import('@codemirror/lang-*')`,
 * so the fork buys no lazy-loading behavior the real package doesn't
 * already have. This port uses the real, unforked `@codemirror/language-data`
 * and reproduces the one-entry filter here instead of vendoring the fork,
 * so the 23 `@codemirror/lang-*` + `@codemirror/legacy-modes` packages stay
 * ordinary transitive dependencies (see `@codemirror/language-data`'s own
 * `package.json`) rather than code this addon has to keep in sync with
 * upstream by hand.
 */
export const languages = allLanguages.filter(
  (language) => language.name !== 'Brainfuck'
);
