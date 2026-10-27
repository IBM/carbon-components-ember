/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ported from `@carbon/ai-chat-components`'
 * `code-snippet/src/codemirror/content-sync.ts` - throttled, diff-based
 * content application (append-only and prefix-shrink fast paths, full
 * replace otherwise) so streaming a growing/shrinking string into the
 * editor doesn't reset the whole doc (and scroll position/selection) on
 * every token. The only real change from upstream: a small local
 * leading+trailing throttle instead of `lodash-es/throttle`, since this
 * addon has no existing `lodash-es` dependency. It waits with an
 * ember-concurrency task, so tests wait for it too.
 */
import { task, timeout } from 'ember-concurrency';
import type { EditorView } from '@codemirror/view';

// Calls `fn` at once, then at most once more per `ms` with the latest value.
class Throttle {
  #lastRun = 0;
  #pending: string | null = null;
  private readonly fn: (value: string) => void;
  private readonly ms: number;

  constructor(fn: (value: string) => void, ms: number) {
    this.fn = fn;
    this.ms = ms;
  }

  run(value: string) {
    this.#pending = value;
    void this.flush.perform();
  }

  cancel() {
    this.#pending = null;
    void this.flush.cancelAll();
  }

  private flush = task({ drop: true }, async () => {
    const remaining = this.ms - (Date.now() - this.#lastRun);
    if (remaining > 0) {
      await timeout(remaining);
    }
    const value = this.#pending;
    if (value !== null) {
      this.#lastRun = Date.now();
      this.#pending = null;
      this.fn(value);
    }
  });
}

interface ContentSyncHooks {
  getEditorView: () => EditorView | undefined;
  onAfterApply?: () => void;
  throttleMs?: number;
}

export interface ContentSyncHandle {
  update(content: string): void;
  cancel(): void;
}

export function createContentSync({
  getEditorView,
  onAfterApply,
  throttleMs = 200,
}: ContentSyncHooks): ContentSyncHandle {
  const throttled = new Throttle((content: string) => {
    const view = getEditorView();
    if (!view) {
      return;
    }

    const current = view.state.doc.toString();

    if (content === current) {
      return;
    }

    if (content.startsWith(current)) {
      const appended = content.slice(current.length);
      if (!appended.length) {
        return;
      }
      view.dispatch({
        changes: {
          from: current.length,
          to: current.length,
          insert: appended,
        },
      });
    } else if (current.startsWith(content)) {
      view.dispatch({
        changes: {
          from: content.length,
          to: current.length,
          insert: '',
        },
      });
    } else {
      view.dispatch({
        changes: {
          from: 0,
          to: current.length,
          insert: content,
        },
      });
    }

    if (onAfterApply) {
      requestAnimationFrame(() => {
        onAfterApply();
      });
    }
  }, throttleMs);

  return {
    update: (content: string) => throttled.run(content),
    cancel: () => throttled.cancel(),
  };
}
