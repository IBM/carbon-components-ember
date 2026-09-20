import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitUntil } from '@ember/test-helpers';
import Tile from 'carbon-components-ember/components/tile';

module('Integration | Component | Tile', (hooks) => {
  setupRenderingTest(hooks);

  test('plain Tile renders content', async function (assert) {
    await render(
      <template>
        <Tile><:content>Plain content</:content></Tile>
      </template>,
    );

    assert.dom('.cds--tile').exists();
    assert.dom('.cds--tile').hasText('Plain content');
  });

  test('@clickable renders an anchor tile', async function (assert) {
    await render(
      <template>
        <Tile @clickable={{true}}><:content>Click me</:content></Tile>
      </template>,
    );

    assert.dom('a.cds--tile--clickable').exists();
    assert.dom('a.cds--tile--clickable').hasText('Click me');
  });

  test('@selectable renders its checkmark icon with the tile-specific class, not the default icon margin class', async function (assert) {
    await render(
      <template>
        <Tile @selectable={{true}}><:content>Selectable</:content></Tile>
      </template>,
    );

    assert.dom('.cds--tile--selectable').exists();
    await waitUntil(() => document.querySelector('.cds--tile__checkmark svg'));
    const icon = document.querySelector('.cds--tile__checkmark svg');
    assert.dom(icon).hasClass('cds--tile__checkmark-icon');
    assert.dom(icon).doesNotHaveClass('icon');
  });

  test('@selectable toggles selection on click', async function (assert) {
    await render(
      <template>
        <Tile @selectable={{true}}><:content>Selectable</:content></Tile>
      </template>,
    );

    assert.dom('input.cds--tile-input').isNotChecked();
    await click('input.cds--tile-input');
    assert.dom('input.cds--tile-input').isChecked();
    assert.dom('.cds--tile--selectable').hasClass('cds--tile--is-selected');
  });

  test('@expandable renders its chevron icon with the tile-specific class, not the default icon margin class', async function (assert) {
    await render(
      <template>
        <Tile @expandable={{true}}>
          <:above>Above the fold</:above>
          <:below>Below the fold</:below>
        </Tile>
      </template>,
    );

    assert.dom('.cds--tile--expandable').exists();
    await waitUntil(() => document.querySelector('.cds--tile__chevron svg'));
    const icon = document.querySelector('.cds--tile__chevron svg');
    assert.dom(icon).hasClass('cds--tile__chevron-icon');
    assert.dom(icon).doesNotHaveClass('icon');
  });

  test('@expandable toggles the below-the-fold content on click', async function (assert) {
    await render(
      <template>
        <Tile @expandable={{true}}>
          <:above>Above the fold</:above>
          <:below>Below the fold</:below>
        </Tile>
      </template>,
    );

    assert.dom('.cds--tile-content__below-the-fold').doesNotExist();
    await click('.cds--tile__chevron');
    assert.dom('.cds--tile--is-expanded').exists();
    assert.dom('.cds--tile-content__below-the-fold').hasText('Below the fold');
  });
});
