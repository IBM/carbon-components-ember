import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import {
  Caution,
  Checkmark,
  ChevronDown,
  Task,
  Terminal_3270,
} from '#src/icons.ts';

module('Integration | Component | Icon', (hooks) => {
  setupRenderingTest(hooks);

  test('@ariaLabel makes the icon an image; @title is text', async function (assert) {
    await render(
      <template>
        <Task @ariaLabel='Task "done"' @title="<b>Task</b>" />
      </template>,
    );

    assert
      .dom('svg')
      .hasAttribute('role', 'img')
      .hasAttribute('aria-label', 'Task "done"')
      .doesNotHaveAttribute('aria-hidden');
    assert.dom('svg title').hasText('<b>Task</b>');
    assert.dom('svg b').doesNotExist();
  });

  test('without @ariaLabel the icon is hidden', async function (assert) {
    await render(<template><Task /></template>);

    assert
      .dom('svg')
      .hasAttribute('aria-hidden', 'true')
      .doesNotHaveAttribute('role');
  });

  test('renders a bare svg, with a class only from @svgClass', async function (assert) {
    await render(
      <template>
        <Task />
        <Task @svgClass="my-icon" />
      </template>,
    );
    const [bare, classed] = findAll('svg');

    assert.dom(bare).doesNotHaveAttribute('class');
    assert.dom(classed).hasAttribute('class', 'my-icon');
  });

  test('an icon whose name contains its size keeps it, as in @carbon/icons-react', async function (assert) {
    await render(<template><Terminal_3270 @size="16" /></template>);

    assert.dom('svg').hasAttribute('width', '16');
  });

  test('is 16px by default, as in @carbon/icons-react', async function (assert) {
    await render(<template><Task /></template>);

    assert.dom('svg').hasAttribute('width', '16').hasAttribute('height', '16');
  });

  test('a size draws its own artwork where the icon has one, and scales the 32px one otherwise', async function (assert) {
    await render(
      <template>
        <Checkmark @size="20" />
        <Checkmark @size="20px" />
        <Checkmark @size="16" />
        <Caution @size="24" />
        <ChevronDown @size="glyph" />
      </template>,
    );
    const [own, px, scaled, single, glyph] = findAll('svg');

    assert.dom(own).hasAttribute('viewBox', '0 0 20 20');
    assert.dom(px).hasAttribute('viewBox', '0 0 20 20');
    assert
      .dom(scaled)
      .hasAttribute('viewBox', '0 0 32 32')
      .hasAttribute('width', '16');
    assert
      .dom(single)
      .hasAttribute('viewBox', '0 0 16 16')
      .hasAttribute('width', '24');
    assert.dom(glyph).hasAttribute('viewBox', '0 0 10 6');
  });
});
