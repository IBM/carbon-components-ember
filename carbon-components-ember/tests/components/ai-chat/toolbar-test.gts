import { module, test } from 'qunit';
import { setupApplicationTest, setupRenderingTest } from 'ember-qunit';
import { render, click, waitUntil, find, settled } from '@ember/test-helpers';
import { trackedObject } from '@ember/reactive/collections';
import Toolbar from '#src/components/ai-chat/toolbar.gts';
import type { ToolbarAction } from '#src/components/ai-chat/toolbar.gts';
import { Add, Settings } from '#src/icons.ts';
import style from 'ember-style-modifier';
import { setupRoutes, visitWith } from '../../helpers';

const noActions: ToolbarAction[] = [];

module('Integration | Component | ai-chat/Toolbar', (hooks) => {
  setupRenderingTest(hooks);

  test('renders @titleText/@nameText and all actions when @overflow is not set', async function (assert) {
    let clicks = 0;
    const actions = [
      { text: 'Add', icon: Add, onClick: () => clicks++ },
      { text: 'Settings', icon: Settings, onClick: () => clicks++ },
    ];

    await render(
      <template>
        <Toolbar @titleText="My" @nameText="Toolbar" @actions={{actions}} />
      </template>,
    );

    assert.dom('.cds-aichat-toolbar__title').hasText('My Toolbar');
    assert
      .dom('.cds-aichat-toolbar__actions-container button')
      .exists({ count: 2 });
    assert.dom('.cds-aichat-toolbar .cds--overflow-menu').doesNotExist();

    await click('.cds-aichat-toolbar__actions-container button');
    assert.strictEqual(clicks, 1);
  });

  test('a navigation block renders in the leading area', async function (assert) {
    await render(
      <template>
        <Toolbar @actions={{noActions}}>
          <:navigation><button
              type="button"
              class="nav-btn"
            >Back</button></:navigation>
        </Toolbar>
      </template>,
    );

    assert.dom('.cds-aichat-toolbar__navigation .nav-btn').exists();
  });

  test('a title block overrides @titleText', async function (assert) {
    await render(
      <template>
        <Toolbar @titleText="Ignored" @actions={{noActions}}>
          <:title><span class="custom-title">Custom</span></:title>
        </Toolbar>
      </template>,
    );

    assert.dom('.cds-aichat-toolbar__title .custom-title').hasText('Custom');
    assert.dom('.cds-aichat-toolbar__title').doesNotContainText('Ignored');
  });

  test('@overflow collapses actions that do not fit into an overflow menu', async function (assert) {
    const actions = [
      { text: 'Add', icon: Add, onClick: () => {} },
      { text: 'Settings', icon: Settings, onClick: () => {} },
      { text: 'Add 2', icon: Add, onClick: () => {} },
      { text: 'Settings 2', icon: Settings, onClick: () => {} },
    ];

    await render(
      <template>
        <div {{style maxInlineSize="80px"}}>
          <Toolbar @overflow={{true}} @actions={{actions}} />
        </div>
      </template>,
    );

    await waitUntil(() => find('.cds-aichat-toolbar .cds--overflow-menu'));

    assert.dom('.cds-aichat-toolbar .cds--overflow-menu').exists();
    const visibleButtons = document.querySelectorAll(
      '.cds-aichat-toolbar__actions-container > button',
    );
    assert.true(
      visibleButtons.length < actions.length,
      'fewer than all actions render as visible buttons',
    );
  });

  test('@overflow renders the current @actions after they change (no stale measurement)', async function (assert) {
    const calls: string[] = [];
    const state = trackedObject({
      actions: [
        { text: 'Add', icon: Add, onClick: () => calls.push('old') },
      ] as ToolbarAction[],
    });

    await render(
      <template>
        <Toolbar @overflow={{true}} @actions={{state.actions}} />
      </template>,
    );

    // Let the ResizeObserver fire and the deferred measurement run.
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await settled();

    // Same number of actions, so the overflow split doesn't change.
    state.actions = [
      { text: 'Add', icon: Add, onClick: () => calls.push('new') },
    ];
    await settled();

    await click('.cds-aichat-toolbar__actions-container button');
    assert.deepEqual(calls, ['new'], 'the current action handler runs');
  });

  test('a fixedActions block renders after the action list', async function (assert) {
    await render(
      <template>
        <Toolbar @actions={{noActions}}>
          <:fixedActions><button
              type="button"
              class="fixed-btn"
            >Pinned</button></:fixedActions>
        </Toolbar>
      </template>,
    );

    assert.dom('.cds-aichat-toolbar__fixed-actions .fixed-btn').exists();
  });

  test('an href action renders as a link', async function (assert) {
    const actions = [
      { text: 'Docs', icon: Add, href: 'https://example.com/docs' },
    ];

    await render(<template><Toolbar @actions={{actions}} /></template>);

    assert
      .dom('.cds-aichat-toolbar__actions-container a')
      .hasAttribute('href', 'https://example.com/docs');
    assert
      .dom('.cds-aichat-toolbar__actions-container a')
      .doesNotHaveAttribute('aria-disabled');
  });

  test('a disabled href action strips href and is not navigable', async function (assert) {
    const actions = [
      {
        text: 'Docs',
        icon: Add,
        href: 'https://example.com/docs',
        disabled: true,
      },
    ];

    await render(<template><Toolbar @actions={{actions}} /></template>);

    const link = document.querySelector(
      '.cds-aichat-toolbar__actions-container a',
    );
    assert.dom(link).hasClass('cds--btn--disabled');
    assert.dom(link).doesNotHaveAttribute('href');
    assert.dom(link).hasAttribute('role', 'link');
    assert.dom(link).hasAttribute('aria-disabled', 'true');

    // Safe to click: href was stripped above, so there's nothing to navigate to.
    await click(link as HTMLElement);
  });

  test('without @overflow, actions render in their given order even when a @fixed action is not listed first', async function (assert) {
    const actions = [
      { text: 'Extra', icon: Add, onClick: () => {}, testId: 'extra' },
      {
        text: 'Pinned',
        icon: Settings,
        onClick: () => {},
        fixed: true,
        testId: 'pinned',
      },
    ];

    await render(<template><Toolbar @actions={{actions}} /></template>);

    const testIds = [
      ...document.querySelectorAll(
        '.cds-aichat-toolbar__actions-container button',
      ),
    ].map((el) => el.getAttribute('data-testid'));
    assert.deepEqual(
      testIds,
      ['extra', 'pinned'],
      'actions render in raw array order, not fixed-first',
    );
  });

  test('@fixed actions never collapse into the overflow menu, even when they do not all fit', async function (assert) {
    const actions = [
      {
        text: 'Pinned 1',
        icon: Add,
        onClick: () => {},
        fixed: true,
        testId: 'pinned-1',
      },
      {
        text: 'Pinned 2',
        icon: Settings,
        onClick: () => {},
        fixed: true,
        testId: 'pinned-2',
      },
      { text: 'Extra 1', icon: Add, onClick: () => {}, testId: 'extra-1' },
      { text: 'Extra 2', icon: Settings, onClick: () => {}, testId: 'extra-2' },
    ];

    await render(
      <template>
        <div {{style maxInlineSize="60px"}}>
          <Toolbar @overflow={{true}} @actions={{actions}} />
        </div>
      </template>,
    );

    await waitUntil(() => find('.cds-aichat-toolbar .cds--overflow-menu'));

    assert
      .dom('.cds-aichat-toolbar__actions-container [data-testid="pinned-1"]')
      .exists();
    assert
      .dom('.cds-aichat-toolbar__actions-container [data-testid="pinned-2"]')
      .exists();
  });
});

module(
  'Integration | Component | ai-chat/Toolbar > with routes',
  function (hooks) {
    setupApplicationTest(hooks);
    setupRoutes(hooks);

    test('a route action links to its route, unless it is disabled', async function (assert) {
      const actions = [
        { text: 'Settings', icon: Settings, route: 'settings', testId: 'on' },
        {
          text: 'User',
          icon: Add,
          route: 'user',
          models: [7],
          disabled: true,
          testId: 'off',
        },
      ];

      await visitWith(
        this,
        <template><Toolbar @actions={{actions}} /></template>,
      );

      assert
        .dom('.cds-aichat-toolbar__actions-container [data-testid="off"]')
        .doesNotHaveAttribute('href')
        .hasAttribute('aria-disabled', 'true');
      await click('.cds-aichat-toolbar__actions-container [data-testid="on"]');
      const router = this.owner.lookup('service:router');
      assert.strictEqual(router.currentRouteName, 'settings');
    });

    test('a route action in the overflow menu links to its route', async function (assert) {
      const actions = [
        { text: 'Add', icon: Add, onClick: () => {} },
        { text: 'Add 2', icon: Add, onClick: () => {} },
        { text: 'Settings', icon: Settings, route: 'settings' },
        { text: 'User', icon: Settings, route: 'user', models: [7] },
      ];

      await visitWith(
        this,
        <template>
          <div {{style maxInlineSize="80px"}}>
            <Toolbar @overflow={{true}} @actions={{actions}} />
          </div>
        </template>,
      );
      await waitUntil(() => find('.cds-aichat-toolbar .cds--overflow-menu'));
      await click('.cds-aichat-toolbar .cds--overflow-menu');

      assert
        .dom('a.cds--overflow-menu-options__btn[href="/users/7"]')
        .hasText('User');
      await click('a.cds--overflow-menu-options__btn[href="/users/7"]');
      const router = this.owner.lookup('service:router');
      assert.strictEqual(router.currentURL, '/users/7');
    });
  },
);
