import * as QUnit from 'qunit';

const violations: SecurityPolicyViolationEvent[] = [];

// Violations are reported in a task of their own.
const nextTask = () => new Promise((resolve) => setTimeout(resolve));

function describe(violation: SecurityPolicyViolationEvent) {
  const { target } = violation;
  if (target instanceof Element) return target.outerHTML.slice(0, 200);
  return `${violation.sourceFile}:${violation.lineNumber}`;
}

/**
 * tests/index.html blocks `style` attributes, as an app's strict CSP does.
 * The browser drops them silently, so fail the test that rendered one. One
 * reported late fails the next test rather than going unreported.
 */
export function failOnCspViolations() {
  window.addEventListener('securitypolicyviolation', (event) =>
    violations.push(event),
  );
  QUnit.hooks.afterEach(async (assert) => {
    await nextTask();
    for (const violation of violations.splice(0)) {
      assert.pushResult({
        result: false,
        actual: describe(violation),
        expected: undefined,
        message: `The CSP blocked this (${violation.effectiveDirective}); use the {{style}} modifier or a class`,
      });
    }
  });
}

/** Takes the violations a test caused on purpose, so they don't fail it. */
export async function takeCspViolations() {
  await nextTask();
  return violations.splice(0);
}
