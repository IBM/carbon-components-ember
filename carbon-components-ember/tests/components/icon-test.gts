import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find, findAll, waitUntil } from '@ember/test-helpers';
import { Task } from '#src/icons.ts';

module('Integration | Component | Icon', (hooks) => {
  setupRenderingTest(hooks);

  test('@iconDescription names the @onClick button', async function (assert) {
    let clicks = 0;
    const onClick = () => {
      clicks++;
    };

    await render(
      <template>
        <Task @onClick={{onClick}} @iconDescription="Add task" />
      </template>,
    );

    assert.dom('button').hasAttribute('aria-label', 'Add task');
    await click('button');
    assert.strictEqual(clicks, 1);
  });

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
});
