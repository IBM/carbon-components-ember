import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, waitUntil, click } from '@ember/test-helpers';
import CopyButton from '#src/components/copy-button.gts';
import { setupClipboard } from '../helpers';

module('Integration | Component | CopyButton', (hooks) => {
  setupRenderingTest(hooks);
  const clipboard = setupClipboard(hooks);

  const copiedLabel = () =>
    find('[data-copy-btn]')?.getAttribute('aria-label') !== 'Copy to clipboard';

  test('should render with the default icon description', async function (assert) {
    await render(
      <template>
        <CopyButton>some code</CopyButton>
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    assert
      .dom('[data-copy-btn]')
      .hasAttribute('aria-label', 'Copy to clipboard');
    assert.dom('[data-copy-btn] code').hasText('some code');
  });

  test('without @inline, block content is visually hidden behind the icon', async function (assert) {
    await render(
      <template>
        <CopyButton>some code</CopyButton>
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    assert.dom('[data-copy-btn] code').hasClass('cds--visually-hidden');
    assert.dom('[data-copy-btn] svg').exists();
  });

  test('should copy the block content to the clipboard and show feedback on click', async function (assert) {
    await render(
      <template>
        <CopyButton>copy me</CopyButton>
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    // Dispatch a raw click and wait only for the feedback, rather than the
    // `click()` test helper's full `settled()`, which would also wait out
    // the feedback timeout task and observe the reverted state.
    find('[data-copy-btn]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    await waitUntil(copiedLabel);

    assert.dom('[data-copy-btn]').hasAttribute('aria-label', 'Copied!');
    assert
      .dom(`#${find('[data-copy-btn]')!.getAttribute('aria-describedby')}`)
      .hasText('Copied!');
    assert.deepEqual(clipboard.copied, ['copy me']);
  });

  test('should support a custom feedback message', async function (assert) {
    await render(
      <template>
        <CopyButton @feedback="Done!">copy me</CopyButton>
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    find('[data-copy-btn]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    await waitUntil(copiedLabel);

    assert.dom('[data-copy-btn]').hasAttribute('aria-label', 'Done!');
  });

  test('shows no feedback when copying fails', async function (assert) {
    clipboard.denied = true;
    // eslint-disable-next-line @typescript-eslint/unbound-method -- restored below
    const execCommand = document.execCommand;
    document.execCommand = () => false;

    try {
      await render(
        <template>
          <CopyButton>copy me</CopyButton>
        </template>,
      );
      await click('[data-copy-btn]');
    } finally {
      document.execCommand = execCommand;
    }

    assert
      .dom('[data-copy-btn]')
      .hasAttribute('aria-label', 'Copy to clipboard');
  });

  test('copies multiline content without the template indentation, keeping its own', async function (assert) {
    const code = '\n      function f() {\n        return 1;\n      }\n    ';

    await render(
      <template>
        <CopyButton>{{code}}</CopyButton>
      </template>,
    );
    find('[data-copy-btn]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    await waitUntil(copiedLabel);

    assert.deepEqual(clipboard.copied, ['function f() {\n  return 1;\n}']);
  });

  test('keeps a first line that is indented deeper than the rest', async function (assert) {
    const code = '    deeper\n  shallower';

    await render(
      <template>
        <CopyButton>{{code}}</CopyButton>
      </template>,
    );
    find('[data-copy-btn]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    await waitUntil(copiedLabel);

    assert.deepEqual(clipboard.copied, ['  deeper\nshallower']);
  });

  test('an async @onClick does not put the button into a loading state', async function (assert) {
    const onClick = () => new Promise<void>(() => {});

    await render(
      <template>
        <CopyButton @onClick={{onClick}}>copy me</CopyButton>
      </template>,
    );
    find('[data-copy-btn]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    await waitUntil(copiedLabel);

    assert.dom('[data-copy-btn]').isNotDisabled();
    assert.dom('[data-copy-btn] .cds--inline-loading').doesNotExist();
  });

  test('should support a custom iconDescription', async function (assert) {
    await render(
      <template>
        <CopyButton @iconDescription="Duplicate">copy me</CopyButton>
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
        <CopyButton @align="top">copy me</CopyButton>
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    assert.dom('.cds--popover-container').hasClass('cds--popover--top');
  });

  test('should copy from a targetElement', async function (assert) {
    await render(
      <template>
        <pre id="target">target content</pre>
        <CopyButton @targetElementId="target" />
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    find('[data-copy-btn]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    await waitUntil(copiedLabel);

    assert.dom('[data-copy-btn]').hasAttribute('aria-label', 'Copied!');
    assert.deepEqual(clipboard.copied, ['target content']);
  });

  test('should render inline snippet classes', async function (assert) {
    await render(
      <template>
        <CopyButton @inline={{true}}>inline code</CopyButton>
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    assert.dom('[data-copy-btn]').hasClass('cds--snippet--inline');
    assert.dom('[data-copy-btn] svg').doesNotExist();
  });
});
