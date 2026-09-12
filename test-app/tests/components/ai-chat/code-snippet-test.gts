import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitUntil, find, settled } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import AiChatCodeSnippet from 'carbon-components-ember/components/ai-chat/code-snippet';
import { resetCodeMirrorRuntimeForTests } from 'carbon-components-ember/components/ai-chat/-code-snippet/codemirror-loader';
import { Add } from 'carbon-components-ember/icons';

async function waitForEditor() {
  await waitUntil(() => find('.cm-content'));
}

module('Integration | Component | ai-chat/AiChatCodeSnippet', (hooks) => {
  setupRenderingTest(hooks);

  hooks.afterEach(() => {
    // The CodeMirror runtime chunk is a module-level singleton (mirroring
    // `-prompt-line/rich-loader.ts`'s own precedent) - without resetting it,
    // the first test to mount a snippet permanently warms it for every
    // later test in this file.
    resetCodeMirrorRuntimeForTests();
  });

  test('renders @code inside the CodeMirror editor', async function (assert) {
    await render(<template><AiChatCodeSnippet @code='const x = 1;' /></template>);

    await waitForEditor();

    assert.dom('.cm-content').hasText('const x = 1;');
    assert.dom('.cds-aichat-snippet__editor-skeleton').doesNotExist();
  });

  test('an external (controlled) @code change updates the editor via a throttled diff, not a full reset', async function (assert) {
    class State {
      @tracked code = 'line one';
    }
    const state = new State();

    class Host extends Component {
      state = state;
      <template><AiChatCodeSnippet @code={{this.state.code}} /></template>
    }

    await render(<template><Host /></template>);
    await waitForEditor();
    assert.dom('.cm-content').hasText('line one');

    state.code = 'line one\nline two';
    await settled();
    // The content-sync throttle's leading edge applies immediately. Each
    // source line becomes its own `.cm-line` DOM node with no literal
    // newline character joining them, so assert per-line rather than on
    // `.cm-content`'s concatenated `textContent`.
    await waitUntil(() => document.querySelectorAll('.cm-content .cm-line').length === 2);
    const lines = [...document.querySelectorAll('.cm-content .cm-line')].map((el) => el.textContent);
    assert.deepEqual(lines, ['line one', 'line two']);
  });

  test('@editable renders an editable surface and fires @onChange on edit', async function (assert) {
    const calls: string[] = [];
    const onChange = (value: string) => calls.push(value);

    await render(<template><AiChatCodeSnippet @code='' @editable={{true}} @onChange={{onChange}} /></template>);
    await waitForEditor();

    assert.dom('.cds-aichat-snippet-container').hasAttribute('aria-multiline', 'true');
    assert.dom('.cds-aichat-snippet-container').hasAttribute('aria-readonly', 'false');
    assert.dom('.cm-content').hasAttribute('contenteditable', 'true');

    const content = find('.cm-content') as HTMLElement;
    content.focus();
    document.execCommand('insertText', false, 'hi');
    await settled();

    assert.true(calls.includes('hi'), `expected an @onChange call with 'hi', got ${JSON.stringify(calls)}`);
  });

  test('a non-editable snippet has no contenteditable surface', async function (assert) {
    await render(<template><AiChatCodeSnippet @code='const x = 1;' /></template>);
    await waitForEditor();

    assert.dom('.cm-content').hasAttribute('contenteditable', 'false');
  });

  test('@hideHeader hides the toolbar', async function (assert) {
    await render(<template><AiChatCodeSnippet @code='x' @hideHeader={{true}} /></template>);
    await waitForEditor();

    assert.dom('.cds-aichat-snippet__header').doesNotExist();
  });

  test('the copy action is the first toolbar action unless @hideCopyButton is set', async function (assert) {
    await render(<template><AiChatCodeSnippet @code='const x = 1;' /></template>);
    await waitForEditor();

    assert.dom('.cds-aichat-toolbar__actions-container button').exists({ count: 1 });
  });

  test('@hideCopyButton removes the copy action', async function (assert) {
    await render(<template><AiChatCodeSnippet @code='const x = 1;' @hideCopyButton={{true}} /></template>);
    await waitForEditor();

    assert.dom('.cds-aichat-toolbar__actions-container button').doesNotExist();
  });

  test('clicking the copy action copies @code to the clipboard', async function (assert) {
    const original = navigator.clipboard?.writeText;
    let copied: string | undefined;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: (text: string) => ((copied = text), Promise.resolve()) },
    });

    try {
      await render(<template><AiChatCodeSnippet @code='const x = 1;' /></template>);
      await waitForEditor();

      await click('.cds-aichat-toolbar__actions-container button');
      assert.strictEqual(copied, 'const x = 1;');
    } finally {
      if (original) {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: { writeText: original },
        });
      }
    }
  });

  test('@actions render after the copy action', async function (assert) {
    let clicks = 0;
    const actions = [{ text: 'Regenerate', icon: Add, onClick: () => clicks++ }];

    await render(<template><AiChatCodeSnippet @code='x' @actions={{actions}} /></template>);
    await waitForEditor();

    assert.dom('.cds-aichat-toolbar__actions-container button').exists({ count: 2 });
  });

  test('@disabled applies the disabled modifier class', async function (assert) {
    await render(<template><AiChatCodeSnippet @code='x' @disabled={{true}} /></template>);
    await waitForEditor();

    assert.dom('.cds-aichat-code-snippet--disabled').exists();
  });

  test('destroying the component tears down the CodeMirror editor without error', async function (assert) {
    await render(<template><AiChatCodeSnippet @code='const x = 1;' /></template>);
    await waitForEditor();

    await render(<template></template>);
    assert.dom('.cm-content').doesNotExist();
  });

  test('@language + @highlight + @detectLanguage locks in and renders the language label', async function (assert) {
    await render(
      <template>
        <AiChatCodeSnippet @code='const x = 1;' @language='javascript' @highlight={{true}} @detectLanguage={{true}} />
      </template>,
    );
    await waitForEditor();
    await waitUntil(() => find('.cds-aichat-snippet__language'));

    assert.dom('.cds-aichat-snippet__language').hasText('JavaScript');
  });

  test('without @detectLanguage or @language, no language label renders', async function (assert) {
    await render(<template><AiChatCodeSnippet @code='const x = 1;' @highlight={{true}} /></template>);
    await waitForEditor();

    assert.dom('.cds-aichat-snippet__language').doesNotExist();
  });

  test('pure content-based language detection locks in a language label after the detection delay', async function (assert) {
    const pythonCode = ['def greet(name):', '    if name:', '        print(name)'].join('\n');

    await render(
      <template><AiChatCodeSnippet @code={{pythonCode}} @detectLanguage={{true}} /></template>,
    );
    await waitForEditor();

    assert.dom('.cds-aichat-snippet__language').doesNotExist('no @language was given, so nothing is locked in yet');

    await waitUntil(() => find('.cds-aichat-snippet__language'), { timeout: 2000 });
    assert.dom('.cds-aichat-snippet__language').hasText('Python');
  });

  test('@maxCollapsedNumberOfRows shows a "Show more" button once content exceeds it, and toggling it expands/collapses the container', async function (assert) {
    const manyLines = Array.from({ length: 20 }, (_, i) => `const line${i} = ${i};`).join('\n');

    await render(
      <template><AiChatCodeSnippet @code={{manyLines}} @maxCollapsedNumberOfRows={{3}} /></template>,
    );
    await waitForEditor();

    await waitUntil(() => find('.cds-aichat-snippet__footer button'));
    assert.dom('.cds-aichat-snippet-container--collapsed').exists();
    assert.dom('.cds-aichat-snippet__footer button').hasText('Show more');

    await click('.cds-aichat-snippet__footer button');
    assert.dom('.cds-aichat-snippet-container--collapsed').doesNotExist();
    assert.dom('.cds-aichat-snippet__footer button').hasText('Show less');

    await click('.cds-aichat-snippet__footer button');
    assert.dom('.cds-aichat-snippet-container--collapsed').exists();
    assert.dom('.cds-aichat-snippet__footer button').hasText('Show more');
  });

  test('@language="diff" colors inserted/deleted lines via the diff decorator', async function (assert) {
    const diffCode = [
      'diff --git a/file.txt b/file.txt',
      '--- a/file.txt',
      '+++ b/file.txt',
      '@@ -1,2 +1,2 @@',
      '-old line',
      '+new line',
    ].join('\n');

    await render(
      <template><AiChatCodeSnippet @code={{diffCode}} @language='diff' @highlight={{true}} /></template>,
    );
    await waitForEditor();

    await waitUntil(() => find('.cm-diff-line-inserted') && find('.cm-diff-line-deleted'));
    assert.dom('.cm-diff-line-inserted').hasText('+new line');
    assert.dom('.cm-diff-line-deleted').hasText('-old line');
    // Metadata lines starting with `+++`/`---` are not colored as insert/delete.
    const insertedLines = [...document.querySelectorAll('.cm-diff-line-inserted')].map((el) => el.textContent);
    const deletedLines = [...document.querySelectorAll('.cm-diff-line-deleted')].map((el) => el.textContent);
    assert.false(insertedLines.includes('+++ b/file.txt'));
    assert.false(deletedLines.includes('--- a/file.txt'));
  });
});
