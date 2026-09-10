/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// The parse-then-sanitize pipeline behind `markdown.gts`. Ported from
// @carbon/ai-chat-components' markdown-it setup
// (src/components/markdown/src/markdown-token-tree.ts's `createMarkdownIt`)
// but collapsed to a single `markdown-it .render()` call producing a plain
// HTML string, rather than upstream's token-tree diff + Lit `TemplateResult`
// renderer - see `markdown.gts`'s class doc for why that streaming/diffing
// machinery and its `cds-aichat-table`/`cds-aichat-code-snippet` embeds
// aren't reproduced here.

import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import { markdownItAttrs } from './-markdown-it-attrs.ts';
import { markdownItHighlight } from './-markdown-it-highlight.ts';
import { markdownItTaskLists } from './-markdown-it-task-lists.ts';

function createMarkdownIt(html: boolean): MarkdownIt {
  const md = new MarkdownIt('commonmark', {
    html,
    breaks: true,
    linkify: true,
  })
    .enable('table')
    .enable('strikethrough')
    .enable('linkify')
    .use(markdownItAttrs)
    .use(markdownItHighlight)
    .use(markdownItTaskLists);

  // Upstream's task-lists plugin (`-markdown-it-task-lists.ts`) stamps
  // `task_checkbox_open`/`task_checkbox_close` tokens with tag
  // `cds-checkbox` for its own Lit custom element. This port has no
  // `cds-checkbox` equivalent (and no `checklist.onToggle` callback to wire
  // one up to - see `markdown.gts`'s class doc), so render them as plain,
  // read-only `<input type="checkbox">` instead of letting markdown-it's
  // generic tag-based fallback emit an unstyled, meaningless
  // `<cds-checkbox>` element.
  md.renderer.rules['task_checkbox_open'] = (tokens, index) => {
    const checked = tokens[index]!.attrGet('checked') === 'true';
    return `<input type="checkbox" class="cds-aichat-markdown__checkbox"${checked ? ' checked' : ''} disabled>`;
  };
  md.renderer.rules['task_checkbox_close'] = () => '';

  return md;
}

let htmlEnabledInstance: MarkdownIt | undefined;
let htmlDisabledInstance: MarkdownIt | undefined;

function getMarkdownIt(removeHTML: boolean): MarkdownIt {
  if (removeHTML) {
    return (htmlDisabledInstance ??= createMarkdownIt(false));
  }
  return (htmlEnabledInstance ??= createMarkdownIt(true));
}

/**
 * Parses `markdown` and returns sanitized HTML, safe to inject via
 * `{{htmlSafe}}`.
 *
 * Unlike upstream, sanitization is **unconditional** - it does not depend
 * on a `sanitizeHTML`-equivalent flag. Upstream's own default
 * (`sanitizeHTML: false` combined with `html: true`) renders raw HTML found
 * in the markdown source completely unsanitized; that's a real XSS hole for
 * the kind of untrusted (user- or LLM-generated) chat-transcript content
 * this widget exists to render, so this port always runs the parsed output
 * through DOMPurify regardless of what the caller passes. `removeHTML`
 * still matches upstream exactly: it disables raw-HTML parsing at the
 * markdown-it level entirely (`html: false`), so `<tag>` sequences in the
 * source render as literal escaped text instead of being parsed as markup
 * in the first place.
 */
export function renderMarkdown(markdown: string, removeHTML: boolean): string {
  const md = getMarkdownIt(removeHTML);
  const rawHtml = md.render(markdown);
  return DOMPurify.sanitize(rawHtml);
}
