import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  rerender,
  triggerKeyEvent,
  waitUntil,
  find,
} from '@ember/test-helpers';
import Tabs from 'carbon-components-ember/components/tabs';
import { Folder } from 'carbon-components-ember/icons';
import { cell } from 'ember-resources';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
} from '../helpers';

module('Integration | Component | Tabs', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display tabs', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <Tabs as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}}>Content 1</TabPane>
          <TabPane @title='Tab 2'>Content 2</TabPane>
        </Tabs>
        <style>{{styleValue.current}}</style>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    styleValue.current = carbonStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should have correct initial styles');
  });

  test('dark theme: should display tabs', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    const darkStyleValue = cell('');
    await render(
      <template>
        <Tabs as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}}>Content 1</TabPane>
          <TabPane @title='Tab 2'>Content 2</TabPane>
        </Tabs>
        <style>{{styleValue.current}}</style>
        <style>{{darkStyleValue.current}}</style>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    styleValue.current = carbonStyle.default;
    darkStyleValue.current = carbonDarkStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should correctly switch to dark styles');
  });

  test('renders a tablist with the default tab selected', async function (assert) {
    await render(
      <template>
        <Tabs as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}}>Content 1</TabPane>
          <TabPane @title='Tab 2'>Content 2</TabPane>
        </Tabs>
      </template>,
    );

    assert.dom('[role="tablist"]').exists();
    assert.dom('[role="tab"]').exists({ count: 2 });
    assert.dom('[role="tab"]:first-child').hasAttribute('aria-selected', 'true');
    assert.dom('[role="tab"]:last-child').hasAttribute('aria-selected', 'false');
    assert.dom('[role="tabpanel"]').hasText('Content 1');
  });

  test('clicking a tab selects it', async function (assert) {
    await render(
      <template>
        <Tabs as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}}>Content 1</TabPane>
          <TabPane @title='Tab 2'>Content 2</TabPane>
        </Tabs>
      </template>,
    );

    await click('[role="tab"]:last-child');

    assert.dom('[role="tab"]:last-child').hasAttribute('aria-selected', 'true');
    assert.dom('[role="tabpanel"]').hasText('Content 2');
  });

  test('@selectedTab/@tabSelected support controlled selection', async function (assert) {
    const selected = cell('Tab 1');
    const onSelect = (title: string) => {
      selected.current = title;
    };
    await render(
      <template>
        <Tabs
          @selectedTab={{selected.current}}
          @tabSelected={{onSelect}}
          as |TabPane|
        >
          <TabPane @title='Tab 1'>Content 1</TabPane>
          <TabPane @title='Tab 2'>Content 2</TabPane>
        </Tabs>
      </template>,
    );

    assert.dom('[role="tab"]:first-child').hasAttribute('aria-selected', 'true');

    await click('[role="tab"]:last-child');

    assert.strictEqual(selected.current, 'Tab 2');
    assert.dom('[role="tab"]:last-child').hasAttribute('aria-selected', 'true');
  });

  test('a disabled tab cannot be selected', async function (assert) {
    await render(
      <template>
        <Tabs as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}}>Content 1</TabPane>
          <TabPane @title='Tab 2' @disabled={{true}}>Content 2</TabPane>
        </Tabs>
      </template>,
    );

    assert.dom('[role="tab"]:last-child').hasClass('cds--tabs__nav-item--disabled');

    await click('[role="tab"]:last-child');

    assert.dom('[role="tab"]:first-child').hasAttribute('aria-selected', 'true');
  });

  test('ArrowRight/ArrowLeft/Home/End move focus and (in automatic mode) selection', async function (assert) {
    await render(
      <template>
        <Tabs as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}}>Content 1</TabPane>
          <TabPane @title='Tab 2'>Content 2</TabPane>
          <TabPane @title='Tab 3'>Content 3</TabPane>
        </Tabs>
      </template>,
    );

    const tabs = () => Array.from(document.querySelectorAll('[role="tab"]'));

    await triggerKeyEvent(tabs()[0]!, 'keydown', 'ArrowRight');
    assert.dom(tabs()[1]!).hasAttribute('aria-selected', 'true');
    assert.dom(tabs()[1]!).hasAttribute('tabindex', '0');
    assert.dom(tabs()[0]!).hasAttribute('tabindex', '-1');

    await triggerKeyEvent(tabs()[1]!, 'keydown', 'End');
    assert.dom(tabs()[2]!).hasAttribute('aria-selected', 'true');

    await triggerKeyEvent(tabs()[2]!, 'keydown', 'Home');
    assert.dom(tabs()[0]!).hasAttribute('aria-selected', 'true');

    await triggerKeyEvent(tabs()[0]!, 'keydown', 'ArrowLeft');
    assert.dom(tabs()[2]!).hasAttribute('aria-selected', 'true', 'wraps around to the last tab');
  });

  test('@activation="manual" only moves focus on arrow keys; Enter/Space selects', async function (assert) {
    await render(
      <template>
        <Tabs @activation='manual' as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}}>Content 1</TabPane>
          <TabPane @title='Tab 2'>Content 2</TabPane>
        </Tabs>
      </template>,
    );

    const tabs = () => Array.from(document.querySelectorAll('[role="tab"]'));

    await triggerKeyEvent(tabs()[0]!, 'keydown', 'ArrowRight');
    assert.dom(tabs()[0]!).hasAttribute('aria-selected', 'true', 'selection unchanged by arrow key alone');
    assert.dom(tabs()[1]!).hasAttribute('tabindex', '0', 'focus moved to the next tab');

    await triggerKeyEvent(tabs()[1]!, 'keydown', 'Enter');
    assert.dom(tabs()[1]!).hasAttribute('aria-selected', 'true', 'Enter selects the focused tab');
  });

  test('@dismissable renders a close button per tab and calls @onTabCloseRequest', async function (assert) {
    let closed: string | undefined;
    const onClose = (title: string) => {
      closed = title;
    };
    await render(
      <template>
        <Tabs @dismissable={{true}} @onTabCloseRequest={{onClose}} as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}}>Content 1</TabPane>
          <TabPane @title='Tab 2'>Content 2</TabPane>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs__nav-item--close-icon').exists({ count: 2 });

    const firstCloseButton = document.querySelectorAll(
      '.cds--tabs__nav-item--close-icon',
    )[0] as HTMLElement;
    await click(firstCloseButton);

    assert.strictEqual(closed, 'Tab 1');
    // Closing shouldn't also select the tab being closed.
    assert.dom('[role="tab"]:first-child').hasAttribute('aria-selected', 'true');
  });

  test('@renderIcon renders the given icon inside the tab at the 16px size Carbon expects', async function (assert) {
    await render(
      <template>
        <Tabs as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}} @renderIcon={{Folder}}>
            Content 1
          </TabPane>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs__nav-item--icon').exists();
    await waitUntil(() => find('.cds--tabs__nav-item--icon svg'));
    assert.dom('.cds--tabs__nav-item--icon svg').hasAttribute('width', '16');
    assert.dom('.cds--tabs__nav-item--icon svg').hasAttribute('height', '16');
  });

  test('@dismissable @renderIcon renders the given icon at the 16px size Carbon expects', async function (assert) {
    await render(
      <template>
        <Tabs @dismissable={{true}} as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}} @renderIcon={{Folder}}>
            Content 1
          </TabPane>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs__nav-item--icon-left').exists();
    await waitUntil(() => find('.cds--tabs__nav-item--icon-left svg'));
    assert
      .dom('.cds--tabs__nav-item--icon-left svg')
      .hasAttribute('width', '16');
    assert
      .dom('.cds--tabs__nav-item--icon-left svg')
      .hasAttribute('height', '16');
  });

  test('@renderIcon fits inside its wrapper under real Carbon styles, without the default icon margin', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <Tabs as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}} @renderIcon={{Folder}}>
            Content 1
          </TabPane>
        </Tabs>
        <style>{{styleValue.current}}</style>
      </template>,
    );
    await waitUntil(() => find('.cds--tabs__nav-item--icon svg'));
    styleValue.current = carbonStyle.default;
    await rerender();
    await waitForAnimationFrame();

    const wrapper = find('.cds--tabs__nav-item--icon') as HTMLElement;
    const svg = wrapper.querySelector('svg') as SVGElement;
    const wrapperRect = wrapper.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    assert.strictEqual(
      getComputedStyle(svg).margin,
      '0px',
      'the icon has no default margin pushing it out of its 16px box',
    );
    assert.true(
      svgRect.width <= wrapperRect.width && svgRect.height <= wrapperRect.height,
      'the icon fits inside its wrapper instead of overflowing it',
    );
  });

  test('@secondaryLabel only renders when @contained is set', async function (assert) {
    await render(
      <template>
        <Tabs as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}} @secondaryLabel='Sub'>
            Content 1
          </TabPane>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs__nav-item-secondary-label').doesNotExist();

    await render(
      <template>
        <Tabs @contained={{true}} as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}} @secondaryLabel='Sub'>
            Content 1
          </TabPane>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs__nav-item-secondary-label').hasText('Sub');
  });

  test('@contained, @fullWidth and @size add their modifier classes', async function (assert) {
    await render(
      <template>
        <Tabs @contained={{true}} @fullWidth={{true}} @size='lg' as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}}>Content 1</TabPane>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs').hasClass('cds--tabs--contained');
    assert.dom('.cds--tabs').hasClass('cds--tabs--full-width');
    assert.dom('.cds--tabs').hasClass('cds--layout--size-lg');
  });

  test('@size="lg" without @contained does not add the size class (line tabs cap out at md)', async function (assert) {
    await render(
      <template>
        <Tabs @size='lg' as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}}>Content 1</TabPane>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs').doesNotHaveClass('cds--layout--size-lg');
  });

  test('@fullWidth without @contained does not add the full-width class', async function (assert) {
    await render(
      <template>
        <Tabs @fullWidth={{true}} as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}}>Content 1</TabPane>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs').doesNotHaveClass('cds--tabs--full-width');
  });

  test('a contained @secondaryLabel tab adds the cds--tabs--tall class', async function (assert) {
    await render(
      <template>
        <Tabs @contained={{true}} as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}} @secondaryLabel='Sub'>
            Content 1
          </TabPane>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs').hasClass('cds--tabs--tall');
  });

  test('a disabled, dismissable tab cannot be closed by click or Delete key', async function (assert) {
    let closed: string | undefined;
    const onClose = (title: string) => {
      closed = title;
    };
    await render(
      <template>
        <Tabs @dismissable={{true}} @onTabCloseRequest={{onClose}} as |TabPane|>
          <TabPane @title='Tab 1' @isDefault={{true}}>Content 1</TabPane>
          <TabPane @title='Tab 2' @disabled={{true}}>Content 2</TabPane>
        </Tabs>
      </template>,
    );

    const disabledCloseButton = document.querySelectorAll(
      '.cds--tabs__nav-item--close-icon',
    )[1] as HTMLElement;

    assert
      .dom(disabledCloseButton)
      .hasClass('cds--tabs__nav-item--close-icon--disabled');
    assert.dom(disabledCloseButton).hasAttribute('aria-disabled', 'true');
    assert
      .dom(disabledCloseButton)
      .isDisabled('the native disabled attribute prevents the button from being clicked at all');

    const disabledTab = document.querySelectorAll('[role="tab"]')[1]!;
    await triggerKeyEvent(disabledTab, 'keydown', 'Delete');
    assert.strictEqual(
      closed,
      undefined,
      'pressing Delete on a disabled tab does not call @onTabCloseRequest',
    );
  });

  test('@loading renders a skeleton, honoring @contained', async function (assert) {
    await render(
      <template>
        <Tabs @loading={{true}} @contained={{true}} />
      </template>,
    );

    assert.dom('.cds--tabs.cds--skeleton').hasClass('cds--tabs--contained');
    assert.dom('[role="tablist"]').doesNotExist();
  });
});
