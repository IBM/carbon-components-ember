import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, waitUntil, findAll } from '@ember/test-helpers';
import List from '#src/components/list.gts';

module('Integration | Component | List', (hooks) => {
  setupRenderingTest(hooks);

  test('@loading renders the skeleton', async function (assert) {
    await render(<template><List @loading={{true}} /></template>);

    assert.dom('.cds--skeleton').exists();
  });

  test('renders all items once the initial page slice is applied after insert', async function (assert) {
    await render(
      <template>
        <List @items={{array "a" "b" "c"}} as |list|>
          <list.BodyRows as |row|>
            <row.Row>
              <list.Column>{{row.item}}</list.Column>
            </row.Row>
          </list.BodyRows>
        </List>
      </template>,
    );

    await waitUntil(() => findAll('.cds--structured-list-row').length === 3, {
      timeout: 2000,
    });

    assert.dom('.cds--structured-list-row').exists({ count: 3 });
  });

  test('yields a SearchInput and Pagination that render inside the structured list section', async function (assert) {
    await render(
      <template>
        <List @items={{array "a" "b" "c"}} as |list|>
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

    const search = document.querySelector('.cds--search') as HTMLElement;
    const pagination = document.querySelector(
      '.cds--pagination',
    ) as HTMLElement;
    assert.strictEqual(
      getComputedStyle(search).display,
      'table-caption',
      '.cds--ember-list sets its .cds--search to display: table-caption',
    );
    assert.strictEqual(
      getComputedStyle(pagination).position,
      'absolute',
      '.cds--ember-list sets its .cds--pagination to position: absolute',
    );
  });

  const many = Array.from({ length: 25 }, (_, i) => `Item ${i + 1}`);
  const none: string[] = [];

  test('list.Pagination reports the first slice once it renders, and pages', async function (assert) {
    await render(
      <template>
        <List @items={{many}} as |list|>
          <list.Pagination />
          <list.BodyRows as |row|>
            <row.Row>
              <list.Column>{{row.item}}</list.Column>
            </row.Row>
          </list.BodyRows>
        </List>
      </template>,
    );

    assert.dom('.cds--structured-list-row').exists({ count: 10 });
    assert.dom('.cds--pagination__items-count').hasText('1–10 of 25 items');
    await click('.cds--pagination__button--forward');
    assert.dom('.cds--structured-list-row').hasText('Item 11');
  });

  test('list.Pagination with no items shows an empty range', async function (assert) {
    await render(
      <template>
        <List @items={{none}} as |list|>
          <list.Pagination />
          <list.BodyRows as |row|>
            <row.Row>
              <list.Column>{{row.item}}</list.Column>
            </row.Row>
          </list.BodyRows>
        </List>
      </template>,
    );

    assert.dom('.cds--structured-list-row').doesNotExist();
    assert.dom('.cds--pagination__items-count').hasText('0–0 of 0 items');
  });
});
