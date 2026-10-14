import { module, test } from 'qunit';
import { takeCspViolations } from '../helpers/index.ts';

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
