import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { focus, render, rerender, triggerKeyEvent } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Loading from '#src/components/loading.gts';
import Modal from '#src/components/modal.gts';

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

  test('an active overlay is a dialog that keeps focus, and gives it back when it stops', async function (assert) {
    const active = tracked(false);
    await render(
      <template>
        <button type="button" id="before">Before</button>
        <button type="button" id="outside">Outside</button>
        <Loading @active={{active.value}} @description="Saving" />
      </template>,
    );

    assert.dom('.cds--loading-overlay').hasAttribute('role', 'presentation');
    assert.dom('.cds--loading-overlay > div').doesNotHaveAttribute('role');

    await focus('#before');
    active.value = true;
    await rerender();

    assert
      .dom('.cds--loading-overlay > div')
      .hasAttribute('role', 'dialog')
      .hasAttribute('aria-label', 'Saving')
      .hasAttribute('tabindex', '-1');

    await focus('#outside');
    assert.dom('.cds--loading-overlay > div').isFocused();

    await triggerKeyEvent('.cds--loading-overlay > div', 'keydown', 'Tab');
    assert.dom('.cds--loading-overlay > div').isFocused();

    active.value = false;
    await rerender();
    assert.dom('#before').isFocused();
  });

  test('an overlay without focus inside the page takes it', async function (assert) {
    await render(<template><Loading /></template>);

    assert.dom('.cds--loading-overlay > div').isFocused();
  });

  test('an overlay that goes away gives focus back', async function (assert) {
    const loading = tracked(false);
    await render(
      <template>
        <button type="button" id="before">Before</button>
        {{#if loading.value}}
          <Loading />
        {{/if}}
      </template>,
    );

    await focus('#before');
    (document.activeElement as HTMLElement).blur();
    loading.value = true;
    await rerender();
    assert.dom('.cds--loading-overlay > div').isFocused();

    loading.value = false;
    await rerender();
    assert.strictEqual(document.activeElement, document.body);

    await focus('#before');
    loading.value = true;
    await rerender();
    await focus('.cds--loading-overlay > div');
    loading.value = false;
    await rerender();
    assert.dom('#before').isFocused();
  });

  test('an overlay behind an open modal leaves its focus alone', async function (assert) {
    await render(
      <template>
        <Modal @open={{true}} @modalHeading="Settings">
          <input id="first" aria-label="First" />
          <input id="second" aria-label="Second" />
        </Modal>
        <Loading />
      </template>,
    );

    await focus('#first');
    assert.dom('#first').isFocused();
    await focus('#second');
    assert.dom('#second').isFocused('focus moves within the modal');
    await triggerKeyEvent('#second', 'keydown', 'Tab');
    assert.dom('.cds--loading-overlay > div').isNotFocused();
  });
});
