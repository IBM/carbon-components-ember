import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, find, render, settled, waitUntil } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import { Add } from '#src/icons.ts';
import SelectableTag from '#src/components/selectable-tag.gts';

module('Integration | Component | SelectableTag', (hooks) => {
  setupRenderingTest(hooks);

  test('renders an unselected tag that is a toggle button', async function (assert) {
    await render(<template><SelectableTag @text="Tag content" /></template>);

    assert
      .dom('button.cds--tag')
      .hasClass('cds--tag--selectable')
      .doesNotHaveClass('cds--tag--selectable-selected')
      .hasAttribute('type', 'button')
      .hasAria('pressed', 'false');
    assert.strictEqual(
      find('.cds--tag__label')?.textContent,
      'Tag content',
      'no whitespace around the text',
    );
  });

  test('a press toggles it and calls @onChange with whether it is selected', async function (assert) {
    const changes: boolean[] = [];
    const onChange = (selected: boolean) => changes.push(selected);

    await render(
      <template>
        <SelectableTag @onChange={{onChange}} @text="Tag content" />
      </template>,
    );
    await click('.cds--tag');

    assert
      .dom('.cds--tag')
      .hasClass('cds--tag--selectable-selected')
      .hasAria('pressed', 'true');

    await click('.cds--tag');

    assert.dom('.cds--tag').hasAria('pressed', 'false');
    assert.deepEqual(changes, [true, false]);
  });

  test('@defaultSelected starts it selected', async function (assert) {
    await render(
      <template>
        <SelectableTag @defaultSelected={{true}} @text="Tag content" />
      </template>,
    );

    assert.dom('.cds--tag').hasAria('pressed', 'true');

    await click('.cds--tag');

    assert.dom('.cds--tag').hasAria('pressed', 'false');
  });

  test('@selected wins over its own state', async function (assert) {
    const selected = tracked(false);
    const changes: boolean[] = [];
    const onChange = (value: boolean) => changes.push(value);

    await render(
      <template>
        <SelectableTag
          @onChange={{onChange}}
          @selected={{selected.value}}
          @text="Tag content"
        />
      </template>,
    );
    await click('.cds--tag');

    assert.deepEqual(changes, [true]);
    assert
      .dom('.cds--tag')
      .hasAria('pressed', 'false', 'stays as @selected says');

    selected.value = true;
    await settled();

    assert.dom('.cds--tag').hasAria('pressed', 'true');
  });

  test('a click handler goes on it with on, and runs too', async function (assert) {
    let clicks = 0;
    const onClick = () => clicks++;

    await render(
      <template>
        <SelectableTag @text="Tag content" {{on "click" onClick}} />
      </template>,
    );
    await click('.cds--tag');

    assert.strictEqual(clicks, 1);
    assert.dom('.cds--tag').hasAria('pressed', 'true');
  });

  test('its icon shows, except at the small size', async function (assert) {
    await render(
      <template>
        <SelectableTag @renderIcon={{Add}} @text="Tag content" />
      </template>,
    );
    assert.dom('.cds--tag__custom-icon svg').exists();

    await render(
      <template>
        <SelectableTag @renderIcon={{Add}} @size="sm" @text="Tag content" />
      </template>,
    );
    assert.dom('.cds--tag__custom-icon').doesNotExist();
    assert.dom('.cds--tag').hasClass('cds--tag--sm');
  });

  test('@id is its id', async function (assert) {
    await render(
      <template><SelectableTag @id="my-tag" @text="Tag content" /></template>,
    );

    assert.dom('.cds--tag').hasAttribute('id', 'my-tag');
  });

  test('@disabled disables it', async function (assert) {
    await render(
      <template>
        <SelectableTag @disabled={{true}} @text="Tag content" />
      </template>,
    );

    assert.dom('.cds--tag').isDisabled().hasClass('cds--tag--disabled');
  });

  test('a cut-off text shows whole in a tooltip', async function (assert) {
    const text = 'Tag content with a long text description that goes on';
    await render(<template><SelectableTag @text={{text}} /></template>);
    await waitUntil(() => find('.cds--tag-label-tooltip'));

    assert.dom('.cds--tag-label-tooltip .cds--tooltip-content').hasText(text);
    assert.dom('.cds--tag-label-tooltip button.cds--tag--selectable').exists();
  });
});
