/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import './demo.css';

import config from 'docs-app/config/environment';
import ThemeSupport from 'docs-app/docs-support/theme-support';
import ThemeSwitcher from 'docs-app/docs-support/theme-switcher';

import { InternalLink } from '@universal-ember/docs-support';

import AiChatDemoFloating from './floating.gts';
import AiChatDemoFullWindow from './full-window.gts';

import type { TOC } from '@ember/component/template-only';

/**
 * A standalone, fully-assembled demo of the Carbon AI Chat components
 * ported so far, comparable in scope to upstream carbon-ai-chat's own
 * `demo/` package (https://github.com/carbon-design-system/carbon-ai-chat/tree/main/demo)
 * - a real host application wiring `ai-chat/*` together, not another
 * per-component doc page. Routed at `/ai-chat-demo` (see `router.ts`),
 * outside kolay's markdown-driven `page` route, so it renders full-bleed
 * with none of the docs sidebar/prose chrome - see AGENTS.md's "Porting
 * Carbon AI Chat" section for why.
 *
 * Two sections, each a full page-worth of layout:
 * - `full-window.gts` hand-assembles `ChatShell` directly, filling its
 *   container - the "custom response types" and "writeable elements"
 *   showcase.
 * - `floating.gts` uses the one-line `<SessionShell />` container as a
 *   corner-anchored launcher widget - the "drop-in" showcase.
 *
 * Both render through the same `carbon.ai-chat-session` service (different
 * `@instanceId`s - see AGENTS.md's multi-instance isolation section), so
 * `ThemeSupport`/`ThemeSwitcher` (this app's own live-preview styling
 * pieces, reused here directly since this route has no other source of
 * Carbon CSS - unlike every other real docs-app route, which never renders
 * actual Carbon components outside a kolay markdown demo) only need to be
 * included once for the whole page.
 */
const AiChatDemo: TOC<{ Blocks: { default: [] } }> = <template>
  <ThemeSupport />
  <div class="cds-aichat-demo__page">
    <div class="cds-aichat-demo__toolbar">
      <div>
        <h1>Carbon AI Chat — demo app</h1>
        <p>
          A full assembled app built from this addon's ported `ai-chat/*` components and
          `carbon.ai-chat-session` service - see the
          <InternalLink href="{{config.rootURL}}2-components/ai-chat/session-shell.md">SessionShell
            docs</InternalLink>
          for the underlying API.
        </p>
      </div>
      <ThemeSwitcher />
    </div>

    <section class="cds-aichat-demo__section">
      <h2>Full-window layout</h2>
      <p>Hand-assembled from `ChatShell` directly - custom response types, a custom workspace panel,
        and writeable-element content.</p>
      <AiChatDemoFullWindow />
    </section>

    <section class="cds-aichat-demo__section">
      <h2>Floating launcher layout</h2>
      <p>The one-line `&lt;SessionShell /&gt;` container, anchored to the corner of the viewport -
        click the button in the bottom-right corner.</p>
    </section>
  </div>
  <AiChatDemoFloating />
</template>;

export default AiChatDemo;
