import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, waitUntil, rerender } from '@ember/test-helpers';
import CodeSnippet from 'carbon-components-ember/components/code-snippet';

module('Integration | Component | CodeSnippet', (hooks) => {
  setupRenderingTest(hooks);

  test('@type="default" wires the copy button to the real rendered code element', async function (assert) {
    await render(
      <template>
        <CodeSnippet @type='default'>const x = 1;</CodeSnippet>
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    find('[data-copy-btn]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await rerender();

    assert.dom('[data-copy-btn]').hasAttribute('aria-label', 'Copied!');
  });

  test('@type="multiline" wires the copy button to the real rendered code element', async function (assert) {
    await render(
      <template>
        <CodeSnippet @type='multiline'>const x = 1;</CodeSnippet>
      </template>,
    );
    await waitUntil(() => find('[data-copy-btn]'));

    find('[data-copy-btn]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await rerender();

    assert.dom('[data-copy-btn]').hasAttribute('aria-label', 'Copied!');
  });

  test('@type="inline" renders an inline CopyButton', async function (assert) {
    await render(
      <template>
        <CodeSnippet @type='inline'>const x = 1;</CodeSnippet>
      </template>,
    );

    assert.dom('.cds--snippet--inline').exists();
  });
});
