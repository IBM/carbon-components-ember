import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, find, render, waitUntil } from '@ember/test-helpers';
import { Add } from '#src/icons.ts';
import OperationalTag from '#src/components/operational-tag.gts';

module('Integration | Component | OperationalTag', (hooks) => {
  setupRenderingTest(hooks);

  test('renders a gray tag that is a button', async function (assert) {
    await render(<template><OperationalTag @text="Tag content" /></template>);

    assert
      .dom('button.cds--tag')
      .hasClass('cds--tag--operational')
      .hasClass('cds--tag--gray')
      .hasAttribute('type', 'button')
      .hasAttribute('id', /^tag-/);
    assert.strictEqual(
      find('.cds--tag__label')?.textContent,
      'Tag content',
      'no whitespace around the text',
    );
    assert.dom('.cds--tag__label').hasAttribute('title', 'Tag content');
  });

  test('@type picks its colour', async function (assert) {
    await render(
      <template><OperationalTag @text="Tag content" @type="red" /></template>,
    );

    assert.dom('.cds--tag').hasClass('cds--tag--red');
    assert.dom('.cds--tag').doesNotHaveClass('cds--tag--gray');
  });

  test('a click handler goes on it with on', async function (assert) {
    let clicks = 0;
    const onClick = () => clicks++;

    await render(
      <template>
        <OperationalTag @text="Tag content" {{on "click" onClick}} />
      </template>,
    );
    await click('.cds--tag');

    assert.strictEqual(clicks, 1);
  });

  test('its icon shows, except at the small size', async function (assert) {
    await render(
      <template>
        <OperationalTag @renderIcon={{Add}} @text="Tag content" />
      </template>,
    );
    assert.dom('.cds--tag__custom-icon svg').exists();

    await render(
      <template>
        <OperationalTag @renderIcon={{Add}} @size="sm" @text="Tag content" />
      </template>,
    );
    assert.dom('.cds--tag__custom-icon').doesNotExist();
    assert.dom('.cds--tag').hasClass('cds--tag--sm');
  });

  test('@id is its id', async function (assert) {
    await render(
      <template><OperationalTag @id="my-tag" @text="Tag content" /></template>,
    );

    assert.dom('.cds--tag').hasAttribute('id', 'my-tag');
  });

  test('@disabled disables it', async function (assert) {
    await render(
      <template>
        <OperationalTag @disabled={{true}} @text="Tag content" />
      </template>,
    );

    assert.dom('.cds--tag').isDisabled().hasClass('cds--tag--disabled');
  });

  test('a cut-off text shows whole in a tooltip', async function (assert) {
    const text = 'Tag content with a long text description that goes on';
    await render(
      <template>
        <OperationalTag @text={{text}} class="extra" data-test-tag />
      </template>,
    );
    await waitUntil(() => find('.cds--tag-label-tooltip'));

    assert.dom('.cds--tag-label-tooltip .cds--tooltip-content').hasText(text);
    assert
      .dom('.cds--tag-label-tooltip button[data-test-tag]')
      .hasClass('extra');
  });
});
