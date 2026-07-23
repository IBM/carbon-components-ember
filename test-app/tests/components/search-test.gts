import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, click } from '@ember/test-helpers';
import Search from 'carbon-components-ember/components/search';

module('Integration | Component | Search', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a labelled search input', async function (assert) {
    await render(<template><Search @labelText='Search' /></template>);

    assert.dom('[role="search"].cds--search').exists();
    assert.dom('input.cds--search-input').exists();
    assert.dom('.cds--label').hasText('Search');
  });

  test('defaults to a type="search" input with a "Search" placeholder', async function (assert) {
    await render(<template><Search @labelText='Search' /></template>);

    assert.dom('input.cds--search-input').hasAttribute('type', 'search');
    assert.dom('input.cds--search-input').hasAttribute('placeholder', 'Search');
  });

  test('respects the placeholder argument', async function (assert) {
    await render(
      <template>
        <Search @labelText='Search' @placeholder='Find something' />
      </template>,
    );

    assert
      .dom('input.cds--search-input')
      .hasAttribute('placeholder', 'Find something');
  });

  test('respects the value argument', async function (assert) {
    await render(
      <template><Search @labelText='Search' @value='my search' /></template>,
    );

    assert.dom('input.cds--search-input').hasValue('my search');
  });

  test('respects the disabled argument', async function (assert) {
    await render(
      <template><Search @labelText='Search' @disabled={{true}} /></template>,
    );

    assert.dom('input.cds--search-input').isDisabled();
    assert.dom('.cds--search').hasClass('cds--search--disabled');
  });

  test('applies the size class', async function (assert) {
    await render(
      <template><Search @labelText='Search' @size='sm' /></template>,
    );

    assert.dom('.cds--search').hasClass('cds--search--sm');
  });

  test('calls onChange with the entered value', async function (assert) {
    let received: unknown;
    const onChange = (value: unknown) => {
      received = value;
    };

    await render(
      <template><Search @labelText='Search' @onChange={{onChange}} /></template>,
    );
    await fillIn('input.cds--search-input', 'carbon');

    assert.strictEqual(received, 'carbon');
  });

  test('shows a clear button once there is input and clears it on click', async function (assert) {
    await render(<template><Search @labelText='Search' @value='abc' /></template>);

    assert.dom('.cds--search-close').exists();
    await click('.cds--search-close');

    assert.dom('input.cds--search-input').hasValue('');
    assert.dom('.cds--search-close').doesNotExist();
  });

  test('calls onClear when the clear button is clicked', async function (assert) {
    let cleared = false;
    const onClear = () => {
      cleared = true;
    };

    await render(
      <template>
        <Search @labelText='Search' @value='abc' @onClear={{onClear}} />
      </template>,
    );
    await click('.cds--search-close');

    assert.true(cleared);
  });

  test('uses the closeButtonLabelText argument for the clear button', async function (assert) {
    await render(
      <template>
        <Search
          @labelText='Search'
          @value='abc'
          @closeButtonLabelText='Reset search'
        />
      </template>,
    );

    assert.dom('.cds--search-close').hasAttribute('aria-label', 'Reset search');
  });
});
