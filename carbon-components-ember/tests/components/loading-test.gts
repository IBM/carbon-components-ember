import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Loading from '#src/components/loading.gts';

module('Integration | Component | Loading', (hooks) => {
  setupRenderingTest(hooks);

  test('renders active by default without an overlay wrapper class', async function (assert) {
    await render(<template><Loading @withOverlay={{false}} /></template>);

    assert.dom('.cds--loading').exists();
    assert.dom('.cds--loading').hasAttribute('aria-live', 'assertive');
    assert.dom('.cds--loading').doesNotHaveClass('cds--loading--stop');
    assert.dom('.cds--loading-overlay').doesNotExist();
  });

  test('@active=false stops the spinner without hiding it', async function (assert) {
    await render(
      <template><Loading @withOverlay={{false}} @active={{false}} /></template>,
    );

    assert.dom('.cds--loading').exists();
    assert.dom('.cds--loading').hasClass('cds--loading--stop');
    assert.dom('.cds--loading').hasAttribute('aria-live', 'off');
  });

  test('@small renders the small variant with a background circle', async function (assert) {
    await render(
      <template><Loading @withOverlay={{false}} @small={{true}} /></template>,
    );

    assert.dom('.cds--loading').hasClass('cds--loading--small');
    assert.dom('.cds--loading__background').exists();
  });

  test('@description sets the svg title and aria-label', async function (assert) {
    await render(
      <template>
        <Loading @withOverlay={{false}} @description="fetching data" />
      </template>,
    );

    assert.dom('.cds--loading__svg title').hasText('fetching data');
    assert
      .dom('.cds--loading__svg')
      .hasAttribute('aria-label', 'fetching data');
  });

  test('@withOverlay defaults to true and wraps in a full-page overlay', async function (assert) {
    await render(<template><Loading /></template>);

    assert.dom('.cds--loading-overlay').exists();
    assert.dom('.cds--loading-overlay .cds--loading').exists();
  });

  test('@withOverlay + @active=false hides the overlay', async function (assert) {
    await render(<template><Loading @active={{false}} /></template>);

    assert.dom('.cds--loading-overlay').hasClass('cds--loading-overlay--stop');
  });
});
