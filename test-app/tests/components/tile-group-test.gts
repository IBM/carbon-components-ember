import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import RadioTile from 'carbon-components-ember/components/radio-tile';
import TileGroup from 'carbon-components-ember/components/tile/group';
import { fn } from '@ember/helper';
import { cell } from 'ember-resources';

function setCell(theCell: { current: unknown }, value: unknown) {
  theCell.current = value;
}

module('Integration | Component | TileGroup', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a standalone RadioTile', async function (assert) {
    await render(<template><RadioTile @value='a'>Option</RadioTile></template>);

    assert.dom('input.cds--tile-input').exists();
    assert.dom('label.cds--tile--radio').exists();
    assert.dom('.cds--tile-content').hasText('Option');
  });

  test('should respect the checked argument', async function (assert) {
    await render(
      <template><RadioTile @value='a' @checked={{true}}>Option</RadioTile></template>,
    );

    assert.dom('input.cds--tile-input').isChecked();
    assert.dom('label.cds--tile--radio').hasClass('cds--tile--is-selected');
  });

  test('should respect the disabled argument', async function (assert) {
    await render(
      <template><RadioTile @value='a' @disabled={{true}}>Option</RadioTile></template>,
    );

    assert.dom('input.cds--tile-input').isDisabled();
  });

  test('TileGroup should render a legend and only allow one selection', async function (assert) {
    await render(
      <template>
        <TileGroup @name='tiles' @legend='Choose one' as |Tile|>
          <Tile @value='a'>A</Tile>
          <Tile @value='b'>B</Tile>
        </TileGroup>
      </template>,
    );

    assert.dom('legend.cds--label').hasText('Choose one');

    const inputs = document.querySelectorAll('.cds--tile-group input');
    assert.strictEqual(inputs.length, 2);

    await click(inputs[0] as Element);
    assert.dom(inputs[0] as Element).isChecked();
    assert.dom(inputs[1] as Element).isNotChecked();

    await click(inputs[1] as Element);
    assert.dom(inputs[0] as Element).isNotChecked();
    assert.dom(inputs[1] as Element).isChecked();
  });

  test('TileGroup should respect defaultSelected on the group', async function (assert) {
    await render(
      <template>
        <TileGroup @name='tiles' @defaultSelected='a' as |Tile|>
          <Tile @value='a'>A</Tile>
          <Tile @value='b'>B</Tile>
        </TileGroup>
      </template>,
    );

    const inputs = document.querySelectorAll('.cds--tile-group input');
    assert.dom(inputs[0] as Element).isChecked();
    assert.dom(inputs[1] as Element).isNotChecked();
  });

  test('TileGroup should call onChange with the selected value', async function (assert) {
    const selected = cell<string | undefined>(undefined);

    await render(
      <template>
        <TileGroup @name='tiles' @onChange={{fn setCell selected}} as |Tile|>
          <Tile @value='a'>A</Tile>
          <Tile @value='b'>B</Tile>
        </TileGroup>
      </template>,
    );

    const inputs = document.querySelectorAll('.cds--tile-group input');
    await click(inputs[1] as Element);

    assert.strictEqual(selected.current, 'b');
  });

  test('TileGroup should disable all radio tiles when disabled', async function (assert) {
    await render(
      <template>
        <TileGroup @name='tiles' @disabled={{true}} as |Tile|>
          <Tile @value='a'>A</Tile>
          <Tile @value='b'>B</Tile>
        </TileGroup>
      </template>,
    );

    const inputs = document.querySelectorAll('.cds--tile-group input');
    assert.dom(inputs[0] as Element).isDisabled();
    assert.dom(inputs[1] as Element).isDisabled();
  });

  test('TileGroup should use the group name for each RadioTile input', async function (assert) {
    await render(
      <template>
        <TileGroup @name='my-tiles' as |Tile|>
          <Tile @value='a'>A</Tile>
        </TileGroup>
      </template>,
    );

    assert.dom('.cds--tile-group input').hasAttribute('name', 'my-tiles');
  });
});
