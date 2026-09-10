import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import Markdown from 'carbon-components-ember/components/ai-chat/markdown';

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

module('Integration | Component | ai-chat/Markdown', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders CommonMark to Carbon-styled HTML', async function (assert) {
    const source =
      '# Title\n\nSome **bold** and *italic* text, plus a [link](https://example.com).';

    await render(<template><Markdown @markdown={{source}} /></template>);

    assert.dom('.cds-aichat-markdown h1').hasText('Title');
    assert.dom('.cds-aichat-markdown strong').hasText('bold');
    assert.dom('.cds-aichat-markdown em').hasText('italic');
    assert
      .dom('.cds-aichat-markdown a')
      .hasAttribute('href', 'https://example.com')
      .hasText('link');
  });

  test('it renders GFM tables', async function (assert) {
    const source = '| A | B |\n| --- | --- |\n| 1 | 2 |';

    await render(<template><Markdown @markdown={{source}} /></template>);

    assert.dom('.cds-aichat-markdown table th').exists({ count: 2 });
    assert.dom('.cds-aichat-markdown table td').exists({ count: 2 });
  });

  test('it renders fenced code blocks as plain <pre><code>', async function (assert) {
    const source = '```js\nconst x = 1;\n```';

    await render(<template><Markdown @markdown={{source}} /></template>);

    assert.dom('.cds-aichat-markdown pre code').exists();
    assert.dom('.cds-aichat-markdown pre code').includesText('const x = 1;');
  });

  test('it renders `==highlight==` as <mark>', async function (assert) {
    const source = 'This is ==important==.';

    await render(<template><Markdown @markdown={{source}} /></template>);

    assert.dom('.cds-aichat-markdown mark').hasText('important');
  });

  test('it renders GFM task-list checkboxes as read-only inputs', async function (assert) {
    const source = '- [x] Done\n- [ ] Not done';

    await render(<template><Markdown @markdown={{source}} /></template>);

    const checkboxes = this.element.querySelectorAll<HTMLInputElement>(
      '.cds-aichat-markdown__checkbox',
    );
    assert.strictEqual(checkboxes.length, 2, 'renders both checkboxes');
    assert.true(checkboxes[0]?.checked, 'first item is checked');
    assert.true(checkboxes[0]?.disabled, 'checkboxes are read-only');
    assert.false(checkboxes[1]?.checked, 'second item is unchecked');
  });

  test('it always sanitizes a <script> tag, regardless of @sanitizeHTML', async function (assert) {
    const source = 'Look: <script>window.xssFired = true;</script>';

    await render(<template><Markdown @markdown={{source}} /></template>);

    assert.dom('.cds-aichat-markdown script').doesNotExist();
    assert.strictEqual(
      (window as unknown as { xssFired?: boolean }).xssFired,
      undefined,
      'the script never executed',
    );
  });

  test('it always sanitizes an onerror handler even with @sanitizeHTML={{true}}', async function (assert) {
    const source = '<img src="x" onerror="window.xssFired = true">';

    await render(
      <template>
        <Markdown @markdown={{source}} @sanitizeHTML={{true}} />
      </template>,
    );

    assert.dom('.cds-aichat-markdown img').doesNotHaveAttribute('onerror');
  });

  test('it does not link a `javascript:` URL', async function (assert) {
    const source = '[click me](javascript:window.xssFired = true)';

    await render(<template><Markdown @markdown={{source}} /></template>);

    const link = this.element.querySelector('.cds-aichat-markdown a');
    assert.notOk(
      link?.getAttribute('href')?.startsWith('javascript:'),
      'no javascript: href reaches the DOM',
    );
  });

  test('@removeHTML strips raw HTML to literal text instead of parsing it', async function (assert) {
    const source = '<b>not bold</b>';

    await render(
      <template><Markdown @markdown={{source}} @removeHTML={{true}} /></template>,
    );

    assert.dom('.cds-aichat-markdown b').doesNotExist();
    assert.dom('.cds-aichat-markdown').includesText('<b>not bold</b>');
  });

  test('@streaming throttles re-render to roughly once per 100ms', async function (assert) {
    class State {
      @tracked markdown = 'v1';
    }
    const state = new State();

    class Host extends Component {
      state = state;
      <template>
        <Markdown @markdown={{this.state.markdown}} @streaming={{true}} />
      </template>
    }

    await render(<template><Host /></template>);
    assert.dom('.cds-aichat-markdown').hasText('v1');

    state.markdown = 'v2';
    await settled();
    assert
      .dom('.cds-aichat-markdown')
      .hasText('v1', 'update is throttled, not applied synchronously');

    await delay(150);
    await settled();
    assert
      .dom('.cds-aichat-markdown')
      .hasText('v2', 'update lands after the throttle window');
  });
});
