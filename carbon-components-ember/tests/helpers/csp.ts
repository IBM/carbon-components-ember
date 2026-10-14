import * as QUnit from 'qunit';
import { cspNonce } from '#src/utils/csp-nonce.ts';

/** The page's nonce, for the <style> elements tests render. */
export const nonce = cspNonce();

const violations: SecurityPolicyViolationEvent[] = [];

// Violations are reported in a task of their own.
const nextTask = () => new Promise((resolve) => setTimeout(resolve));

function describe(violation: SecurityPolicyViolationEvent) {
  const { target } = violation;
  if (target instanceof Element) return target.outerHTML.slice(0, 200);
  return `${violation.sourceFile}:${violation.lineNumber}`;
}

const advice: Record<string, string> = {
  'style-src-attr': 'use a class, or {{style}} for computed values',
  'style-src-elem':
    "give injected <style> elements the page's nonce (src/utils/csp-nonce.ts)",
};

/**
 * tests/index.html blocks `style` attributes and `<style>` elements without
 * the page's nonce, as an app's strict CSP does. The browser drops them
 * silently, so fail the test that rendered one. One reported late fails the
 * next test rather than going unreported.
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
        message: `The CSP blocked this (${violation.effectiveDirective}); ${advice[violation.effectiveDirective] ?? 'see tests/helpers/csp.ts'}`,
      });
    }
  });
}

/** Takes the violations a test caused on purpose, so they don't fail it. */
export async function takeCspViolations() {
  await nextTask();
  return violations.splice(0);
}
