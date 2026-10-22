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

  test('calls onChange with the change event, the checked state and the id, as Carbon React does', async function (assert) {
    let received: [Event, { checked: boolean; id: string }] | undefined;
    const onChange = (
      event: Event & { target: HTMLInputElement },
      change: { checked: boolean; id: string },
    ) => {
      received = [event, change];
    };

    await render(
      <template><Checkbox @label="Accept" @onChange={{onChange}} /></template>,
    );

    await click('input.cds--checkbox');

    assert.strictEqual(received?.[0].type, 'change');
    assert.deepEqual(received?.[1], {
      checked: true,
      id: find('input.cds--checkbox')!.id,
    });
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

  test('attributes and {{on "click"}} go on the <input>, @className on the wrapper', async function (assert) {
    let clicks = 0;
    const onClick = () => clicks++;
    await render(
      <template>
        <Checkbox
          @label="Accept"
          @className="my-field"
          class="my-input"
          name="terms"
          {{on "click" onClick}}
        />
      </template>,
    );

    assert.dom('.cds--checkbox-wrapper').hasClass('my-field');
    assert
      .dom('input.cds--checkbox')
      .hasClass('my-input')
      .hasAttribute('name', 'terms');
    await click('input.cds--checkbox');
    assert.strictEqual(clicks, 1);
  });
});
