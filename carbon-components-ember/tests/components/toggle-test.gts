import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, find, render, settled } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Toggle from '#src/components/toggle.gts';

const BUTTON = 'button.cds--toggle__button';

function spy<T>() {
  const calls: T[] = [];
  return { calls, call: (value: T) => void calls.push(value) };
}

module('Integration | Component | Toggle', (hooks) => {
  setupRenderingTest(hooks);

  test('class and attributes go on the <button>, @className on the wrapper', async function (assert) {
    await render(
      <template>
        <Toggle
          @className="my-field"
          @labelText="Label"
          class="my-switch"
          id="mine"
          data-test-toggle
        />
      </template>,
    );

    assert.dom('.cds--toggle').hasClass('my-field');
    const button = find(BUTTON)!;
    assert.dom(button).hasClass('my-switch').hasAttribute('data-test-toggle');
    // Its own id wins, so the label stays associated.
    assert.notStrictEqual(button.id, 'mine');
    assert.dom('.cds--toggle__label').hasAttribute('for', button.id);
  });

  test('@labelText labels the switch, and @id names it', async function (assert) {
    await render(<template><Toggle @id="wifi" @labelText="Wi-Fi" /></template>);

    assert
      .dom(BUTTON)
      .hasAttribute('id', 'wifi')
      .hasAttribute('aria-labelledby', 'wifi_label');
    assert
      .dom('label.cds--toggle__label')
      .hasAttribute('id', 'wifi_label')
      .hasAttribute('for', 'wifi');
    assert.dom('.cds--toggle__label-text').hasText('Wi-Fi');
  });

  test('its own aria-labelledby wins', async function (assert) {
    await render(
      <template>
        <Toggle @labelText="Wi-Fi" aria-labelledby="elsewhere" />
      </template>,
    );

    assert.dom(BUTTON).hasAttribute('aria-labelledby', 'elsewhere');
  });

  test('@defaultToggled seeds it, and a click switches it and calls @onToggle', async function (assert) {
    const onToggle = spy<boolean>();
    await render(
      <template>
        <Toggle
          @labelText="Label"
          @defaultToggled={{true}}
          @onToggle={{onToggle.call}}
        />
      </template>,
    );

    assert.dom(BUTTON).hasAttribute('aria-checked', 'true');
    assert.dom('.cds--toggle__text').hasText('On');

    await click(BUTTON);
    assert.dom(BUTTON).hasAttribute('aria-checked', 'false');
    assert
      .dom('.cds--toggle__switch')
      .doesNotHaveClass('cds--toggle__switch--checked');
    assert.dom('.cds--toggle__text').hasText('Off');
    assert.deepEqual(onToggle.calls, [false]);
  });

  test('@toggled wins over clicks until it changes', async function (assert) {
    const toggled = tracked(false);
    const onToggle = spy<boolean>();
    await render(
      <template>
        <Toggle
          @labelText="Label"
          @toggled={{toggled.value}}
          @onToggle={{onToggle.call}}
        />
      </template>,
    );

    await click(BUTTON);
    assert.deepEqual(onToggle.calls, [true]);
    assert.dom(BUTTON).hasAttribute('aria-checked', 'false');

    toggled.value = true;
    await settled();
    assert.dom(BUTTON).hasAttribute('aria-checked', 'true');
  });

  test('a read-only toggle ignores clicks', async function (assert) {
    const onToggle = spy<boolean>();
    await render(
      <template>
        <Toggle
          @labelText="Label"
          @readOnly={{true}}
          @size="sm"
          @onToggle={{onToggle.call}}
        />
      </template>,
    );

    await click(BUTTON);
    assert.dom(BUTTON).hasAttribute('aria-checked', 'false');
    assert.deepEqual(onToggle.calls, []);
    assert.dom('.cds--toggle').hasClass('cds--toggle--readonly');
    assert.dom('.cds--toggle__check').doesNotExist();
  });

  test('a small toggle shows a check', async function (assert) {
    await render(<template><Toggle @labelText="Label" @size="sm" /></template>);

    assert
      .dom('.cds--toggle__appearance')
      .hasClass('cds--toggle__appearance--sm');
    assert.dom('.cds--toggle__check').exists();
  });

  test('@labelA and @labelB name its states', async function (assert) {
    await render(
      <template>
        <Toggle @labelText="Label" @labelA="No" @labelB="Yes" />
      </template>,
    );

    assert.dom('.cds--toggle__text').hasText('No');
    await click(BUTTON);
    assert.dom('.cds--toggle__text').hasText('Yes');
  });

  test('@hideLabel shows the label beside the switch instead', async function (assert) {
    await render(
      <template><Toggle @labelText="Label" @hideLabel={{true}} /></template>,
    );

    assert.dom('.cds--toggle__label-text').hasClass('cds--visually-hidden');
    assert.dom('.cds--toggle__text').hasText('Label');
  });

  test('without @labelText, a click anywhere on it switches it', async function (assert) {
    const onToggle = spy<boolean>();
    await render(
      <template>
        <Toggle aria-label="Label" @onToggle={{onToggle.call}} />
      </template>,
    );

    assert.dom('label').doesNotExist();
    assert.dom('div.cds--toggle__label').exists();

    await click('.cds--toggle__switch');
    assert.deepEqual(onToggle.calls, [true]);
    assert.dom(BUTTON).isFocused();

    // The button's own click toggles it once.
    await click(BUTTON);
    assert.deepEqual(onToggle.calls, [true, false]);
  });

  test('a disabled toggle ignores clicks', async function (assert) {
    const onToggle = spy<boolean>();
    await render(
      <template>
        <Toggle
          aria-label="Label"
          @disabled={{true}}
          @onToggle={{onToggle.call}}
        />
      </template>,
    );

    assert.dom(BUTTON).isDisabled();
    assert.dom('.cds--toggle').hasClass('cds--toggle--disabled');
    await click('.cds--toggle__switch');
    assert.deepEqual(onToggle.calls, []);
  });

  test("a click anywhere on it clicks the button, so the caller's listener hears it once", async function (assert) {
    const clicks = spy<MouseEvent>();
    await render(
      <template>
        <Toggle aria-label="Label" {{on "click" clicks.call}} />
      </template>,
    );

    await click('.cds--toggle__switch');
    assert.strictEqual(clicks.calls.length, 1);
    assert.dom(BUTTON).hasAttribute('aria-checked', 'true');
  });

  test('a read-only toggle ignores a click anywhere on it, but takes focus', async function (assert) {
    const onToggle = spy<boolean>();
    await render(
      <template>
        <Toggle
          aria-label="Label"
          @readOnly={{true}}
          @onToggle={{onToggle.call}}
        />
      </template>,
    );

    await click('.cds--toggle__switch');
    assert.deepEqual(onToggle.calls, []);
    assert.dom(BUTTON).hasAttribute('aria-checked', 'false').isFocused();
  });

  test('a disabled toggle with a label ignores clicks on it', async function (assert) {
    const onToggle = spy<boolean>();
    await render(
      <template>
        <Toggle
          @labelText="Label"
          @disabled={{true}}
          @onToggle={{onToggle.call}}
        />
      </template>,
    );

    await click('.cds--toggle__label');
    assert.deepEqual(onToggle.calls, []);
    assert.dom(BUTTON).hasAttribute('aria-checked', 'false');
  });

  test('@hideLabel without @labelText shows no text beside the switch', async function (assert) {
    await render(
      <template><Toggle aria-label="Label" @hideLabel={{true}} /></template>,
    );

    assert.dom('.cds--toggle__text').doesNotExist();
    assert.dom('.cds--toggle__label-text').doesNotExist();
  });

  test('clicks while @toggled is given leave its own state alone', async function (assert) {
    const toggled = tracked<boolean | undefined>(true);
    await render(
      <template>
        <Toggle @labelText="Label" @toggled={{toggled.value}} />
      </template>,
    );

    await click(BUTTON);
    toggled.value = undefined;
    await settled();
    assert.dom(BUTTON).hasAttribute('aria-checked', 'true');
  });
});
