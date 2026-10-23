import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll, waitUntil } from '@ember/test-helpers';
import { Task, Terminal_3270 } from '#src/icons.ts';

module('Integration | Component | Icon', (hooks) => {
  setupRenderingTest(hooks);

  test('@ariaLabel makes the icon an image; @title is text', async function (assert) {
    await render(
      <template>
        <Task @ariaLabel='Task "done"' @title="<b>Task</b>" />
      </template>,
    );
    await waitUntil(() => find('svg'));

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
    await waitUntil(() => find('svg'));

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
    await waitUntil(() => findAll('svg').length === 2);
    const [bare, classed] = findAll('svg');

    assert.dom(bare).doesNotHaveAttribute('class');
    assert.dom(classed).hasAttribute('class', 'my-icon');
  });

  test('an icon whose name contains its size keeps it, as in @carbon/icons-react', async function (assert) {
    await render(<template><Terminal_3270 @size="16" /></template>);
    await waitUntil(() => find('svg'));

    assert.dom('svg').hasAttribute('width', '16');
  });
});
