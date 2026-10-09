import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find, rerender } from '@ember/test-helpers';
import Checkbox from '#src/components/checkbox.gts';

module('Integration | Component | Checkbox', (hooks) => {
  setupRenderingTest(hooks);

  test('renders with a stable, non-empty id linking the label and input on first render', async function (assert) {
    await render(<template><Checkbox @label="Accept" /></template>);

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
      <template><Checkbox @label="Accept" @onChange={{onChange}} /></template>,
    );

    await click('input.cds--checkbox');

    assert.true(received);
  });

  test('toggles the focus class on the label when the input is focused/blurred', async function (assert) {
    await render(<template><Checkbox @label="Accept" /></template>);

    assert
      .dom('.cds--checkbox-label')
      .doesNotHaveClass('cds--checkbox-label__focus');

    find('label.cds--checkbox-label')!.dispatchEvent(new FocusEvent('focus'));
    await rerender();
    assert.dom('.cds--checkbox-label').hasClass('cds--checkbox-label__focus');

    find('label.cds--checkbox-label')!.dispatchEvent(new FocusEvent('blur'));
    await rerender();
    assert
      .dom('.cds--checkbox-label')
      .doesNotHaveClass('cds--checkbox-label__focus');
  });

  test('renders an AI label after its label', async function (assert) {
    await render(
      <template>
        <Checkbox @label="Checkbox label">
          <:decorator as |AILabel|><AILabel /></:decorator>
        </Checkbox>
      </template>,
    );

    assert
      .dom('.cds--checkbox-wrapper')
      .hasClass('cds--checkbox-wrapper--decorator');
    assert
      .dom('.cds--checkbox-label .cds--ai-label')
      .doesNotExist('the AI label is not inside the label');
    assert
      .dom(
        '.cds--checkbox-wrapper-inner--decorator .cds--ai-label__button--mini',
      )
      .exists('the yielded AI label is mini, as in Carbon React');
  });

  test('the yielded AI label takes the arguments it is given', async function (assert) {
    await render(
      <template>
        <Checkbox @label="Checkbox label">
          <:decorator as |AILabel|>
            <AILabel @kind="inline" @size="md" />
          </:decorator>
        </Checkbox>
      </template>,
    );

    assert
      .dom('.cds--ai-label__button')
      .hasClass('cds--ai-label__button--md')
      .hasClass('cds--ai-label__button--inline');
  });
});
