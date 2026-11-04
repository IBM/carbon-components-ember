import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  focus,
  rerender,
  settled,
  triggerEvent,
  triggerKeyEvent,
  find,
  waitUntil,
} from '@ember/test-helpers';
import styleModifier from 'ember-style-modifier';
import Tabs from '#src/components/tabs.gts';
import { Folder } from '#src/icons.ts';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import { tracked } from '@glimmer/tracking';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
  disableCarbonStyles,
  enableCarbonStyles,
  nonce,
} from '../helpers';

module('Integration | Component | Tabs', (hooks) => {
  setupRenderingTest(hooks);

  const tabs = () => Array.from(document.querySelectorAll('[role="tab"]'));
  const panels = () =>
    Array.from(document.querySelectorAll('[role="tabpanel"]'));

  test('white theme: should display tabs', async function (this: RenderingTestContext, assert) {
    disableCarbonStyles();
    await render(
      <template>
        <Tabs as |TabList TabPanels|>
          <TabList aria-label="List of tabs" as |Tab|>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
          </TabPanels>
        </Tabs>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    enableCarbonStyles();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should have correct initial styles');
  });

  test('dark theme: should display tabs', async function (this: RenderingTestContext, assert) {
    disableCarbonStyles();
    const darkStyleValue = tracked('');
    await render(
      <template>
        <Tabs as |TabList TabPanels|>
          <TabList aria-label="List of tabs" as |Tab|>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
          </TabPanels>
        </Tabs>
        <style nonce={{nonce}}>
          {{darkStyleValue.value}}
        </style>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    enableCarbonStyles();
    darkStyleValue.value = carbonDarkStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should correctly switch to dark styles');
  });

  test('renders a tablist with the first tab selected', async function (assert) {
    await render(
      <template>
        <Tabs as |TabList TabPanels|>
          <TabList aria-label="List of tabs" as |Tab|>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
          </TabPanels>
        </Tabs>
      </template>,
    );

    assert
      .dom('[role="tablist"]')
      .hasAttribute(
        'aria-label',
        'List of tabs',
        'attributes go on the tablist',
      );
    assert.dom('[role="tab"]').exists({ count: 2 });
    assert.dom(tabs()[0]).hasAttribute('aria-selected', 'true');
    assert.dom(tabs()[1]).hasAttribute('aria-selected', 'false');
    assert.dom('[role="tabpanel"]:not([hidden])').hasText('Content 1');
  });

  test('@defaultSelectedIndex selects a tab at first', async function (assert) {
    await render(
      <template>
        <Tabs @defaultSelectedIndex={{1}} as |TabList TabPanels|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
          </TabPanels>
        </Tabs>
      </template>,
    );

    assert.dom(tabs()[1]).hasAttribute('aria-selected', 'true');
    assert.dom('[role="tabpanel"]:not([hidden])').hasText('Content 2');
  });

  test('if the selected tab is disabled at first, the first enabled tab is selected', async function (assert) {
    const changes: number[] = [];
    const onChange = ({ selectedIndex }: { selectedIndex: number }) => {
      changes.push(selectedIndex);
    };
    await render(
      <template>
        <Tabs @onChange={{onChange}} as |TabList TabPanels|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab @disabled={{true}}>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
          </TabPanels>
        </Tabs>
      </template>,
    );

    assert.dom(tabs()[0]).hasAttribute('aria-selected', 'false');
    assert.dom(tabs()[1]).hasAttribute('aria-selected', 'true');
    assert.dom('[role="tabpanel"]:not([hidden])').hasText('Content 2');
    assert.deepEqual(changes, [1]);
  });

  test('all tab panels are always rendered, with unselected ones hidden, and the tabs control them', async function (assert) {
    await render(
      <template>
        <Tabs as |TabList TabPanels|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </Tabs>
      </template>,
    );

    assert.strictEqual(panels().length, 3);
    tabs().forEach((tab, index) => {
      const panel = document.getElementById(tab.getAttribute('aria-controls')!);
      assert.strictEqual(
        panel,
        panels()[index],
        `tab ${index} controls panel ${index}`,
      );
      assert.dom(panel).hasAttribute('aria-labelledby', tab.id);
    });
    assert.dom(panels()[0]).doesNotHaveAttribute('hidden');
    assert.dom(panels()[1]).hasAttribute('hidden');
    assert.dom(panels()[2]).hasAttribute('hidden');
  });

  test('attributes go on the tab and the panel', async function (assert) {
    await render(
      <template>
        <Tabs as |TabList TabPanels|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab data-test-tab class="mine">Tab 1</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel data-test-panel>Content 1</TabPanel>
          </TabPanels>
        </Tabs>
      </template>,
    );

    assert.dom('[data-test-tab]').hasAttribute('role', 'tab');
    assert
      .dom('[data-test-tab]')
      .hasClass('mine')
      .hasClass('cds--tabs__nav-item');
    assert.dom('[data-test-panel]').hasAttribute('role', 'tabpanel');
  });

  test('clicking a tab selects it and reports the index', async function (assert) {
    const changes: { selectedIndex: number }[] = [];
    const onChange = (state: { selectedIndex: number }) => {
      changes.push(state);
    };
    await render(
      <template>
        <Tabs @onChange={{onChange}} as |TabList TabPanels|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
          </TabPanels>
        </Tabs>
      </template>,
    );

    await click(tabs()[1]!);

    assert.dom(tabs()[1]).hasAttribute('aria-selected', 'true');
    assert.dom('[role="tabpanel"]:not([hidden])').hasText('Content 2');
    assert.deepEqual(changes, [{ selectedIndex: 1 }]);

    await click(tabs()[1]!);
    assert.deepEqual(
      changes,
      [{ selectedIndex: 1 }, { selectedIndex: 1 }],
      'as in Carbon React, selecting the selected tab reports it again',
    );
  });

  test('a caller can listen to a tab with {{on}}', async function (assert) {
    let clicks = 0;
    const count = () => {
      clicks++;
    };
    await render(
      <template>
        <Tabs as |TabList|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab {{on "click" count}}>Tab 1</Tab>
          </TabList>
        </Tabs>
      </template>,
    );

    await click(tabs()[0]!);
    assert.strictEqual(clicks, 1);
  });

  test('@selectedIndex controls the selection', async function (assert) {
    const selected = tracked(0);
    const onChange = ({ selectedIndex }: { selectedIndex: number }) => {
      selected.value = selectedIndex;
    };
    await render(
      <template>
        <Tabs
          @selectedIndex={{selected.value}}
          @onChange={{onChange}}
          as |TabList TabPanels|
        >
          <TabList aria-label="Tabs" as |Tab|>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
          </TabPanels>
        </Tabs>
      </template>,
    );

    await click(tabs()[1]!);
    assert.strictEqual(selected.value, 1);
    assert.dom(tabs()[1]).hasAttribute('aria-selected', 'true');

    selected.value = 0;
    await settled();
    assert.dom(tabs()[0]).hasAttribute('aria-selected', 'true');
  });

  test('without a change handler @selectedIndex holds the selection', async function (assert) {
    await render(
      <template>
        <Tabs @selectedIndex={{0}} as |TabList TabPanels|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
          </TabPanels>
        </Tabs>
      </template>,
    );

    await click(tabs()[1]!);
    assert.dom(tabs()[0]).hasAttribute('aria-selected', 'true');
  });

  test('a disabled tab cannot be selected', async function (assert) {
    await render(
      <template>
        <Tabs as |TabList TabPanels|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab>Tab 1</Tab>
            <Tab @disabled={{true}}>Tab 2</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
          </TabPanels>
        </Tabs>
      </template>,
    );

    assert.dom(tabs()[1]).hasClass('cds--tabs__nav-item--disabled');
    assert.dom(tabs()[1]).isDisabled();
    assert.dom(tabs()[1]).hasAttribute('aria-disabled', 'true');
    assert.dom(tabs()[0]).hasAttribute('aria-selected', 'true');
  });

  test('ArrowRight/ArrowLeft/Home/End move focus and (in automatic mode) selection', async function (assert) {
    await render(
      <template>
        <Tabs as |TabList TabPanels|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </Tabs>
      </template>,
    );

    await triggerKeyEvent(tabs()[0]!, 'keydown', 'ArrowRight');
    assert.dom(tabs()[1]).hasAttribute('aria-selected', 'true');
    assert.dom(tabs()[1]).hasAttribute('tabindex', '0');
    assert.dom(tabs()[0]).hasAttribute('tabindex', '-1');

    await triggerKeyEvent(tabs()[1]!, 'keydown', 'End');
    assert.dom(tabs()[2]).hasAttribute('aria-selected', 'true');

    await triggerKeyEvent(tabs()[2]!, 'keydown', 'Home');
    assert.dom(tabs()[0]).hasAttribute('aria-selected', 'true');

    await triggerKeyEvent(tabs()[0]!, 'keydown', 'ArrowLeft');
    assert
      .dom(tabs()[2])
      .hasAttribute('aria-selected', 'true', 'wraps around to the last tab');
  });

  test('@activation="manual" only moves focus on arrow keys; pressing the tab selects it', async function (assert) {
    await render(
      <template>
        <Tabs as |TabList TabPanels|>
          <TabList aria-label="Tabs" @activation="manual" as |Tab|>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
          </TabPanels>
        </Tabs>
      </template>,
    );

    await triggerKeyEvent(tabs()[0]!, 'keydown', 'ArrowRight');
    assert
      .dom(tabs()[0])
      .hasAttribute(
        'aria-selected',
        'true',
        'selection unchanged by arrow key alone',
      );
    assert.dom(tabs()[1]).isFocused('focus moved to the next tab');
    assert
      .dom(tabs()[0])
      .hasAttribute('tabindex', '0', 'the selected tab keeps the tab stop');

    // A button's Enter and Space presses click it.
    await click(tabs()[1]!);
    assert.dom(tabs()[1]).hasAttribute('aria-selected', 'true');
  });

  test('arrow keys wrap around and skip disabled tabs, selecting as they go', async function (assert) {
    await render(
      <template>
        <Tabs as |TabList TabPanels|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab>Tab 1</Tab>
            <Tab @disabled={{true}}>Tab 2</Tab>
            <Tab>Tab 3</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </Tabs>
      </template>,
    );

    await focus(tabs()[0]!);
    await triggerKeyEvent(tabs()[0]!, 'keydown', 'ArrowRight');
    assert.dom(tabs()[2]).isFocused('skips the disabled tab');
    assert.dom(tabs()[2]).hasAttribute('aria-selected', 'true');
    assert.dom(tabs()[2]).hasAttribute('tabindex', '0');

    await triggerKeyEvent(tabs()[2]!, 'keydown', 'ArrowRight');
    assert.dom(tabs()[0]).isFocused('wraps to the first tab');
    await triggerKeyEvent(tabs()[0]!, 'keydown', 'End');
    assert.dom(tabs()[2]).isFocused();
  });

  test('keeps a tab stop when @selectedIndex names no tab', async function (assert) {
    await render(
      <template>
        <Tabs @selectedIndex={{5}} as |TabList TabPanels|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab @disabled={{true}}>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
          </TabPanels>
        </Tabs>
      </template>,
    );

    assert
      .dom(tabs()[1])
      .hasAttribute('tabindex', '0', 'the first enabled tab');
    assert.dom(tabs()[1]).hasAttribute('aria-selected', 'false');
  });

  test('in right-to-left, ArrowLeft moves to the next tab', async function (assert) {
    await render(
      <template>
        <div dir="rtl">
          <Tabs as |TabList|>
            <TabList aria-label="Tabs" as |Tab|>
              <Tab>Tab 1</Tab>
              <Tab>Tab 2</Tab>
            </TabList>
          </Tabs>
        </div>
      </template>,
    );

    await triggerKeyEvent(tabs()[0]!, 'keydown', 'ArrowLeft');
    assert.dom(tabs()[1]).isFocused();
  });

  test('tabs and panels pair by DOM order when some are added later', async function (assert) {
    const showMiddle = tracked(false);

    await render(
      <template>
        <Tabs @defaultSelectedIndex={{1}} as |TabList TabPanels|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab>First</Tab>
            {{#if showMiddle.value}}
              <Tab>Middle</Tab>
            {{/if}}
            <Tab>Last</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel>First panel</TabPanel>
            {{#if showMiddle.value}}
              <TabPanel>Middle panel</TabPanel>
            {{/if}}
            <TabPanel>Last panel</TabPanel>
          </TabPanels>
        </Tabs>
      </template>,
    );
    showMiddle.value = true;
    await settled();

    assert.deepEqual(
      tabs().map((tab) => tab.textContent?.trim()),
      ['First', 'Middle', 'Last'],
    );
    assert.dom('[role="tabpanel"]:not([hidden])').hasText('Middle panel');
    tabs().forEach((tab, index) => {
      assert.strictEqual(
        document.getElementById(tab.getAttribute('aria-controls')!),
        panels()[index],
      );
    });

    showMiddle.value = false;
    await settled();

    assert.deepEqual(
      tabs().map((tab) => tab.textContent?.trim()),
      ['First', 'Last'],
    );
    assert.dom('[role="tabpanel"]:not([hidden])').hasText('Last panel');
  });

  test('@dismissable renders a close button per tab and calls @onTabCloseRequest with the index', async function (assert) {
    let closed: number | undefined;
    const onClose = (index: number) => {
      closed = index;
    };
    await render(
      <template>
        <Tabs
          @dismissable={{true}}
          @onTabCloseRequest={{onClose}}
          as |TabList TabPanels|
        >
          <TabList aria-label="Tabs" as |Tab|>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </TabList>
          <TabPanels as |TabPanel|>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
          </TabPanels>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs').hasClass('cds--tabs--dismissable');
    assert.dom('.cds--tabs__nav-item--close-icon').exists({ count: 2 });
    assert
      .dom('.cds--tabs__nav-item--close-icon')
      .hasAttribute('title', 'Remove Tab 1 tab');

    await click(
      document.querySelectorAll('.cds--tabs__nav-item--close-icon')[1]!,
    );

    assert.strictEqual(closed, 1);
    assert
      .dom(tabs()[0])
      .hasAttribute('aria-selected', 'true', 'closing does not select the tab');
  });

  test('the Delete key asks to close the focused dismissable tab', async function (assert) {
    const closed: number[] = [];
    const onClose = (index: number) => {
      closed.push(index);
    };
    await render(
      <template>
        <Tabs @dismissable={{true}} @onTabCloseRequest={{onClose}} as |TabList|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </TabList>
        </Tabs>
      </template>,
    );

    await triggerKeyEvent(tabs()[1]!, 'keydown', 'Delete');
    assert.deepEqual(closed, [1]);
  });

  test('the Delete key does nothing without @dismissable', async function (assert) {
    const closed: number[] = [];
    const onClose = (index: number) => {
      closed.push(index);
    };
    await render(
      <template>
        <Tabs @onTabCloseRequest={{onClose}} as |TabList|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab>Tab 1</Tab>
          </TabList>
        </Tabs>
      </template>,
    );

    await triggerKeyEvent(tabs()[0]!, 'keydown', 'Delete');
    assert.deepEqual(closed, []);
  });

  test('focus moves to the next tab when a focused tab is closed', async function (assert) {
    const labels = tracked(['Tab 1', 'Tab 2', 'Tab 3']);
    const onClose = (index: number) => {
      labels.value = labels.value.filter((_label, i) => i !== index);
    };
    await render(
      <template>
        <Tabs
          @dismissable={{true}}
          @onTabCloseRequest={{onClose}}
          as |TabList TabPanels|
        >
          <TabList aria-label="Tabs" as |Tab|>
            {{#each labels.value as |label|}}
              <Tab>{{label}}</Tab>
            {{/each}}
          </TabList>
          <TabPanels as |TabPanel|>
            {{#each labels.value as |label|}}
              <TabPanel>{{label}}</TabPanel>
            {{/each}}
          </TabPanels>
        </Tabs>
      </template>,
    );

    await focus(tabs()[1]!);
    await triggerKeyEvent(tabs()[1]!, 'keydown', 'Delete');

    assert.deepEqual(
      tabs().map((tab) => tab.textContent?.trim()),
      ['Tab 1', 'Tab 3'],
    );
    assert.dom(tabs()[1]).isFocused();
  });

  test('@renderIcon renders the given icon inside the tab at the 16px size Carbon expects', async function (assert) {
    await render(
      <template>
        <Tabs as |TabList|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab @renderIcon={{Folder}}>Tab 1</Tab>
          </TabList>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs__nav-item--icon').exists();
    assert.dom('.cds--tabs__nav-item--icon svg').hasAttribute('width', '16');
    assert.dom('.cds--tabs__nav-item--icon svg').hasAttribute('height', '16');
  });

  test('@dismissable @renderIcon puts the icon before the label', async function (assert) {
    await render(
      <template>
        <Tabs @dismissable={{true}} as |TabList|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab @renderIcon={{Folder}}>Tab 1</Tab>
          </TabList>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs__nav-item--icon').doesNotExist();
    assert
      .dom('.cds--tabs__nav-item--icon-left svg')
      .hasAttribute('width', '16');
    assert
      .dom('.cds--tabs__nav-item--icon-left svg')
      .hasAttribute('height', '16');
  });

  test('@renderIcon fits inside its wrapper under real Carbon styles, without the default icon margin', async function (this: RenderingTestContext, assert) {
    await render(
      <template>
        <Tabs as |TabList|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab @renderIcon={{Folder}}>Tab 1</Tab>
          </TabList>
        </Tabs>
      </template>,
    );
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
      svgRect.width <= wrapperRect.width &&
        svgRect.height <= wrapperRect.height,
      'the icon fits inside its wrapper instead of overflowing it',
    );
  });

  test('@secondaryLabel only renders when the list is @contained', async function (assert) {
    await render(
      <template>
        <Tabs as |TabList|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab @secondaryLabel="Sub">Tab 1</Tab>
          </TabList>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs__nav-item-secondary-label').doesNotExist();

    await render(
      <template>
        <Tabs as |TabList|>
          <TabList aria-label="Tabs" @contained={{true}} as |Tab|>
            <Tab @secondaryLabel="Sub">Tab 1</Tab>
          </TabList>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs__nav-item-secondary-label').hasText('Sub');
    assert.dom('.cds--tabs').hasClass('cds--tabs--tall');
  });

  test('@contained, @fullWidth, @size and @light add their modifier classes', async function (assert) {
    await render(
      <template>
        <Tabs as |TabList|>
          <TabList
            aria-label="Tabs"
            @contained={{true}}
            @fullWidth={{true}}
            @size="lg"
            @light={{true}}
            @className="mine"
            as |Tab|
          >
            <Tab>Tab 1</Tab>
          </TabList>
        </Tabs>
      </template>,
    );

    assert
      .dom('.cds--tabs')
      .hasClass('cds--tabs--contained')
      .hasClass('cds--tabs--full-width')
      .hasClass('cds--layout--size-lg')
      .hasClass('cds--tabs--light')
      .hasClass('mine');
  });

  test('@fullWidth applies only from the lg breakpoint', async function (assert) {
    // eslint-disable-next-line @typescript-eslint/unbound-method -- restored below
    const { matchMedia } = window;
    window.matchMedia = (query: string) =>
      Object.assign(new EventTarget(), {
        matches: false,
        media: query,
      }) as unknown as MediaQueryList;
    try {
      await render(
        <template>
          <Tabs as |TabList|>
            <TabList
              aria-label="Tabs"
              @contained={{true}}
              @fullWidth={{true}}
              as |Tab|
            >
              <Tab>Tab 1</Tab>
            </TabList>
          </Tabs>
        </template>,
      );
    } finally {
      window.matchMedia = matchMedia;
    }

    assert.dom('.cds--tabs').doesNotHaveClass('cds--tabs--full-width');
  });

  test('@fullWidth needs fewer than 9 tabs', async function (assert) {
    const labels = Array.from({ length: 9 }, (_, i) => `Tab ${i + 1}`);
    await render(
      <template>
        <Tabs as |TabList|>
          <TabList
            aria-label="Tabs"
            @contained={{true}}
            @fullWidth={{true}}
            as |Tab|
          >
            {{#each labels as |label|}}<Tab>{{label}}</Tab>{{/each}}
          </TabList>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs').doesNotHaveClass('cds--tabs--full-width');
  });

  test('@size="lg" without @contained does not add the size class (line tabs cap out at md)', async function (assert) {
    await render(
      <template>
        <Tabs as |TabList|>
          <TabList aria-label="Tabs" @size="lg" as |Tab|>
            <Tab>Tab 1</Tab>
          </TabList>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs').doesNotHaveClass('cds--layout--size-lg');
  });

  test('@fullWidth without @contained does not add the full-width class', async function (assert) {
    await render(
      <template>
        <Tabs as |TabList|>
          <TabList aria-label="Tabs" @fullWidth={{true}} as |Tab|>
            <Tab>Tab 1</Tab>
          </TabList>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs').doesNotHaveClass('cds--tabs--full-width');
  });

  test('a disabled, dismissable tab cannot be closed', async function (assert) {
    await render(
      <template>
        <Tabs @dismissable={{true}} as |TabList|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab>Tab 1</Tab>
            <Tab @disabled={{true}}>Tab 2</Tab>
          </TabList>
        </Tabs>
      </template>,
    );

    const closeButton = document.querySelectorAll(
      '.cds--tabs__nav-item--close-icon',
    )[1] as HTMLElement;

    assert
      .dom(closeButton)
      .hasClass('cds--tabs__nav-item--close-icon--disabled');
    assert.dom(closeButton).hasAttribute('aria-disabled', 'true');
    assert.dom(closeButton).isDisabled();
    assert.dom(tabs()[1]).isDisabled();
  });

  test('without @dismissable every tab still has a hidden close wrapper that cannot close it', async function (assert) {
    let closed: number | undefined;
    const onClose = (index: number) => {
      closed = index;
    };
    await render(
      <template>
        <Tabs @onTabCloseRequest={{onClose}} as |TabList|>
          <TabList aria-label="Tabs" as |Tab|>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </TabList>
        </Tabs>
      </template>,
    );

    assert.dom('.cds--tabs__nav-item--close--hidden').exists({ count: 2 });
    assert.dom('.cds--tabs__nav-item--close-icon').doesNotExist();
    const hiddenButtons = document.querySelectorAll(
      '.cds--tabs__nav-item--close--hidden button',
    );
    assert.strictEqual(hiddenButtons.length, 2);
    for (const button of hiddenButtons) {
      assert.dom(button).hasClass('cds--visually-hidden');
      assert.dom(button).hasAttribute('aria-hidden', 'true');
    }

    await click(hiddenButtons[0] as HTMLElement);
    assert.strictEqual(
      closed,
      undefined,
      'clicking the hidden button does not call @onTabCloseRequest',
    );
  });

  test('the scroll buttons show once a resize makes the tab list overflow', async function (assert) {
    const width = tracked('4000px');
    const labels = Array.from({ length: 10 }, (_, i) => `Tab ${i + 1}`);
    const next = '.cds--tab--overflow-nav-button--next';
    const hidden = 'cds--tab--overflow-nav-button--hidden';
    await render(
      <template>
        <div {{styleModifier width=width.value}}>
          <Tabs as |TabList|>
            <TabList aria-label="Tabs" as |Tab|>
              {{#each labels as |label|}}<Tab>{{label}}</Tab>{{/each}}
            </TabList>
          </Tabs>
        </div>
      </template>,
    );
    await waitForAnimationFrame();
    assert.dom(next).hasClass(hidden);

    width.value = '200px';
    await waitUntil(() => !find(next)?.classList.contains(hidden), {
      timeoutMessage: 'the next scroll button stayed hidden after the resize',
    });

    assert.dom(next).doesNotHaveClass(hidden);
  });

  test('a scroll button scrolls the tab list', async function (assert) {
    const labels = Array.from({ length: 10 }, (_, i) => `Tab ${i + 1}`);
    const next = '.cds--tab--overflow-nav-button--next';
    const previous = '.cds--tab--overflow-nav-button--previous';
    const hidden = 'cds--tab--overflow-nav-button--hidden';
    await render(
      <template>
        <div {{styleModifier width="200px"}}>
          <Tabs as |TabList|>
            <TabList aria-label="Tabs" as |Tab|>
              {{#each labels as |label|}}<Tab>{{label}}</Tab>{{/each}}
            </TabList>
          </Tabs>
        </div>
      </template>,
    );
    await waitUntil(() => !find(next)?.classList.contains(hidden));
    assert.dom(previous).hasClass(hidden);

    await click(next);
    await waitUntil(() => !find(previous)?.classList.contains(hidden), {
      timeoutMessage: 'the previous scroll button stayed hidden',
    });

    assert.true((find('[role="tablist"]') as HTMLElement).scrollLeft > 0);
  });

  test('closing the focused last tab moves focus to the previous one', async function (assert) {
    const labels = tracked(['Tab 1', 'Tab 2', 'Tab 3']);
    const onClose = (index: number) => {
      labels.value = labels.value.filter((_label, i) => i !== index);
    };
    await render(
      <template>
        <Tabs
          @dismissable={{true}}
          @onTabCloseRequest={{onClose}}
          as |TabList TabPanels|
        >
          <TabList aria-label="Tabs" as |Tab|>
            {{#each labels.value as |label|}}
              <Tab>{{label}}</Tab>
            {{/each}}
          </TabList>
          <TabPanels as |TabPanel|>
            {{#each labels.value as |label|}}
              <TabPanel>{{label}}</TabPanel>
            {{/each}}
          </TabPanels>
        </Tabs>
      </template>,
    );

    await focus(tabs()[2]!);
    await triggerKeyEvent(tabs()[2]!, 'keydown', 'Delete');

    assert.strictEqual(tabs().length, 2);
    assert.dom(tabs()[1]).isFocused();
  });

  test("a contained tab doesn't highlight while its close button is hovered", async function (assert) {
    const noop = () => {};
    await render(
      <template>
        <Tabs @dismissable={{true}} @onTabCloseRequest={{noop}} as |TabList|>
          <TabList aria-label="Tabs" @contained={{true}} as |Tab|>
            <Tab>Tab 1</Tab>
          </TabList>
        </Tabs>
      </template>,
    );
    const hoverOff = 'cds--tabs__nav-item--hover-off';

    await triggerEvent('.cds--tabs__nav-item--close-icon', 'mouseover');
    assert.dom(tabs()[0]).hasClass(hoverOff);

    await triggerEvent('.cds--tabs__nav-item--close-icon', 'mouseleave');
    assert.dom(tabs()[0]).doesNotHaveClass(hoverOff);
  });

  test('in right-to-left the scroll buttons swap their labels', async function (assert) {
    await render(
      <template>
        <div dir="rtl">
          <Tabs as |TabList|>
            <TabList aria-label="Tabs" as |Tab|>
              <Tab>Tab 1</Tab>
            </TabList>
          </Tabs>
        </div>
      </template>,
    );
    await waitForAnimationFrame();

    assert
      .dom('.cds--tab--overflow-nav-button--previous')
      .hasAttribute('aria-label', 'Scroll right');
    assert
      .dom('.cds--tab--overflow-nav-button--next')
      .hasAttribute('aria-label', 'Scroll left');
  });
});
