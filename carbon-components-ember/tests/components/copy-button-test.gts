import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  find,
  waitUntil,
  click,
  settled,
  triggerEvent,
} from '@ember/test-helpers';
import CopyButton from '#src/components/copy-button.gts';
import { setupClipboard, waitForAnimationFrame } from '../helpers';

const BUTTON = 'button.cds--copy';

module('Integration | Component | CopyButton', (hooks) => {
  setupRenderingTest(hooks);
  const clipboard = setupClipboard(hooks);

  // The tooltip names the button, as in Carbon React.
  const label = () =>
    find(
      `#${find(BUTTON)?.getAttribute('aria-labelledby')}`,
    )?.textContent?.trim();
  const copiedLabel = () => label() !== 'Copy to clipboard';

  test('should render with the default icon description', async function (assert) {
    await render(
      <template>
        <CopyButton>some code</CopyButton>
      </template>,
    );

    assert.strictEqual(label(), 'Copy to clipboard');
    assert.dom(`${BUTTON} code`).hasText('some code');
  });

  test('it has no kind class unless given @kind, so it keeps its own colors', async function (assert) {
    await render(
      <template>
        <CopyButton id="plain">some code</CopyButton>
        <CopyButton id="ghost" @kind="ghost">some code</CopyButton>
      </template>,
    );

    assert.dom('#plain').hasClass('cds--copy-btn');
    assert.dom('#plain').doesNotHaveClass('cds--btn--primary');
    assert.dom('#ghost').hasClass('cds--btn--ghost');
  });

  test('without @inline, block content is visually hidden behind the icon', async function (assert) {
    await render(
      <template>
        <CopyButton>some code</CopyButton>
      </template>,
    );

    assert.dom(`${BUTTON} code`).hasClass('cds--visually-hidden');
    assert.dom(`${BUTTON} svg`).exists();
  });

  test('should copy the block content to the clipboard and show feedback on click', async function (assert) {
    await render(
      <template>
        <CopyButton>copy me</CopyButton>
      </template>,
    );

    // Dispatch a raw click and wait only for the feedback, rather than the
    // `click()` test helper's full `settled()`, which would also wait out
    // the feedback timeout task and observe the reverted state.
    find(BUTTON)!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitUntil(copiedLabel);

    assert.strictEqual(label(), 'Copied!');
    assert.deepEqual(clipboard.copied, ['copy me']);
  });

  test('should support a custom feedback message', async function (assert) {
    await render(
      <template>
        <CopyButton @feedback="Done!">copy me</CopyButton>
      </template>,
    );

    find(BUTTON)!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitUntil(copiedLabel);

    assert.strictEqual(label(), 'Done!');
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
      await click(BUTTON);
    } finally {
      document.execCommand = execCommand;
    }

    assert.strictEqual(label(), 'Copy to clipboard');
  });

  test('copies multiline content without the template indentation, keeping its own', async function (assert) {
    const code = '\n      function f() {\n        return 1;\n      }\n    ';

    await render(
      <template>
        <CopyButton>{{code}}</CopyButton>
      </template>,
    );
    find(BUTTON)!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
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
    find(BUTTON)!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitUntil(copiedLabel);

    assert.deepEqual(clipboard.copied, ['  deeper\nshallower']);
  });

  test('an async click handler does not put the button into a loading state', async function (assert) {
    const onClick = () => new Promise<void>(() => {});

    await render(
      <template>
        <CopyButton {{on "click" onClick}}>copy me</CopyButton>
      </template>,
    );
    find(BUTTON)!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitUntil(copiedLabel);

    assert.dom(BUTTON).isNotDisabled();
    assert.dom(`${BUTTON} .cds--inline-loading`).doesNotExist();
  });

  test('a click handler that prevents the default cancels the copy', async function (assert) {
    const preventDefault = (event: MouseEvent) => event.preventDefault();
    await render(
      <template>
        <CopyButton {{on "click" preventDefault}}>copy me</CopyButton>
      </template>,
    );

    await click(BUTTON);
    await waitForAnimationFrame();

    assert.deepEqual(clipboard.copied, []);
  });

  test('should support a custom iconDescription', async function (assert) {
    await render(
      <template>
        <CopyButton @iconDescription="Duplicate">copy me</CopyButton>
      </template>,
    );

    assert.strictEqual(label(), 'Duplicate');
  });

  test('calls a click handler, and still copies', async function (assert) {
    let called = 0;
    const onClick = () => called++;

    await render(
      <template>
        <CopyButton {{on "click" onClick}}>copy me</CopyButton>
      </template>,
    );

    await click(BUTTON);
    await waitUntil(() => clipboard.copied.length > 0);

    assert.strictEqual(called, 1);
    assert.deepEqual(clipboard.copied, ['copy me']);
  });

  test('should support the disabled arg', async function (assert) {
    await render(
      <template>
        <CopyButton @disabled={{true}}>copy me</CopyButton>
      </template>,
    );

    assert.dom(BUTTON).isDisabled();
  });

  test('should support the align arg', async function (assert) {
    await render(
      <template>
        <CopyButton @align="top">copy me</CopyButton>
      </template>,
    );

    assert.dom('.cds--popover-container').hasClass('cds--popover--top');
  });

  test('should copy from a targetElement', async function (assert) {
    await render(
      <template>
        <pre id="target">target content</pre>
        <CopyButton @targetElementId="target" />
      </template>,
    );

    find(BUTTON)!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitUntil(copiedLabel);

    assert.strictEqual(label(), 'Copied!');
    assert.deepEqual(clipboard.copied, ['target content']);
  });

  test("@inline shows the block as the button's content, and is described by it", async function (assert) {
    await render(
      <template>
        <CopyButton @inline={{true}}>inline code</CopyButton>
      </template>,
    );
    const code = find(`${BUTTON} code`)!;

    assert
      .dom(code)
      .hasText('inline code')
      .doesNotHaveClass('cds--visually-hidden');
    assert.dom(BUTTON).hasAttribute('aria-describedby', code.id);
    assert
      .dom(BUTTON)
      .hasClass('cds--snippet')
      .hasClass('cds--snippet--inline');
    assert.dom(`${BUTTON} svg`).doesNotExist();
    assert.strictEqual(label(), 'Copy to clipboard');
  });

  test('the tooltip keeps the feedback up for @feedbackTimeout after the pointer leaves', async function (assert) {
    await render(
      <template>
        <CopyButton @feedbackTimeout={{1000}}>copy me</CopyButton>
      </template>,
    );
    await triggerEvent('.cds--tooltip', 'mouseenter');
    assert.dom('.cds--tooltip').hasClass('cds--popover--open');

    find(BUTTON)!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitUntil(copiedLabel);
    find('.cds--tooltip')!.dispatchEvent(new MouseEvent('mouseleave'));
    // Longer than the 100ms it waits to close without feedback.
    const left = performance.now();
    await waitUntil(() => performance.now() - left > 200);
    assert.dom('.cds--tooltip').hasClass('cds--popover--open');
    assert.strictEqual(label(), 'Copied!');

    await settled();
    assert.dom('.cds--tooltip').doesNotHaveClass('cds--popover--open');
    assert.strictEqual(label(), 'Copy to clipboard');
  });

  test('@size sizes an inline button too', async function (assert) {
    await render(
      <template>
        <CopyButton @inline={{true}} @size="sm">npm</CopyButton>
      </template>,
    );

    assert.dom(BUTTON).hasClass('cds--btn--sm');
  });

  test('@copyText is copied instead of the block', async function (assert) {
    await render(
      <template>
        <CopyButton @copyText="the text">the block</CopyButton>
      </template>,
    );
    find(BUTTON)!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitUntil(copiedLabel);

    assert.deepEqual(clipboard.copied, ['the text']);
  });
});
