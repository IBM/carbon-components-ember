import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import SelectItem from 'carbon-components-ember/components/select-item';

module('Integration | Component | SelectItem', (hooks) => {
  setupRenderingTest(hooks);

  test('should render an option with the given value and text', async function (assert) {
    await render(
      <template>
        <select>
          <SelectItem @value='option-1' @text='Option 1' />
        </select>
      </template>,
    );

    assert.dom('option').exists();
    assert.dom('option').hasClass('cds--select-option');
    assert.dom('option').hasAttribute('value', 'option-1');
    assert.dom('option').hasText('Option 1');
  });

  test('should support the disabled argument', async function (assert) {
    await render(
      <template>
        <select>
          <SelectItem @value='option-1' @text='Option 1' @disabled={{true}} />
        </select>
      </template>,
    );

    assert.dom('option').hasAttribute('disabled');
  });

  test('should not be disabled by default', async function (assert) {
    await render(
      <template>
        <select>
          <SelectItem @value='option-1' @text='Option 1' />
        </select>
      </template>,
    );

    assert.dom('option').doesNotHaveAttribute('disabled');
  });

  test('should support the hidden argument', async function (assert) {
    await render(
      <template>
        <select>
          <SelectItem @value='option-1' @text='Option 1' @hidden={{true}} />
        </select>
      </template>,
    );

    assert.dom('option').hasAttribute('hidden');
  });

  test('should pass through attributes', async function (assert) {
    await render(
      <template>
        <select>
          <SelectItem @value='option-1' @text='Option 1' class='custom-class' />
        </select>
      </template>,
    );

    assert.dom('option').hasClass('custom-class');
  });
});
