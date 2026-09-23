import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitUntil } from '@ember/test-helpers';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import Processing from 'carbon-components-ember/components/ai-chat/processing';
import ReasoningSteps from 'carbon-components-ember/components/ai-chat/reasoning-steps';
import Markdown from 'carbon-components-ember/components/ai-chat/markdown';

// Registers the real custom elements as a side effect - see each import's
// own package for the tag(s) it defines (`cds-aichat-processing`,
// `cds-aichat-reasoning-steps` + `cds-aichat-reasoning-step`).
import '@carbon/ai-chat-components/es/components/processing/index.js';
import '@carbon/ai-chat-components/es/components/reasoning-steps/index.js';
import '@carbon/ai-chat-components/es/components/markdown/index.js';

import { normalizeElement } from '../../../../dom-parity/lib/normalize-dom.mjs';
import {
  diffNormalized,
  applyKnownDifferences,
} from '../../../../dom-parity/lib/diff-normalized.mjs';
import { stripClasses } from '../../../../dom-parity/lib/strip-classes.mjs';
import {
  flattenComposedTree,
  waitForCustomElementsReady,
} from '../../../../dom-parity/lib/flatten-composed-tree.mjs';
import knownDifferences from '../../../../dom-parity/known-differences.json';

/**
 * DOM parity against `@carbon/ai-chat-components` - the Lit widget library
 * these Ember components are ported from (see AGENTS.md's "Porting Carbon
 * AI Chat" section). This is a second, independent comparison path from
 * `dom-parity-test.gts`'s `@carbon/react` one, for two reasons that don't
 * apply to that path:
 *
 * 1. **Live, not fixture-based.** `@carbon/react` output is pre-rendered
 *    offline into committed fixtures (`dom-parity/generate.mjs`) because a
 *    plain jsdom `react-dom/client` mount is enough to reproduce it. Lit
 *    depends on real shadow DOM/custom-element upgrade timing that jsdom
 *    doesn't faithfully reproduce, so this path instead mounts the real,
 *    pinned `@carbon/ai-chat-components` custom elements directly in this
 *    suite's real Chromium (via Playwright) and compares live, every run -
 *    no fixture, no separate regeneration step, no fixture-drift risk.
 * 2. **Classes are excluded from the comparison.** `@carbon/react` and
 *    Ember are both meant to emit the *same* `cds--*` class names - a
 *    class diff there is a real signal. `@carbon/ai-chat-components`
 *    renders into shadow DOM and styles itself with plain, shadow-scoped
 *    class names (e.g. `.dots`); the Ember port deliberately uses
 *    unrelated, globally-scoped BEM names instead (e.g.
 *    `cds-aichat-processing__dots`), since it has no shadow boundary to
 *    scope styles within. Comparing class strings here would flag that
 *    intentional translation as a failure on every element. See
 *    `strip-classes.mjs` for the full reasoning. What this path *does*
 *    still assert in full: tag structure, semantic attributes (role,
 *    aria-*, id references, disabled/hidden/inert, ...), text content, and
 *    SVG geometry. A regression in the Ember port's own class names is
 *    covered by that component's own rendering/style-snapshot tests
 *    instead, not by this harness.
 *
 * `flattenComposedTree` (see dom-parity/lib/flatten-composed-tree.mjs) also
 * unwraps every nested custom-element boundary it encounters, not just the
 * outermost one - the Ember port never wraps a child component's rendered
 * output in an extra host element, so a nested upstream custom element
 * (e.g. a `cds-aichat-reasoning-step` slotted into `cds-aichat-reasoning-
 * steps`) is folded into its own shadow content's root element the same
 * way the top-level one is, rather than showing up as an unmatchable extra
 * tag in the diff.
 */
function assertAiChatDomParity(
  assert: Assert,
  component: string,
  variant: string,
  upstreamRoot: Element | null,
  emberRoot: Element | null,
) {
  if (!upstreamRoot) {
    assert.ok(false, `${component}/${variant}: nothing rendered upstream`);
    return;
  }
  if (!emberRoot) {
    assert.ok(false, `${component}/${variant}: nothing rendered by the Ember port`);
    return;
  }

  const upstreamTree = stripClasses(normalizeElement(upstreamRoot));
  const emberTree = stripClasses(normalizeElement(emberRoot));
  const differences = diffNormalized(upstreamTree, emberTree);
  const known =
    (knownDifferences as Record<string, Array<{ path: string; reason: string; variant?: string }>>)[
      component
    ] ?? [];
  const unexpected = applyKnownDifferences(differences, known, variant);

  assert.deepEqual(
    unexpected,
    [],
    `${component}/${variant} should render the same structure/semantic-attributes/text as ` +
      `@carbon/ai-chat-components, modulo classes (see this file's module doc) and the ` +
      `documented gaps in dom-parity/known-differences.json`,
  );
}

/** Mounts a real upstream custom element, appended to `document.body` so its
 * shadow DOM/slot assignment is live, and waits for it (and anything it
 * composes) to finish upgrading/rendering. Returns the flattened comparison
 * root - see flatten-composed-tree.mjs - plus a `cleanup` to remove it.
 */
async function mountUpstream(
  tagName: string,
  setup: (host: HTMLElement) => void,
): Promise<{ root: Element | null; cleanup: () => void }> {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const host = document.createElement(tagName);
  setup(host);
  container.appendChild(host);
  await waitForCustomElementsReady(host);

  const flattened = flattenComposedTree(host);
  return {
    root: flattened instanceof Element ? flattened : null,
    cleanup: () => container.remove(),
  };
}

/** Like `mountUpstream`, but for `cds-aichat-markdown` specifically: its
 * first real render is throttled (`scheduleRender`, 100ms leading+trailing),
 * so `updateComplete` (which `waitForCustomElementsReady` awaits) can
 * resolve before the throttled render actually lands - poll for real
 * content instead of flattening immediately.
 */
async function mountUpstreamMarkdown(
  markdown: string,
): Promise<{ root: Element | null; cleanup: () => void }> {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const host = document.createElement('cds-aichat-markdown');
  host.setAttribute('markdown', markdown);
  container.appendChild(host);
  await waitForCustomElementsReady(host);
  await waitUntil(() => (host.shadowRoot?.textContent ?? '').trim().length > 0);

  const flattened = flattenComposedTree(host);
  return {
    root: flattened instanceof Element ? flattened : null,
    cleanup: () => container.remove(),
  };
}

module('DOM parity | Carbon AI Chat', function (hooks) {
  setupRenderingTest(hooks);

  module('Processing', function () {
    test('default', async function (this: RenderingTestContext, assert) {
      const { root, cleanup } = await mountUpstream('cds-aichat-processing', () => {});
      await render(<template><Processing /></template>);
      assertAiChatDomParity(
        assert,
        'AiChatProcessing',
        'default',
        root,
        this.element.firstElementChild,
      );
      cleanup();
    });

    test('loop', async function (this: RenderingTestContext, assert) {
      const { root, cleanup } = await mountUpstream('cds-aichat-processing', (host) => {
        host.toggleAttribute('loop', true);
      });
      await render(<template><Processing @loop={{true}} /></template>);
      assertAiChatDomParity(
        assert,
        'AiChatProcessing',
        'loop',
        root,
        this.element.firstElementChild,
      );
      cleanup();
    });

    test('quick-load', async function (this: RenderingTestContext, assert) {
      const { root, cleanup } = await mountUpstream('cds-aichat-processing', (host) => {
        host.toggleAttribute('quick-load', true);
      });
      await render(<template><Processing @quickLoad={{true}} /></template>);
      assertAiChatDomParity(
        assert,
        'AiChatProcessing',
        'quick-load',
        root,
        this.element.firstElementChild,
      );
      cleanup();
    });
  });

  module('ReasoningSteps', function () {
    test('open, one static + one interactive step', async function (this: RenderingTestContext, assert) {
      const { root, cleanup } = await mountUpstream('cds-aichat-reasoning-steps', (host) => {
        host.toggleAttribute('open', true);

        const staticStep = document.createElement('cds-aichat-reasoning-step');
        staticStep.setAttribute('title', 'No body');
        host.appendChild(staticStep);

        const interactiveStep = document.createElement('cds-aichat-reasoning-step');
        interactiveStep.setAttribute('title', 'Has body');
        interactiveStep.textContent = 'Body content';
        host.appendChild(interactiveStep);
      });

      await render(
        <template>
          <ReasoningSteps @open={{true}} as |Step|>
            <Step @title='No body' />
            <Step @title='Has body'>Body content</Step>
          </ReasoningSteps>
        </template>,
      );

      // The interactive step's chevron (ChevronRight) loads its SVG lazily
      // via TrackedPromise - render() alone doesn't wait for it, and
      // settled() doesn't reliably either (see
      // project_lazy_icon_test_pattern). Only the interactive step has an
      // icon (the static step uses a plain "-" character instead).
      await waitUntil(() => this.element.querySelectorAll('svg').length === 1);

      assertAiChatDomParity(
        assert,
        'AiChatReasoningSteps',
        'open-with-steps',
        root,
        this.element.firstElementChild,
      );
      cleanup();
    });

    test('closed, one interactive step', async function (this: RenderingTestContext, assert) {
      const { root, cleanup } = await mountUpstream('cds-aichat-reasoning-steps', (host) => {
        const step = document.createElement('cds-aichat-reasoning-step');
        step.setAttribute('title', 'Has body');
        step.textContent = 'Body content';
        host.appendChild(step);
      });

      await render(
        <template>
          <ReasoningSteps @open={{false}} as |Step|>
            <Step @title='Has body'>Body content</Step>
          </ReasoningSteps>
        </template>,
      );

      // See the "open, one static + one interactive step" test above -
      // same lazy-icon race, same single-interactive-step icon count.
      await waitUntil(() => this.element.querySelectorAll('svg').length === 1);

      assertAiChatDomParity(
        assert,
        'AiChatReasoningSteps',
        'closed-with-steps',
        root,
        this.element.firstElementChild,
      );
      cleanup();
    });
  });

  module('Markdown', function () {
    test('headings, emphasis, and a paragraph', async function (this: RenderingTestContext, assert) {
      const src = '# Title\n\nSome **bold** and _italic_ text.';
      const { root, cleanup } = await mountUpstreamMarkdown(src);
      await render(<template><Markdown @markdown={{src}} /></template>);
      assertAiChatDomParity(
        assert,
        'AiChatMarkdown',
        'headings-emphasis-paragraph',
        root,
        this.element.firstElementChild,
      );
      cleanup();
    });
  });

  // The rest of this component family isn't coverable by this harness, for
  // one of four reasons - confirmed empirically (mounting each and reading
  // the real error/output), not just by reading source. See dom-parity/
  // README.md's "Adding a component to this path" section for the general
  // guidance this follows (slot-dominated shadow templates give weak
  // coverage; pick a different variant or skip and say why).
  //
  // 1. Upstream's shadow root renders multiple sibling top-level elements,
  //    which `flattenComposedTree`'s "a shadow root renders exactly one
  //    root element" invariant doesn't support (throws
  //    "expected exactly one rendered root element ... got N") - and
  //    Ember's own root is always a single element, so there's no shared
  //    node for `diffNormalized` even to start walking from:
  //    - `FileUploads` (`cds-aichat-file-uploads`): two sibling live-region
  //      `<div>`s even in the empty state ("got 2"), three once uploads are
  //      shown.
  //    - `FileUploadItem` (`cds-aichat-file-upload-item`): wraps `@carbon/
  //      web-components`' `cds-file-uploader-item`, whose own shadow root
  //      renders a `<p>`/`<span>`/`<div>` sibling trio ("got 4").
  //    - `WorkspaceShellHeader`'s non-collapsible branch (no `@collapsible`):
  //      a `<div class="...header-content">` and a `<slot name="header-
  //      action">` sibling, not one wrapped root (its `@collapsible` branch
  //      *is* single-root - see reason 3 below for why it's still skipped).
  // 2. Real markup, but dominated by caller-supplied `<slot>` content with
  //    little or no markup of the component's own - the README's own
  //    "weak coverage" case:
  //    - `ChatShell`: real wrapper `<div>`s, but every piece of actual
  //      content (header/history/workspace/messages/footer/panels) is a
  //      named `<slot>`.
  //    - `WorkspaceShell`: five bare `<slot>`s, no wrapper element of its
  //      own at all (also hits reason 1's multi-root problem the moment
  //      more than one slot has assigned content).
  //    - `WorkspaceShellBody`: `<slot></slot>`, nothing else.
  //    - `PromptLineShell`: six named-slot wrapper `<div>`s
  //      (editor/message-actions/file-uploads/autocomplete-content/field-
  //      messaging/send-control), no other real markup - matches upstream's
  //      own render(), which is the same slot scaffolding.
  //    - `PromptLine`: a single `<div class="frame"><slot name="editor">
  //      </slot></div>` on both sides.
  // 3. Real markup, but only by way of a component this path doesn't (yet)
  //    cover, or one gated behind todo #860's interaction/floating-ui
  //    decision - a comparison here would mostly be diffing an unrelated
  //    or not-yet-built piece, not this component's own structure:
  //    - `Launcher` and `Carousel`: both wrap this addon's *own* `Tooltip`
  //      around a plain `<button>`/its own `Button`, where upstream wraps
  //      `cds-aichat-button`/`cds-icon-button` (which carry their *own*
  //      built-in tooltip mechanism) - the two sides diverge at the second
  //      level down with no shared shape, and `Tooltip`'s own dom-parity
  //      coverage is itself blocked on #860.
  //    - `WorkspaceShellHeader`'s `@collapsible` branch: single-root, but
  //      its title renders through `cds-aichat-truncated-text`
  //      (`TruncatedText`), not yet covered by this path - revisit once
  //      that lands (todo #869).
  //    - `PromptLineAutocomplete`: upstream's overlay is trigger/event
  //      driven (typing "@"/"/" in a live Tiptap editor), not a simple
  //      declarative-prop render - reaching a comparable "items shown"
  //      state needs real editor interaction, not just setting config.
  //    - `AiChatCodeSnippet`: renders through a real CodeMirror 6 instance
  //      (version-sensitive internals) and embeds this addon's own
  //      `AiChatToolbar`, which has the same `Tooltip`/`OverflowMenu`
  //      entanglement as `Launcher`/`Carousel` above - matches this
  //      component's own "split out for its own dependency review"
  //      precedent (AGENTS.md).
  // 4. Nothing to mount: `SessionShell` has no upstream Lit custom element
  //    at all - it maps to upstream's React-only `AppShell.tsx` (confirmed:
  //    no `session-shell` directory anywhere in the installed `@carbon/
  //    ai-chat-components` package).
  //
  // `AudioPlayer`/`VideoPlayer` are excluded for a different, simpler
  // reason: both are single-root wrappers around a real `<audio>`/
  // `<video>` element (or an embedded third-party provider iframe/script)
  // whose actual controls are native, internal browser UI with no DOM this
  // harness (or any DOM API) can inspect - there's nothing structural left
  // to compare once the outer wrapper divs are accounted for.
});
