import { getPendingWaiterState, hasPendingWaiters } from '@ember/test-waiters';
import { afterEach, expect, inject, vi } from 'vitest';
import { commands, server } from 'vitest/browser';

declare module 'vitest' {
  interface ProvidedContext {
    storyScreenshots: { stories: string[]; report: boolean };
  }
  interface TestContext {
    // Set by @storybook/addon-vitest.
    story?: {
      id: string;
      tags: string[];
      parameters: { screenshot?: { disable?: boolean } };
    };
  }
}

declare module 'vitest/browser' {
  interface BrowserCommands {
    servePlexLocally: () => Promise<void>;
  }
}

// Before any story loads Carbon's stylesheet (see vite.config.mjs).
await commands.servePlexLocally();

// Blocks style attributes, as apps' strict CSPs do (see tests/helpers/csp.ts
// for the QUnit side). The browser drops them silently, so fail the story
// that rendered one.
const policy = document.createElement('meta');
policy.httpEquiv = 'Content-Security-Policy';
policy.content = "style-src-attr 'none'";
document.head.prepend(policy);

// Storybook's a11y addon injects its vision filters with a style attribute.
const STORYBOOK_ELEMENTS = '#storybook-a11y-vision-filters';

const violations: SecurityPolicyViolationEvent[] = [];
window.addEventListener('securitypolicyviolation', (event) => {
  const { target } = event;
  if (target instanceof Element && target.closest(STORYBOOK_ELEMENTS)) return;
  violations.push(event);
});

function describe(violation: SecurityPolicyViolationEvent) {
  const { target } = violation;
  if (target instanceof Element) return target.outerHTML.slice(0, 200);
  return `${violation.sourceFile}:${violation.lineNumber}`;
}

afterEach(async () => {
  // Violations are reported in a task of their own.
  await new Promise((resolve) => setTimeout(resolve));
  const blocked = violations.splice(0);
  if (blocked.length) {
    throw new Error(
      `The CSP blocked these style attributes; use a class, or {{style}} for computed values:\n${blocked.map(describe).join('\n')}`,
    );
  }
});

// Compares each story with its screenshot from main's CI run (see
// .github/workflows/docs.yml); `pnpm test:storybook --update` takes them
// afresh. A new story gets one once it's on main, and CI checks meanwhile
// that it holds still. Opt a story out, saying why, with
// `parameters: { screenshot: { disable: true } }`.
const { stories, report } = inject('storyScreenshots');
const withScreenshots = new Set(stories);
// 'all' with --update, 'none' on CI and 'new' otherwise.
const { updateSnapshot } = server.config.snapshotOptions;

afterEach(async ({ story, task }) => {
  // Story tests (`.test()`) rerender their story; screenshot it once.
  if (!story || story.tags.includes('test-fn')) return;
  if (task.result?.state === 'fail' || story.parameters.screenshot?.disable) {
    return;
  }
  const name = story.id.replace('--', '/');
  const isNew = updateSnapshot !== 'all' && !withScreenshots.has(name);
  // Nothing to compare with: locally, or with no screenshots from main.
  if (isNew && (updateSnapshot === 'new' || !withScreenshots.size)) return;

  // Lazy icons, floating content and modals register test waiters.
  await vi
    .waitUntil(() => !hasPendingWaiters(), { timeout: 10_000 })
    .catch(() => {
      const { waiters } = getPendingWaiterState();
      throw new Error(`Test waiters still pending: ${JSON.stringify(waiters)}`);
    });
  // A font starts loading when layout first needs it: lay the page out, so
  // `fonts.ready` waits for every font the story uses.
  document.documentElement.getBoundingClientRect();
  await document.fonts.ready;
  try {
    // The whole page, for what renders outside the story's root: modals in
    // the top layer, popovers in portals.
    await expect.element(document.documentElement).toMatchScreenshot(name, {
      screenshotOptions: { animations: 'disabled' },
      // To find two screenshots in a row that match. Each can take a few
      // seconds while the other story files boot.
      timeout: 15_000,
    });
  } catch (error) {
    const { message } = error as Error;
    if (isNew && message.includes('No existing reference screenshot')) return;
    // Report differences, but not a story that won't hold still.
    if (!report || message.includes('Could not capture a stable screenshot')) {
      throw error;
    }
    console.warn(error);
  }
});
