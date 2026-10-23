import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { tracked } from '@glimmer/tracking';
import { render, rerender, click, find, waitUntil } from '@ember/test-helpers';
import CodeSnippet from '#src/components/code-snippet.gts';
import type { CodeSnippetSignature } from '#src/components/code-snippet.gts';
import { setupClipboard } from '../helpers';

const longCode = Array.from({ length: 30 }, (_, i) => `line ${i + 1}`).join(
  '\n',
);

// The copy button is named by its tooltip, as in Carbon React.
const labelOf = (selector: string) =>
  find(
    `#${find(selector)?.getAttribute('aria-labelledby')}`,
  )?.textContent?.trim();

const heightsOf = (selector: string) => {
  const { maxHeight, minHeight } = (find(selector) as HTMLElement).style;
  return { maxHeight, minHeight };
};

module('Integration | Component | CodeSnippet', (hooks) => {
  setupRenderingTest(hooks);
  const clipboard = setupClipboard(hooks);

  test('@type="single" wires the copy button to the real rendered code element', async function (assert) {
    await render(
      <template>
        <CodeSnippet @type="single">const x = 1;</CodeSnippet>
      </template>,
    );

    find('.cds--copy')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    await waitUntil(() => clipboard.copied.length > 0);

    assert.deepEqual(clipboard.copied, ['const x = 1;']);
  });

  test('the scrolling code region is a focusable, read-only textbox', async function (assert) {
    await render(
      <template>
        <CodeSnippet @type="single">const x = 1;</CodeSnippet>
        <CodeSnippet @type="multi">const y = 2;</CodeSnippet>
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
    assert
      .dom('.cds--snippet--multi .cds--snippet-container')
      .doesNotHaveAttribute('role');
  });

  test('@type="multi" wires the copy button to the real rendered code element', async function (assert) {
    await render(
      <template>
        <CodeSnippet @type="multi">const x = 1;</CodeSnippet>
      </template>,
    );

    find('.cds--copy')!.dispatchEvent(
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
        <CodeSnippet @type="multi">{{longCode}}</CodeSnippet>
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
        <CodeSnippet @type="multi">{{code.value}}</CodeSnippet>
      </template>,
    );
    await waitUntil(() => find('.cds--snippet-btn--expand'));
    await click('.cds--snippet-btn--expand');

    code.value = 'const y = 2;';
    await waitUntil(() => !find('.cds--snippet-btn--expand'));
    assert.dom('.cds--snippet--multi').doesNotHaveClass('cds--snippet--expand');
  });

  test('a snippet that stops being multi-line drops Show more', async function (assert) {
    const type = tracked<CodeSnippetSignature['Args']['type']>('multi');
    await render(
      <template>
        <CodeSnippet @type={{type.value}}>{{longCode}}</CodeSnippet>
      </template>,
    );
    await waitUntil(() => find('.cds--snippet-btn--expand'));
    await click('.cds--snippet-btn--expand');

    type.value = 'single';
    await rerender();
    assert.dom('.cds--snippet-btn--expand').doesNotExist();
    assert.dom('.cds--snippet').doesNotHaveClass('cds--snippet--expand');
  });

  test('the expanded limits and text come from their arguments', async function (assert) {
    await render(
      <template>
        <CodeSnippet
          @type="multi"
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
          @type="multi"
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
        <CodeSnippet @type="single" data-test-single>x</CodeSnippet>
        <CodeSnippet @type="multi" data-test-multi>y</CodeSnippet>
        <CodeSnippet @type="inline" data-test-inline>z</CodeSnippet>
      </template>,
    );

    assert.dom('.cds--snippet--single').hasAttribute('data-test-single');
    assert.dom('.cds--snippet--multi').hasAttribute('data-test-multi');
    assert.dom('button[data-test-inline]').exists();
  });

  test('@copyText is copied instead of the code', async function (assert) {
    await render(
      <template>
        <CodeSnippet @copyText="npm i carbon">npm install</CodeSnippet>
        <CodeSnippet @type="inline" @copyText="node -v">node</CodeSnippet>
      </template>,
    );

    await click('.cds--snippet--single .cds--copy');
    await click('.cds--snippet--inline');
    await waitUntil(() => clipboard.copied.length === 2);

    assert.deepEqual(clipboard.copied, ['npm i carbon', 'node -v']);
  });

  test('@onClick is called when the copy button is clicked', async function (assert) {
    const clicks: MouseEvent[] = [];
    const onClick = (event: MouseEvent) => clicks.push(event);
    await render(
      <template>
        <CodeSnippet @onClick={{onClick}}>npm install</CodeSnippet>
      </template>,
    );

    await click('.cds--snippet-container');
    assert.strictEqual(clicks.length, 0);
    await click('.cds--copy');
    assert.strictEqual(clicks.length, 1);
    assert.true(clicks[0] instanceof MouseEvent);
  });

  test('@ariaLabel labels the code, and @copyButtonDescription the copy button', async function (assert) {
    await render(
      <template>
        <CodeSnippet
          @ariaLabel="Install command"
          @copyButtonDescription="Copy the command"
        >npm install</CodeSnippet>
        <CodeSnippet @type="inline" @ariaLabel="Copy the version">node -v</CodeSnippet>
      </template>,
    );

    assert
      .dom('.cds--snippet-container')
      .hasAttribute('aria-label', 'Install command');
    assert.strictEqual(
      labelOf('.cds--snippet--single .cds--copy'),
      'Copy the command',
    );
    assert.strictEqual(labelOf('.cds--snippet--inline'), 'Copy the version');
  });

  test('@hideCopyButton leaves out the copy button', async function (assert) {
    await render(
      <template>
        <CodeSnippet @hideCopyButton={{true}}>npm install</CodeSnippet>
        <CodeSnippet @type="inline" @hideCopyButton={{true}} data-test-inline>
          node -v
        </CodeSnippet>
      </template>,
    );

    assert.dom('.cds--copy').doesNotExist();
    assert.dom('.cds--snippet--single').hasClass('cds--snippet--no-copy');
    assert
      .dom('span.cds--snippet--inline')
      .hasClass('cds--snippet--no-copy')
      .hasAttribute('data-test-inline');
    assert.dom('span.cds--snippet--inline code').hasText('node -v');
  });

  test('@disabled disables the copy button and takes the code out of the tab order', async function (assert) {
    await render(
      <template>
        <CodeSnippet @type="multi" @disabled={{true}}>npm install</CodeSnippet>
      </template>,
    );

    assert.dom('.cds--snippet--multi').hasClass('cds--snippet--disabled');
    assert.dom('.cds--snippet-container pre').doesNotHaveAttribute('tabindex');
    assert.dom('.cds--copy').isDisabled();
  });

  test('@wrapText wraps long lines, and a multi-line snippet has a small copy button', async function (assert) {
    await render(
      <template>
        <CodeSnippet @type="multi" @wrapText={{true}}>npm install</CodeSnippet>
      </template>,
    );

    assert.dom('.cds--snippet--multi').hasClass('cds--snippet--wraptext');
    assert.dom('.cds--copy').hasClass('cds--btn--sm');
  });
});
