import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitUntil, find } from '@ember/test-helpers';
import Toolbar, { type ToolbarAction } from 'carbon-components-ember/components/ai-chat/toolbar';
import { Add, Settings } from 'carbon-components-ember/icons';

const noActions: ToolbarAction[] = [];

module('Integration | Component | ai-chat/Toolbar', (hooks) => {
  setupRenderingTest(hooks);

  test('renders @titleText/@nameText and all actions when @overflow is not set', async function (assert) {
    let clicks = 0;
    const actions = [
      { text: 'Add', icon: Add, onClick: () => clicks++ },
      { text: 'Settings', icon: Settings, onClick: () => clicks++ },
    ];

    await render(<template><Toolbar @titleText='My' @nameText='Toolbar' @actions={{actions}} /></template>);

    assert.dom('.cds-aichat-toolbar__title').hasText('My Toolbar');
    assert.dom('.cds-aichat-toolbar__actions-container button').exists({ count: 2 });
    assert.dom('.cds-aichat-toolbar .cds--overflow-menu').doesNotExist();

    await click('.cds-aichat-toolbar__actions-container button');
    assert.strictEqual(clicks, 1);
  });

  test('a navigation block renders in the leading area', async function (assert) {
    await render(
      <template>
        <Toolbar @actions={{noActions}}>
          <:navigation><button type='button' class='nav-btn'>Back</button></:navigation>
        </Toolbar>
      </template>,
    );

    assert.dom('.cds-aichat-toolbar__navigation .nav-btn').exists();
  });

  test('a title block overrides @titleText', async function (assert) {
    await render(
      <template>
        <Toolbar @titleText='Ignored' @actions={{noActions}}>
          <:title><span class='custom-title'>Custom</span></:title>
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

    // The addon's own SCSS (`_toolbar.scss`, not part of `@carbon/styles`'
    // prebuilt bundle) isn't reliably loaded by test-app's dev build - see
    // the truncated-text-test.gts precedent for the same gotcha. Without
    // it, `.cds-aichat-toolbar__measure` renders as a normal, space-taking
    // flex row instead of `position: absolute`, which both defeats the
    // measurement and can make the container's own size (and so the
    // ResizeObserver driving this test) thrash.
    await render(
      <template>
        <style>.cds-aichat-toolbar__measure { position: absolute; visibility: hidden; pointer-events: none; }</style>
        <div style='max-inline-size: 80px;'>
          <Toolbar @overflow={{true}} @actions={{actions}} />
        </div>
      </template>,
    );

    await waitUntil(() => find('.cds-aichat-toolbar .cds--overflow-menu'));

    assert.dom('.cds-aichat-toolbar .cds--overflow-menu').exists();
    const visibleButtons = document.querySelectorAll('.cds-aichat-toolbar__actions-container > button');
    assert.true(visibleButtons.length < actions.length, 'fewer than all actions render as visible buttons');
  });

  test('a fixedActions block renders after the action list', async function (assert) {
    await render(
      <template>
        <Toolbar @actions={{noActions}}>
          <:fixedActions><button type='button' class='fixed-btn'>Pinned</button></:fixedActions>
        </Toolbar>
      </template>,
    );

    assert.dom('.cds-aichat-toolbar__fixed-actions .fixed-btn').exists();
  });

  test('an href action renders as a link', async function (assert) {
    const actions = [{ text: 'Docs', icon: Add, href: 'https://example.com/docs' }];

    await render(<template><Toolbar @actions={{actions}} /></template>);

    assert.dom('.cds-aichat-toolbar__actions-container a').hasAttribute('href', 'https://example.com/docs');
    assert.dom('.cds-aichat-toolbar__actions-container a').doesNotHaveAttribute('aria-disabled');
  });

  test('a disabled href action strips href and is not navigable', async function (assert) {
    const actions = [{ text: 'Docs', icon: Add, href: 'https://example.com/docs', disabled: true }];

    await render(<template><Toolbar @actions={{actions}} /></template>);

    const link = document.querySelector('.cds-aichat-toolbar__actions-container a');
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
      { text: 'Pinned', icon: Settings, onClick: () => {}, fixed: true, testId: 'pinned' },
    ];

    await render(<template><Toolbar @actions={{actions}} /></template>);

    const testIds = [...document.querySelectorAll('.cds-aichat-toolbar__actions-container button')].map((el) =>
      el.getAttribute('data-testid'),
    );
    assert.deepEqual(testIds, ['extra', 'pinned'], 'actions render in raw array order, not fixed-first');
  });

  test('@fixed actions never collapse into the overflow menu, even when they do not all fit', async function (assert) {
    const actions = [
      { text: 'Pinned 1', icon: Add, onClick: () => {}, fixed: true, testId: 'pinned-1' },
      { text: 'Pinned 2', icon: Settings, onClick: () => {}, fixed: true, testId: 'pinned-2' },
      { text: 'Extra 1', icon: Add, onClick: () => {}, testId: 'extra-1' },
      { text: 'Extra 2', icon: Settings, onClick: () => {}, testId: 'extra-2' },
    ];

    await render(
      <template>
        <style>.cds-aichat-toolbar__measure { position: absolute; visibility: hidden; pointer-events: none; }</style>
        <div style='max-inline-size: 60px;'>
          <Toolbar @overflow={{true}} @actions={{actions}} />
        </div>
      </template>,
    );

    await waitUntil(() => find('.cds-aichat-toolbar .cds--overflow-menu'));

    assert.dom('.cds-aichat-toolbar__actions-container [data-testid="pinned-1"]').exists();
    assert.dom('.cds-aichat-toolbar__actions-container [data-testid="pinned-2"]').exists();
  });
});
