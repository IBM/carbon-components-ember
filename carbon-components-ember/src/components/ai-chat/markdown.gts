/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked, cached } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { modifier as eModifier } from 'ember-modifier';
import { renderMarkdown } from './-markdown-render.ts';

const STREAM_THROTTLE_MS = 100;

export type Args = {
  /** Direct markdown source input. Always-controlled, always-authoritative. */
  markdown?: string;
  /**
   * Accepted for API parity with upstream's `sanitize-html` attribute, but
   * not wired to anything: this port always sanitizes rendered HTML via
   * DOMPurify, regardless of this flag. See `-markdown-render.ts`'s
   * `renderMarkdown` doc for why.
   */
  sanitizeHTML?: boolean;
  /** Strip all raw HTML from the parsed markdown. Defaults to `false`. */
  removeHTML?: boolean;
  /**
   * Throttles re-render to at most once per 100ms (leading + trailing),
   * matching upstream's own default streaming throttle - reduces layout
   * thrash while a caller is appending markdown token-by-token.
   */
  streaming?: boolean;
};

export interface AiChatMarkdownSignature {
  Element: HTMLDivElement;
  Args: Args;
}

/**
 * Renders markdown as sanitized, Carbon-styled HTML.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-markdown`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/markdown).
 *
 * ### Dependencies
 *
 * Adds `markdown-it` and `dompurify` as real runtime dependencies, matching
 * upstream's own parse-then-sanitize pipeline (rather than accepting
 * pre-rendered HTML and pushing sanitization onto the caller) - the same
 * call already made for `DatePicker`'s `flatpickr` and `Carousel`'s
 * `@carbon/utilities`. The three built-in markdown-it plugins upstream
 * vendors under its own `plugins/` folder (`markdown-it-attrs`,
 * `markdown-it-highlight`, `markdown-it-task-lists`) are ported as source
 * (`-markdown-it-attrs.ts` etc.), not added as npm dependencies - they
 * aren't published packages upstream depends on, they're upstream's own
 * (in `markdown-it-attrs`'s case, forked-and-restricted) files at that path.
 *
 * ### Sanitization is unconditional, not upstream-faithful
 *
 * Upstream's actual default configuration (`sanitize-html="false"` +
 * `html: true` in its `MarkdownIt` construction) renders raw HTML found in
 * the markdown source completely unsanitized - a real XSS hole for
 * untrusted (user- or LLM-generated) chat content. This port always runs
 * parsed output through DOMPurify before injecting it, regardless of
 * `@sanitizeHTML`; see `-markdown-render.ts`'s `renderMarkdown` for the
 * full reasoning. `@removeHTML` is unaffected and matches upstream exactly
 * (it disables raw-HTML parsing at the markdown-it level, on top of the
 * sanitizer that always runs anyway).
 *
 * ### Scope cut: no embedded interactive widgets, no extensibility layer
 *
 * Upstream's real renderer (`markdown-renderer.ts` + `markdown-token-tree.ts`,
 * ~1,200 lines combined) builds a diffed token tree and renders fenced code
 * blocks and tables as upstream's own not-yet-ported `cds-aichat-code-snippet`/
 * `cds-aichat-table` custom elements (with copy/show-more/sort/filter/page
 * behavior), and exposes `markdownItPlugins`/`customRenderers` extension
 * points plus per-widget label args (`codeSnippet*`/`table*`). None of that
 * is ported: fenced code renders as plain `<pre><code>`, markdown tables as
 * plain `<table>` (styled via `_markdown.scss`), and the label/extensibility
 * args aren't accepted at all - they'd be dead public API with nothing to
 * label. This mirrors the same "port the public surface, not the internal
 * managers" scope cut already made for `ChatShell`'s manager classes and
 * `AiChatTable`'s DOM tricks. `<mark>` highlight syntax (`==text==`) and GFM
 * task-list checkboxes (`- [ ] foo`) ARE ported, since both are plain
 * markup, not widgets - checkboxes render read-only (`disabled`), since
 * there's no `checklist.onToggle`-equivalent callback to wire an
 * interactive one to.
 *
 * Upstream's fallback to light-DOM text content as the initial markdown
 * source (when `markdown` is never set as a property) isn't reproduced
 * either - this port's `@markdown` is the only source, always.
 */
export default class AiChatMarkdown extends Component<AiChatMarkdownSignature> {
  @tracked private displayedMarkdown = this.args.markdown ?? '';
  private pendingTimer?: ReturnType<typeof setTimeout>;
  private lastRenderedAt = 0;

  @cached
  get renderedHtml() {
    return htmlSafe(
      renderMarkdown(
        this.displayedMarkdown ?? '',
        this.args.removeHTML ?? false,
      ),
    );
  }

  // Re-runs whenever `@markdown`/`@streaming` change (ember-modifier tracks
  // its own positional args and re-invokes on change, tearing down the
  // previous call's returned cleanup first). Without `@streaming`, mirrors
  // the arg straight through; with it, throttles to at most once per
  // 100ms, leading + trailing - matching upstream's own `scheduleRender`
  // throttle, which exists to avoid reparsing/re-rendering on every token
  // of a fast streaming append.
  throttle = eModifier<{
    Element: Element;
    Args: { Positional: [string | undefined, boolean | undefined] };
  }>((_element, [markdown, streaming]) => {
    const value = markdown ?? '';

    if (!streaming) {
      this.displayedMarkdown = value;
      return;
    }

    const elapsed = Date.now() - this.lastRenderedAt;
    if (elapsed >= STREAM_THROTTLE_MS) {
      this.lastRenderedAt = Date.now();
      this.displayedMarkdown = value;
    } else {
      this.pendingTimer = setTimeout(() => {
        this.lastRenderedAt = Date.now();
        this.displayedMarkdown = value;
      }, STREAM_THROTTLE_MS - elapsed);
    }

    return () => clearTimeout(this.pendingTimer);
  });

  <template>
    <div
      class='cds-aichat-markdown'
      {{this.throttle @markdown @streaming}}
      ...attributes
    >{{this.renderedHtml}}</div>
  </template>
}
