import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import copyToClipboard from '#src/modifiers/copy-to-clipboard.ts';
import { setupClipboard } from '../helpers';

module('Integration | Modifier | copyToClipboard', (hooks) => {
  setupRenderingTest(hooks);
  const clipboard = setupClipboard(hooks);

  test('copies @text on click and reports success', async function (assert) {
    const copied: string[] = [];
    const onSuccess = (text: string) => copied.push(text);

    await render(
      <template>
        <button
          type="button"
          {{copyToClipboard text="hello" onSuccess=onSuccess}}
        >Copy</button>
      </template>,
    );
    await click('button');

    assert.deepEqual(clipboard.copied, ['hello']);
    assert.deepEqual(copied, ['hello']);
  });

  test('reads a text function when clicked', async function (assert) {
    let value = 'first';
    const text = () => value;

    await render(
      <template>
        <button type="button" {{copyToClipboard text=text}}>Copy</button>
      </template>,
    );
    value = 'second';
    await click('button');

    assert.deepEqual(clipboard.copied, ['second']);
  });

  test('copies an input target by id, using its value', async function (assert) {
    await render(
      <template>
        <input id="key" value="secret-key" />
        <button type="button" {{copyToClipboard target="key"}}>Copy</button>
      </template>,
    );
    await click('button');

    assert.deepEqual(clipboard.copied, ['secret-key']);
  });

  test('skips visually hidden text in a target element', async function (assert) {
    const target = document.createElement('p');
    target.innerHTML =
      'Token <span class="cds--visually-hidden">(hidden)</span>abc';

    await render(
      <template>
        <button type="button" {{copyToClipboard target=target}}>Copy</button>
      </template>,
    );
    await click('button');

    assert.deepEqual(clipboard.copied, ['Token abc']);
  });

  test('falls back to execCommand when the Clipboard API rejects', async function (assert) {
    clipboard.denied = true;
    const copied: string[] = [];
    const onSuccess = (text: string) => copied.push(text);
    // eslint-disable-next-line @typescript-eslint/unbound-method -- restored below
    const execCommand = document.execCommand;
    let fallbackText: string | undefined;
    document.execCommand = () => {
      fallbackText = document.querySelector('textarea')?.value;
      return true;
    };

    try {
      await render(
        <template>
          <button
            type="button"
            {{copyToClipboard text="hello" onSuccess=onSuccess}}
          >Copy</button>
        </template>,
      );
      await click('button');
    } finally {
      document.execCommand = execCommand;
    }

    assert.strictEqual(fallbackText, 'hello');
    assert.deepEqual(copied, ['hello']);
    assert.dom('textarea').doesNotExist('the fallback cleans up');
    assert.dom('button').isFocused('focus goes back to the button');
  });

  test('reports an error when both ways fail', async function (assert) {
    clipboard.denied = true;
    const failed: [string, unknown][] = [];
    const onError = (text: string, error: unknown) =>
      failed.push([text, error]);
    // eslint-disable-next-line @typescript-eslint/unbound-method -- restored below
    const execCommand = document.execCommand;
    document.execCommand = () => false;

    try {
      await render(
        <template>
          <button
            type="button"
            {{copyToClipboard text="hello" onError=onError}}
          >Copy</button>
        </template>,
      );
      await click('button');
    } finally {
      document.execCommand = execCommand;
    }

    assert.strictEqual(failed[0]?.[0], 'hello');
    assert.strictEqual(
      (failed[0]?.[1] as DOMException).name,
      'NotAllowedError',
    );
  });
});
