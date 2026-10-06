import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, waitUntil, rerender } from '@ember/test-helpers';
import CodeSnippet from '#src/components/code-snippet.gts';

module('Integration | Component | CodeSnippet', (hooks) => {
  setupRenderingTest(hooks);

  test('@type="default" wires the copy button to the real rendered code element', async function (assert) {
    await render(
      <template>
        <CodeSnippet @type="default">const x = 1;</CodeSnippet>
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    find('[data-copy-btn]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    await rerender();

    assert.dom('[data-copy-btn]').hasAttribute('aria-label', 'Copied!');
  });

  test('the scrolling code region is a focusable, read-only textbox', async function (assert) {
    await render(
      <template>
        <CodeSnippet @type="default">const x = 1;</CodeSnippet>
        <CodeSnippet @type="multiline">const y = 2;</CodeSnippet>
      </template>,
    );

    assert
      .dom('.cds--snippet--single .cds--snippet-container')
      .hasAttribute('role', 'textbox')
      .hasAttribute('tabindex', '0')
      .hasAttribute('aria-readonly', 'true');
    assert
      .dom('.cds--snippet--multi pre')
      .hasAttribute('role', 'textbox')
      .hasAttribute('tabindex', '0')
      .hasAttribute('aria-multiline', 'true');
  });

  test('@type="multiline" wires the copy button to the real rendered code element', async function (assert) {
    await render(
      <template>
        <CodeSnippet @type="multiline">const x = 1;</CodeSnippet>
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    find('[data-copy-btn]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    await rerender();

    assert.dom('[data-copy-btn]').hasAttribute('aria-label', 'Copied!');
  });

  test('@type="inline" renders an inline CopyButton', async function (assert) {
    await render(
      <template>
        <CodeSnippet @type="inline">const x = 1;</CodeSnippet>
      </template>,
    );

    assert.dom('.cds--snippet--inline').exists();
  });
});
