import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import SelectItemGroup from 'carbon-components-ember/components/select-item-group';

module('Integration | Component | SelectItemGroup', (hooks) => {
  setupRenderingTest(hooks);

  test('should render an optgroup with the given label', async function (assert) {
    await render(
      <template>
        <select>
          <SelectItemGroup @label='Group A'>
            <option value='1'>Option 1</option>
            <option value='2'>Option 2</option>
          </SelectItemGroup>
        </select>
      </template>,
    );

    assert.dom('optgroup').exists();
    assert.dom('optgroup').hasClass('cds--select-optgroup');
    assert.dom('optgroup').hasAttribute('label', 'Group A');
    assert.dom('optgroup option').exists({ count: 2 });
  });

  test('should support the disabled argument', async function (assert) {
    await render(
      <template>
        <select>
          <SelectItemGroup @label='Group A' @disabled={{true}}>
            <option value='1'>Option 1</option>
          </SelectItemGroup>
        </select>
      </template>,
    );

    assert.dom('optgroup').hasAttribute('disabled');
  });

  test('should not be disabled by default', async function (assert) {
    await render(
      <template>
        <select>
          <SelectItemGroup @label='Group A'>
            <option value='1'>Option 1</option>
          </SelectItemGroup>
        </select>
      </template>,
    );

    assert.dom('optgroup').doesNotHaveAttribute('disabled');
  });

  test('should pass through attributes', async function (assert) {
    await render(
      <template>
        <select>
          <SelectItemGroup @label='Group A' class='custom-class'>
            <option value='1'>Option 1</option>
          </SelectItemGroup>
        </select>
      </template>,
    );

    assert.dom('optgroup').hasClass('custom-class');
  });
});
