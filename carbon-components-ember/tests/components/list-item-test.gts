import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import ListItem from '#src/components/list-item.gts';
import OrderedList from '#src/components/ordered-list.gts';
import UnorderedList from '#src/components/unordered-list.gts';

module('Integration | Component | ListItem', (hooks) => {
  setupRenderingTest(hooks);

  test('renders an li with the cds--list__item class', async function (assert) {
    await render(
      <template>
        <ListItem>Item 1</ListItem>
      </template>,
    );

    assert.dom('li').hasClass('cds--list__item');
    assert.dom('li').hasText('Item 1');
  });

  test('passes through html attributes', async function (assert) {
    await render(
      <template>
        <ListItem id="my-item" class="custom-class">Item 1</ListItem>
      </template>,
    );

    assert.dom('#my-item').exists();
    assert.dom('li').hasClass('custom-class');
    assert.dom('li').hasClass('cds--list__item');
  });

  test('works as an item within an OrderedList', async function (assert) {
    await render(
      <template>
        <OrderedList>
          <ListItem>Item 1</ListItem>
          <ListItem>Item 2</ListItem>
        </OrderedList>
      </template>,
    );

    assert.dom('ol > li').exists({ count: 2 });
    assert.dom('ol > li:nth-of-type(1)').hasClass('cds--list__item');
  });

  test('works as an item within an UnorderedList', async function (assert) {
    await render(
      <template>
        <UnorderedList>
          <ListItem>Item 1</ListItem>
          <ListItem>Item 2</ListItem>
        </UnorderedList>
      </template>,
    );

    assert.dom('ul > li').exists({ count: 2 });
    assert.dom('ul > li:nth-of-type(1)').hasClass('cds--list__item');
  });
});
