import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find, rerender } from '@ember/test-helpers';
import Checkbox from 'carbon-components-ember/components/checkbox';

module('Integration | Component | Checkbox', (hooks) => {
  setupRenderingTest(hooks);

  test('renders with a stable, non-empty id linking the label and input on first render', async function (assert) {
    await render(<template><Checkbox @label='Accept' /></template>);

    const input = find('input.cds--checkbox') as HTMLInputElement;
    const label = find('label.cds--checkbox-label') as HTMLLabelElement;

    assert.ok(input.id, 'input has a non-empty id');
    assert.strictEqual(label.getAttribute('for'), input.id);
  });

  test('calls onChange with the new checked state', async function (assert) {
    let received: unknown;
    const onChange = (value: boolean) => {
      received = value;
    };

    await render(
      <template><Checkbox @label='Accept' @onChange={{onChange}} /></template>,
    );

    await click('input.cds--checkbox');

    assert.true(received as boolean);
  });

  test('toggles the focus class on the label when the input is focused/blurred', async function (assert) {
    await render(<template><Checkbox @label='Accept' /></template>);

    assert.dom('.cds--checkbox-label').doesNotHaveClass('cds--checkbox-label__focus');

    find('label.cds--checkbox-label')!.dispatchEvent(new FocusEvent('focus'));
    await rerender();
    assert.dom('.cds--checkbox-label').hasClass('cds--checkbox-label__focus');

    find('label.cds--checkbox-label')!.dispatchEvent(new FocusEvent('blur'));
    await rerender();
    assert.dom('.cds--checkbox-label').doesNotHaveClass('cds--checkbox-label__focus');
  });
});
