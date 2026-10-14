import { module, test } from 'qunit';
import { cspNonce } from '#src/utils/csp-nonce.ts';
import { nonce, takeCspViolations } from '../helpers/index.ts';

module('Unit | Test harness | CSP', function () {
  test('style attributes are blocked and reported', async function (assert) {
    const element = document.createElement('div');
    document.querySelector('#ember-testing')!.append(element);
    element.setAttribute('style', 'color: red');
    const violations = await takeCspViolations();
    element.remove();

    assert.strictEqual(element.style.color, '', 'the style is not applied');
    assert.deepEqual(
      violations.map((violation) => violation.effectiveDirective),
      ['style-src-attr'],
    );
  });

  test('style elements need the page nonce', async function (assert) {
    const container = document.querySelector('#ember-testing')!;
    const target = document.createElement('div');
    target.className = 'csp-test-target';
    const blocked = document.createElement('style');
    blocked.textContent = '.csp-test-target { color: red; }';
    const allowed = document.createElement('style');
    allowed.nonce = nonce ?? '';
    allowed.textContent = '.csp-test-target { outline-color: red; }';
    container.append(target, blocked, allowed);
    const violations = await takeCspViolations();
    const computed = getComputedStyle(target);
    const color = computed.color;
    const outlineColor = computed.outlineColor;
    target.remove();
    blocked.remove();
    allowed.remove();

    assert.notStrictEqual(color, 'rgb(255, 0, 0)', 'without it, it is blocked');
    assert.strictEqual(outlineColor, 'rgb(255, 0, 0)', 'with it, it applies');
    assert.deepEqual(
      violations.map((violation) => violation.effectiveDirective),
      ['style-src-elem'],
    );
  });

  test('cspNonce() reads the page nonce from its meta tag', function (assert) {
    assert.strictEqual(cspNonce(), 'carbon-tests');
  });

  test('styles set through CSSOM are allowed', async function (assert) {
    const element = document.createElement('div');
    document.querySelector('#ember-testing')!.append(element);
    element.style.setProperty('color', 'red');
    const violations = await takeCspViolations();
    element.remove();

    assert.strictEqual(element.style.color, 'red');
    assert.deepEqual(violations, []);
  });
});
