/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The dynamic `import()` split point for the Tiptap runtime, extracted out
 * of `prompt-line.gts` so both the cold-start upgrade path (`upgradeToRich`)
 * and the warm-mount fast path (`mountSurface`'s synchronous
 * `getRichRuntimeIfLoaded()` check) share one module-level cache instead of
 * each racing their own `import()`. Ported from `@carbon/ai-chat-components`'
 * `prompt-line-rich-loader.ts`, minus its SSR (`typeof window === 'undefined'`)
 * branch — nothing else in this stack has one.
 */

type RichRuntimeModule = typeof import('./rich-controller.ts');

let runtimePromise: Promise<RichRuntimeModule> | null = null;
let runtime: RichRuntimeModule | null = null;

/** Load (once) the Tiptap runtime chunk. Concurrent callers share one `import()`. */
export function loadRichRuntime(): Promise<RichRuntimeModule> {
  if (!runtimePromise) {
    runtimePromise = import('./rich-controller.ts').then((module) => {
      runtime = module;
      return module;
    });
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
 * The runtime module if it has already loaded, else `null`. Synchronous, so
 * `mountSurface` can decide to mount the rich editor directly on first
 * render instead of always starting with the textarea.
 */
export function getRichRuntimeIfLoaded(): RichRuntimeModule | null {
  return runtime;
}

export type { RichRuntimeModule };
