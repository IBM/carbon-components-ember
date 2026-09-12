/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The **only** module in the code-snippet stack that imports
 * `@codemirror/*`/`@lezer/*` - reached exclusively through
 * `code-snippet.gts`'s dynamic `import()` (via `./codemirror-loader.ts`),
 * so a bundler splits CodeMirror's core into its own lazy chunk and a page
 * that never renders `AiChatCodeSnippet` never ships it. Each individual
 * language grammar (`@codemirror/lang-*`) is a further, separate lazy chunk
 * of its own - see `./languages.ts` and `LanguageController` - so even a
 * page that *does* render a snippet only ships the one language grammar it
 * actually detects/uses, not all 23.
 */
export { LanguageController } from './language-controller.ts';
export type { LanguageStateUpdate } from './language-controller.ts';
export { createContentSync } from './content-sync.ts';
export type { ContentSyncHandle } from './content-sync.ts';
export {
  createEditorView,
  applyLanguageSupport,
  updateReadOnlyConfiguration,
  updateContentAttributes,
} from './editor-manager.ts';
export { EditorView } from '@codemirror/view';
export { Compartment } from '@codemirror/state';
