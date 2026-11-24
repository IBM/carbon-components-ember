import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find, settled } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Checkbox from '#src/components/checkbox.gts';

module('Integration | Component | Checkbox', (hooks) => {
  setupRenderingTest(hooks);

  test('renders with a stable, non-empty id linking the label and input on first render', async function (assert) {
    await render(<template><Checkbox @labelText="Accept" /></template>);

    const input = find('input.cds--checkbox') as HTMLInputElement;
    const label = find('label.cds--checkbox-label') as HTMLLabelElement;

    assert.ok(input.id, 'input has a non-empty id');
    assert.strictEqual(label.getAttribute('for'), input.id);
  });

  test('passes a disabled attribute to the input', async function (assert) {
    await render(
      <template><Checkbox @labelText="Accept" disabled /></template>,
    );

    assert.dom('input.cds--checkbox').isDisabled();
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
      <template>
        <Checkbox @labelText="Accept" @onChange={{onChange}} />
      </template>,
    );

    await click('input.cds--checkbox');

    assert.strictEqual(received?.[0].type, 'change');
    assert.deepEqual(received?.[1], {
      checked: true,
      id: find('input.cds--checkbox')!.id,
    });
  });

  test('a read-only checkbox neither toggles nor calls onChange, as in Carbon React', async function (assert) {
    let calls = 0;
    const onChange = () => calls++;

    await render(
      <template>
        <Checkbox
          @labelText="Accept"
          @readOnly={{true}}
          @onChange={{onChange}}
        />
      </template>,
    );

    await click('input.cds--checkbox');

    assert.dom('input.cds--checkbox').isNotChecked();
    assert.strictEqual(calls, 0);
  });

  test('takes one tab stop, the input', async function (assert) {
    await render(<template><Checkbox @labelText="Accept" /></template>);

    assert.dom('label.cds--checkbox-label').doesNotHaveAttribute('tabindex');
    assert
      .dom('input.cds--checkbox')
      .doesNotHaveAttribute('tabindex', 'the input sits beside its label');
    assert.dom('label.cds--checkbox-label input').doesNotExist();
  });

  test('@id names the input, which its label points at', async function (assert) {
    await render(
      <template><Checkbox @id="terms" @labelText="Accept" /></template>,
    );

    assert.dom('input.cds--checkbox').hasAttribute('id', 'terms');
    assert.dom('label.cds--checkbox-label').hasAttribute('for', 'terms');
  });

  test('@defaultChecked checks it at first, and leaves the rest to it', async function (assert) {
    await render(
      <template>
        <Checkbox @labelText="Accept" @defaultChecked={{true}} />
      </template>,
    );

    assert.dom('input.cds--checkbox').isChecked();
    await click('input.cds--checkbox');
    assert.dom('input.cds--checkbox').isNotChecked();
  });

  test('@indeterminate makes it indeterminate', async function (assert) {
    await render(
      <template>
        <Checkbox @labelText="Accept" @indeterminate={{true}} />
      </template>,
    );

    assert.true(
      (find('input.cds--checkbox') as HTMLInputElement).indeterminate,
    );
  });

  test('a read-only checkbox is marked so', async function (assert) {
    await render(
      <template><Checkbox @labelText="Accept" @readOnly={{true}} /></template>,
    );

    assert
      .dom('.cds--checkbox-wrapper')
      .hasClass('cds--checkbox-wrapper--readonly');
    assert.dom('input.cds--checkbox').hasAttribute('aria-readonly', 'true');
  });

  test('@helperText shows under it', async function (assert) {
    await render(
      <template>
        <Checkbox @labelText="Accept" @helperText="You can change it later" />
      </template>,
    );

    assert.dom('.cds--form__helper-text').hasText('You can change it later');
  });

  test('@invalid shows @invalidText in place of the helper text', async function (assert) {
    await render(
      <template>
        <Checkbox
          @labelText="Accept"
          @helperText="You can change it later"
          @invalid={{true}}
          @invalidText="Accept the terms to go on"
        />
      </template>,
    );

    assert
      .dom('.cds--checkbox-wrapper')
      .hasClass('cds--checkbox-wrapper--invalid');
    assert.dom('input.cds--checkbox').hasAttribute('data-invalid', 'true');
    assert
      .dom('.cds--checkbox__validation-msg .cds--form-requirement')
      .hasText('Accept the terms to go on');
    assert.dom('.cds--checkbox__invalid-icon').exists();
    assert.dom('.cds--form__helper-text').doesNotExist();
  });

  test('@warn shows @warnText', async function (assert) {
    await render(
      <template>
        <Checkbox
          @labelText="Accept"
          @warn={{true}}
          @warnText="You can't undo this"
        />
      </template>,
    );

    assert
      .dom('.cds--checkbox-wrapper')
      .hasClass('cds--checkbox-wrapper--warning');
    assert
      .dom('.cds--checkbox__validation-msg .cds--form-requirement')
      .hasText("You can't undo this");
    assert.dom('.cds--checkbox__invalid-icon--warning').exists();
  });

  test('a read-only or disabled checkbox shows no validation message', async function (assert) {
    await render(
      <template>
        <Checkbox
          @labelText="Accept"
          @readOnly={{true}}
          @invalid={{true}}
          @invalidText="Accept the terms to go on"
        />
        <Checkbox
          @labelText="Accept"
          @disabled={{true}}
          @warn={{true}}
          @warnText="You can't undo this"
        />
      </template>,
    );

    assert.dom('.cds--form-requirement').doesNotExist();
  });

  test('@indeterminate stays after a click, while it says so', async function (assert) {
    await render(
      <template>
        <Checkbox @labelText="Accept" @indeterminate={{true}} />
      </template>,
    );

    await click('input.cds--checkbox');
    assert.true(
      (find('input.cds--checkbox') as HTMLInputElement).indeterminate,
    );
  });

  test('@checked follows its argument', async function (assert) {
    const checked = tracked(false);
    await render(
      <template>
        <Checkbox @labelText="Accept" @checked={{checked.value}} />
      </template>,
    );

    assert.dom('input.cds--checkbox').isNotChecked();
    checked.value = true;
    await settled();
    assert.dom('input.cds--checkbox').isChecked();
  });

  test('@title is the label tooltip, and @hideLabel hides the label text', async function (assert) {
    await render(
      <template>
        <Checkbox
          @labelText="Accept"
          @title="Accept the terms"
          @hideLabel={{true}}
        />
      </template>,
    );

    assert
      .dom('label.cds--checkbox-label')
      .hasAttribute('title', 'Accept the terms');
    assert
      .dom('.cds--checkbox-label-text')
      .hasClass('cds--visually-hidden')
      .hasText('Accept');
  });

  test('the block is the label, in place of @labelText', async function (assert) {
    await render(
      <template>
        <Checkbox>I accept the <strong>terms</strong></Checkbox>
      </template>,
    );

    assert.dom('.cds--checkbox-label-text').hasText('I accept the terms');
    assert.dom('.cds--checkbox-label-text strong').hasText('terms');
  });

  test('renders an AI label after its label', async function (assert) {
    await render(
      <template>
        <Checkbox @labelText="Checkbox label">
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
        <Checkbox @labelText="Checkbox label">
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
          @labelText="Accept"
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
