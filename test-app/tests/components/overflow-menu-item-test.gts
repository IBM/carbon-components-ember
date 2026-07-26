import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import OverflowMenu from 'carbon-components-ember/components/overflow-menu';
import { cell } from 'ember-resources';

module('Integration | Component | OverflowMenuItem', (hooks) => {
  setupRenderingTest(hooks);

  test('should render itemText as the option content', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction='bottom' as |Item|>
          <Item @itemText='Stop app' />
        </OverflowMenu>
      </template>,
    );

    await click('.cds--overflow-menu');

    assert.dom('.cds--overflow-menu-options__option-content').hasText('Stop app');
  });

  test('should support the disabled argument', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction='bottom' as |Item|>
          <Item @itemText='Clone and move app' @disabled={{true}} />
        </OverflowMenu>
      </template>,
    );

    await click('.cds--overflow-menu');

    assert
      .dom('.cds--overflow-menu-options__option')
      .hasClass('cds--overflow-menu-options__option--disabled');
    assert.dom('.cds--overflow-menu-options__btn').isDisabled();
  });

  test('should support the hasDivider argument', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction='bottom' as |Item|>
          <Item @itemText='Edit routes and access' @hasDivider={{true}} />
        </OverflowMenu>
      </template>,
    );

    await click('.cds--overflow-menu');

    assert
      .dom('.cds--overflow-menu-options__option')
      .hasClass('cds--overflow-menu--divider');
  });

  test('should support the isDelete and dangerDescription arguments', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction='bottom' as |Item|>
          <Item
            @itemText='Delete app'
            @isDelete={{true}}
            @dangerDescription='will permanently delete the app'
          />
        </OverflowMenu>
      </template>,
    );

    await click('.cds--overflow-menu');

    assert
      .dom('.cds--overflow-menu-options__option')
      .hasClass('cds--overflow-menu-options__option--danger');
    assert
      .dom('.cds--visually-hidden')
      .hasText('will permanently delete the app');
  });

  test('should render as a link when href is provided', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction='bottom' as |Item|>
          <Item @itemText='Docs' @href='https://carbondesignsystem.com' />
        </OverflowMenu>
      </template>,
    );

    await click('.cds--overflow-menu');

    assert
      .dom('.cds--overflow-menu-options__btn')
      .hasTagName('a')
      .hasAttribute('href', 'https://carbondesignsystem.com');
  });

  test('should set the title attribute only when requireTitle is true', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction='bottom' as |Item|>
          <Item @itemText='Long option text' @requireTitle={{true}} />
          <Item @itemText='Short option' />
        </OverflowMenu>
      </template>,
    );

    await click('.cds--overflow-menu');

    const options = document.querySelectorAll('.cds--overflow-menu-options__btn');
    assert.dom(options[0] as Element).hasAttribute('title', 'Long option text');
    assert.dom(options[1] as Element).doesNotHaveAttribute('title');
  });

  test('should call onClick when clicked', async function (assert) {
    const clicked = cell(false);
    const onClick = () => (clicked.current = true);

    await render(
      <template>
        <OverflowMenu @direction='bottom' as |Item|>
          <Item @itemText='option 1' @onClick={{onClick}} />
        </OverflowMenu>
      </template>,
    );

    await click('.cds--overflow-menu');
    await click('.cds--overflow-menu-options__btn');

    assert.true(clicked.current);
  });

  test('should apply className and wrapperClassName', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction='bottom' as |Item|>
          <Item
            @itemText='option 1'
            @className='my-btn-class'
            @wrapperClassName='my-wrapper-class'
          />
        </OverflowMenu>
      </template>,
    );

    await click('.cds--overflow-menu');

    assert.dom('.cds--overflow-menu-options__btn').hasClass('my-btn-class');
    assert.dom('.cds--overflow-menu-options__option').hasClass('my-wrapper-class');
  });
});
