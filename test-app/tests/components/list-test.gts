import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitUntil, findAll } from '@ember/test-helpers';
import { array } from '@ember/helper';
import List from 'carbon-components-ember/components/list';

module('Integration | Component | List', (hooks) => {
  setupRenderingTest(hooks);

  test('@loading renders the skeleton', async function (assert) {
    await render(<template><List @loading={{true}} /></template>);

    assert.dom('.cds--skeleton').exists();
  });

  test('renders all items once the initial page slice is applied after insert', async function (assert) {
    await render(
      <template>
        <List @items={{array 'a' 'b' 'c'}} as |list|>
          <list.BodyRows as |row|>
            <row.Row>
              <list.Column>{{row.item}}</list.Column>
            </row.Row>
          </list.BodyRows>
        </List>
      </template>,
    );

    await waitUntil(
      () => findAll('.cds--structured-list-row').length === 3,
      { timeout: 2000 },
    );

    assert.dom('.cds--structured-list-row').exists({ count: 3 });
  });

  test('yields a SearchInput and Pagination that render inside the structured list section', async function (assert) {
    await render(
      <template>
        <List @items={{array 'a' 'b' 'c'}} as |list|>
          <list.SearchInput />
          <list.Pagination />
          <list.BodyRows as |row|>
            <row.Row>
              <list.Column>{{row.item}}</list.Column>
            </row.Row>
          </list.BodyRows>
        </List>
      </template>,
    );

    assert
      .dom('.cds--structured-list .cds--search')
      .exists('SearchInput renders inside the structured list section');
    assert
      .dom('.cds--structured-list .cds--pagination')
      .exists('Pagination renders inside the structured list section');
  });
});
