import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import Processing from 'carbon-components-ember/components/ai-chat/processing';
import ReasoningSteps from 'carbon-components-ember/components/ai-chat/reasoning-steps';

// Registers the real custom elements as a side effect - see each import's
// own package for the tag(s) it defines (`cds-aichat-processing`,
// `cds-aichat-reasoning-steps` + `cds-aichat-reasoning-step`).
import '@carbon/ai-chat-components/es/components/processing/index.js';
import '@carbon/ai-chat-components/es/components/reasoning-steps/index.js';

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
});
