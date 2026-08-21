import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, waitUntil, click, rerender } from '@ember/test-helpers';
import CopyButton from 'carbon-components-ember/components/copy-button';

module('Integration | Component | CopyButton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render with the default icon description', async function (assert) {
    await render(<template><CopyButton>some code</CopyButton></template>);
    await waitUntil(() => find('[data-copy-btn]'));

    assert.dom('[data-copy-btn]').hasAttribute('aria-label', 'Copy to clipboard');
    assert.dom('[data-copy-btn] code').hasText('some code');
  });

  test('should copy the block content to the clipboard and show feedback on click', async function (assert) {
    await render(<template><CopyButton>copy me</CopyButton></template>);
    await waitUntil(() => find('[data-copy-btn]'));

    // Dispatch a raw click and only wait for the DOM to re-render, rather
    // than the `click()` test helper's full `settled()`, which would also
    // wait out the feedback timeout task and observe the reverted state.
    find('[data-copy-btn]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await rerender();

    assert.dom('[data-copy-btn]').hasAttribute('aria-label', 'Copied!');
    assert
      .dom(`#${find('[data-copy-btn]')!.getAttribute('aria-describedby')}`)
      .hasText('Copied!');
  });

  test('should support a custom feedback message', async function (assert) {
    await render(
      <template>
        <CopyButton @feedback='Done!'>copy me</CopyButton>
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    find('[data-copy-btn]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await rerender();

    assert.dom('[data-copy-btn]').hasAttribute('aria-label', 'Done!');
  });

  test('should support a custom iconDescription', async function (assert) {
    await render(
      <template>
        <CopyButton @iconDescription='Duplicate'>copy me</CopyButton>
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    assert.dom('[data-copy-btn]').hasAttribute('aria-label', 'Duplicate');
  });

  test('should call the onClick handler when clicked', async function (assert) {
    let called = 0;
    const onClick = () => called++;

    await render(
      <template>
        <CopyButton @onClick={{onClick}}>copy me</CopyButton>
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    await click('[data-copy-btn]');

    assert.strictEqual(called, 1);
  });

  test('should support the disabled arg', async function (assert) {
    await render(
      <template>
        <CopyButton @disabled={{true}}>copy me</CopyButton>
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    assert.dom('[data-copy-btn]').isDisabled();
  });

  test('should support the align arg', async function (assert) {
    await render(
      <template>
        <CopyButton @align='top'>copy me</CopyButton>
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    assert.dom('.cds--popover-container').hasClass('cds--popover--top');
  });

  test('should copy from a targetElement', async function (assert) {
    await render(
      <template>
        <pre id='target'>target content</pre>
        <CopyButton @targetElementId='target' />
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    find('[data-copy-btn]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await rerender();

    assert.dom('[data-copy-btn]').hasAttribute('aria-label', 'Copied!');
  });

  test('should render inline snippet classes', async function (assert) {
    await render(
      <template><CopyButton @inline={{true}}>inline code</CopyButton></template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    assert.dom('[data-copy-btn]').hasClass('cds--snippet--inline');
    assert.dom('[data-copy-btn] svg').doesNotExist();
  });
});
