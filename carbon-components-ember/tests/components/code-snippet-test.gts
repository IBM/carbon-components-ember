import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { tracked } from '@glimmer/tracking';
import { render, click, find, waitUntil } from '@ember/test-helpers';
import CodeSnippet from '#src/components/code-snippet.gts';
import { setupClipboard } from '../helpers';

const longCode = Array.from({ length: 30 }, (_, i) => `line ${i + 1}`).join(
  '\n',
);

const heightsOf = (selector: string) => {
  const { maxHeight, minHeight } = (find(selector) as HTMLElement).style;
  return { maxHeight, minHeight };
};

module('Integration | Component | CodeSnippet', (hooks) => {
  setupRenderingTest(hooks);
  const clipboard = setupClipboard(hooks);

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
    await waitUntil(() => clipboard.copied.length > 0);

    assert.deepEqual(clipboard.copied, ['const x = 1;']);
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
    await waitUntil(() => clipboard.copied.length > 0);

    assert.deepEqual(clipboard.copied, ['const x = 1;']);
  });

  test('without @type it renders a single line', async function (assert) {
    await render(
      <template>
        <CodeSnippet>const x = 1;</CodeSnippet>
      </template>,
    );

    assert.dom('.cds--snippet--single code').hasText('const x = 1;');
  });

  test('a long multi-line snippet collapses to 15 rows, with Show more', async function (assert) {
    await render(
      <template>
        <CodeSnippet @type="multiline">{{longCode}}</CodeSnippet>
      </template>,
    );
    await waitUntil(() => find('.cds--snippet-btn--expand'));

    const collapsed = { maxHeight: '240px', minHeight: '48px' };
    assert.deepEqual(heightsOf('.cds--snippet-container'), collapsed);
    assert.deepEqual(heightsOf('.cds--snippet-container pre'), collapsed);
    assert.dom('.cds--snippet-btn--text').hasText('Show more');

    await click('.cds--snippet-btn--expand');
    assert.dom('.cds--snippet--multi').hasClass('cds--snippet--expand');
    assert.dom('.cds--snippet-btn--text').hasText('Show less');
    assert.deepEqual(heightsOf('.cds--snippet-container'), {
      maxHeight: '',
      minHeight: '256px',
    });
  });

  test('once the code fits, Show more goes and the snippet collapses', async function (assert) {
    const code = tracked(longCode);
    await render(
      <template>
        <CodeSnippet @type="multiline">{{code.value}}</CodeSnippet>
      </template>,
    );
    await waitUntil(() => find('.cds--snippet-btn--expand'));
    await click('.cds--snippet-btn--expand');

    code.value = 'const y = 2;';
    await waitUntil(() => !find('.cds--snippet-btn--expand'));
    assert.dom('.cds--snippet--multi').doesNotHaveClass('cds--snippet--expand');
  });

  test('the expanded limits and text come from their arguments', async function (assert) {
    await render(
      <template>
        <CodeSnippet
          @type="multiline"
          @maxExpandedNumberOfRows={{20}}
          @minExpandedNumberOfRows={{10}}
          @showLessText="Less"
        >{{longCode}}</CodeSnippet>
      </template>,
    );
    await waitUntil(() => find('.cds--snippet-btn--expand'));
    await click('.cds--snippet-btn--expand');

    assert.deepEqual(heightsOf('.cds--snippet-container'), {
      maxHeight: '320px',
      minHeight: '160px',
    });
    assert.dom('.cds--snippet-btn--text').hasText('Less');
  });

  test('the row limits come from the NumberOfRows arguments', async function (assert) {
    await render(
      <template>
        <CodeSnippet
          @type="multiline"
          @maxCollapsedNumberOfRows={{5}}
          @minCollapsedNumberOfRows={{0}}
          @showMoreText="More"
        >{{longCode}}</CodeSnippet>
      </template>,
    );
    await waitUntil(() => find('.cds--snippet-btn--expand'));

    assert.deepEqual(heightsOf('.cds--snippet-container'), {
      maxHeight: '80px',
      minHeight: '',
    });
    assert.dom('.cds--snippet-btn--text').hasText('More');
  });

  test('@type="inline" renders an inline CopyButton', async function (assert) {
    await render(
      <template>
        <CodeSnippet @type="inline">const x = 1;</CodeSnippet>
      </template>,
    );

    assert.dom('.cds--snippet--inline').exists();
  });

  test("attributes go on the snippet, or an inline one's button, as Carbon React does", async function (assert) {
    await render(
      <template>
        <CodeSnippet @type="default" data-test-single>x</CodeSnippet>
        <CodeSnippet @type="multiline" data-test-multi>y</CodeSnippet>
        <CodeSnippet @type="inline" data-test-inline>z</CodeSnippet>
      </template>,
    );

    assert.dom('.cds--snippet--single').hasAttribute('data-test-single');
    assert.dom('.cds--snippet--multi').hasAttribute('data-test-multi');
    assert.dom('button[data-test-inline]').exists();
  });
});
