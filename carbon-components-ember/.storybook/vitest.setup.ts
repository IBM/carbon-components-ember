import { afterEach } from 'vitest';

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
      `The CSP blocked these style attributes; use the {{style}} modifier or a class:\n${blocked.map(describe).join('\n')}`,
    );
  }
});
