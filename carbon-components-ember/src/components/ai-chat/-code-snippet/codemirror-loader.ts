/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The dynamic `import()` split point for the CodeMirror runtime, mirroring
 * `-prompt-line/rich-loader.ts`'s shape exactly: a module-level cache so
 * every `AiChatCodeSnippet` instance on a page shares one `import()`
 * instead of racing its own.
 */

type CodeMirrorRuntimeModule = typeof import('./codemirror-runtime.ts');

let runtimePromise: Promise<CodeMirrorRuntimeModule> | null = null;

/**
 * Lazily loads the CodeMirror runtime so the heavy editor dependencies are
 * only pulled into the bundle once a code snippet actually renders.
 */
export function loadCodeMirrorRuntime(): Promise<CodeMirrorRuntimeModule> {
  if (!runtimePromise) {
    runtimePromise = import('./codemirror-runtime.ts');
    // Don't memoize a rejection - a failed load (e.g. a network blip on the
    // lazy chunk) must let the next caller reach a fresh `import()`, not
    // replay the same rejected promise forever.
    runtimePromise.catch(() => {
      runtimePromise = null;
    });
  }
  return runtimePromise;
}

/**
 * Test-only: clears the module-level cache so the next
 * `loadCodeMirrorRuntime()` call starts cold again. Without this, the
 * first test in a suite run that mounts a code snippet permanently warms
 * this module for every later test in the same browser session.
 */
export function resetCodeMirrorRuntimeForTests(): void {
  runtimePromise = null;
}

export type { CodeMirrorRuntimeModule };
