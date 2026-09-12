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
 * addon has no existing `lodash-es` dependency and the behavior needed
 * (invoke immediately, then at most once more per interval with the
 * latest args) is a dozen lines.
 */
import type { EditorView } from '@codemirror/view';

function throttle(fn: (value: string) => void, ms: number) {
  let timer: number | null = null;
  let pendingValue: string | null = null;
  let lastRun = 0;

  function invoke(value: string) {
    lastRun = Date.now();
    pendingValue = null;
    fn(value);
  }

  function run(value: string) {
    const now = Date.now();
    const remaining = ms - (now - lastRun);
    if (remaining <= 0) {
      if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
      }
      invoke(value);
      return;
    }

    pendingValue = value;
    if (timer === null) {
      timer = window.setTimeout(() => {
        timer = null;
        if (pendingValue !== null) {
          invoke(pendingValue);
        }
      }, remaining);
    }
  }

  function cancel() {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
    pendingValue = null;
  }

  return { run, cancel };
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
  const throttled = throttle((content: string) => {
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
