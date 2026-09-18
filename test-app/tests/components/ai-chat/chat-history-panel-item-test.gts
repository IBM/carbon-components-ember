import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, settled, waitUntil, find } from '@ember/test-helpers';
import { array, hash } from '@ember/helper';
import { cell } from 'ember-resources';
import ChatHistoryPanelItem from 'carbon-components-ember/components/ai-chat/chat-history-panel-item';
import { Delete } from 'carbon-components-ember/icons';

module('Integration | Component | ai-chat/ChatHistoryPanelItem', (hooks) => {
  setupRenderingTest(hooks);

  test('renders the name and calls @onSelect with itemId/itemName on click', async function (assert) {
    const calls: Array<{ itemId?: string; itemName?: string }> = [];
    const onSelect = (detail: { itemId?: string; itemName?: string }) => calls.push(detail);

    await render(
      <template><ChatHistoryPanelItem @id='chat-1' @name='My chat' @onSelect={{onSelect}} /></template>,
    );

    assert.dom('.cds--side-nav__link-text').hasText('My chat');

    await click('.cds--side-nav__link');
    assert.deepEqual(calls, [{ itemId: 'chat-1', itemName: 'My chat' }]);
  });

  test('@selected adds the current-link class', async function (assert) {
    await render(<template><ChatHistoryPanelItem @name='My chat' @selected={{true}} /></template>);

    assert.dom('.cds--side-nav__link').hasClass('cds--side-nav__link--current');
  });

  test('@rename swaps the row for a ChatHistoryPanelItemInput', async function (assert) {
    await render(<template><ChatHistoryPanelItem @name='My chat' @rename={{true}} /></template>);

    assert.dom('.cds--side-nav__link').doesNotExist();
    assert.dom('.cds-aichat-history-panel-item-input').exists();
    assert.dom('.cds-aichat-history-panel-item-input input').hasValue('My chat');
  });

  test('canceling a rename exits rename mode locally and calls @onRenameCancel', async function (assert) {
    let cancelCalls = 0;
    const onRenameCancel = () => cancelCalls++;

    await render(
      <template>
        <ChatHistoryPanelItem @name='My chat' @rename={{true}} @onRenameCancel={{onRenameCancel}} />
      </template>,
    );

    await click('.cds-aichat-history-panel-item-input__cancel');
    assert.dom('.cds-aichat-history-panel-item-input').doesNotExist('rename mode exits on its own');
    assert.dom('.cds--side-nav__link').exists();
    assert.strictEqual(cancelCalls, 1);
  });

  test('saving a rename (after changing the value) exits rename mode locally and calls @onRenameSave', async function (assert) {
    const saveCalls: string[] = [];
    const onSave = (value: string) => saveCalls.push(value);

    await render(
      <template><ChatHistoryPanelItem @name='My chat' @rename={{true}} @onRenameSave={{onSave}} /></template>,
    );

    await fillIn('.cds-aichat-history-panel-item-input input', 'New name');
    await click('.cds-aichat-history-panel-item-input__save');
    assert.dom('.cds-aichat-history-panel-item-input').doesNotExist('rename mode exits on its own');
    assert.dom('.cds--side-nav__link').exists();
    assert.deepEqual(saveCalls, ['New name']);
  });

  test('a falling edge on @rename (e.g. the host switched to renaming a different item) closes this item\'s rename UI too', async function (assert) {
    const rename = cell(true);

    await render(<template><ChatHistoryPanelItem @name='My chat' @rename={{rename.current}} /></template>);
    assert.dom('.cds-aichat-history-panel-item-input').exists('rename mode starts open per @rename');

    rename.current = false;
    await settled();
    assert
      .dom('.cds-aichat-history-panel-item-input')
      .doesNotExist('rename mode closes once @rename flips back to false');
    assert.dom('.cds--side-nav__link').exists();
  });

  test('renders one overflow-menu action per entry in @actions, and calls @onMenuAction with the clicked action', async function (assert) {
    const calls: Array<{ action?: string; itemId?: string; itemName?: string }> = [];
    const onMenuAction = (detail: { action?: string; itemId?: string; itemName?: string }) =>
      calls.push(detail);

    await render(
      <template>
        <ChatHistoryPanelItem
          @id='chat-1'
          @name='My chat'
          @actions={{array (hash text='Rename') (hash text='Delete' icon=Delete delete=true)}}
          @onMenuAction={{onMenuAction}}
        />
      </template>,
    );

    await click('.cds--overflow-menu');
    assert.dom('.cds--overflow-menu-options__option').exists({ count: 2 });
    assert.dom('.cds--overflow-menu-options__option--danger').exists({ count: 1 });

    // The action's icon SVG loads asynchronously (see icon components'
    // TrackedPromise-backed `svg` getter) - `settled()` after `click()`
    // doesn't reliably wait for it since the import resolves outside
    // Ember's run loop, so wait for it explicitly before asserting.
    await waitUntil(
      () =>
        find(
          '.cds--overflow-menu-options__option:last-child .cds--overflow-menu-options__option-icon svg',
        ),
      { timeout: 5000 },
    );

    // The action's icon renders as its own `.option-icon` sibling of the
    // text `.option-content`, not nested inside it - `.cds--overflow-menu-
    // options__btn`'s `justify-content: space-between` then pushes it flush
    // right, matching upstream's `cds-overflow-menu-item` layout.
    assert
      .dom('.cds--overflow-menu-options__option:last-child .cds--overflow-menu-options__option-icon svg')
      .exists();
    assert
      .dom('.cds--overflow-menu-options__option:last-child .cds--overflow-menu-options__option-content svg')
      .doesNotExist();
    // "Rename" passes no `icon`, so its `.option-icon` wrapper (always
    // present once ChatHistoryPanelItem's own `{{#if menuAction.icon}}`
    // block is yielded to OverflowMenuItem at all, regardless of whether
    // that inner `{{#if}}` ends up rendering anything) stays empty rather
    // than being absent - `{{has-block}}` reflects whether a block was
    // syntactically passed to the invocation, not whether it renders any
    // content.
    assert
      .dom('.cds--overflow-menu-options__option:first-child .cds--overflow-menu-options__option-icon')
      .hasText('');

    await click('.cds--overflow-menu-options__option:last-child button');
    assert.deepEqual(calls, [{ action: 'Delete', itemId: 'chat-1', itemName: 'My chat' }]);
  });

  test('the overflow menu requests right-alignment, so it opens toward the panel interior instead of growing past its right edge', async function (assert) {
    // The trigger sits flush against the right edge of a history panel
    // that's usually much narrower than the browser viewport - `Overflow
    // Menu`'s underlying `ember-basic-dropdown` `horizontalPosition='auto'`
    // default would pick `'left'` (the menu already fits the *viewport*
    // from there), letting it grow rightward out of the panel. `Chat
    // HistoryPanelItem` passes `@horizontalPosition='right'` so the menu
    // opens toward the panel's interior (leftward from the trigger)
    // instead. Asserted via the resulting `ember-basic-dropdown-content--
    // right` state class rather than measured pixel positions - the actual
    // pixel math is `ember-basic-dropdown`'s own well-tested concern, and
    // is sensitive to the QUnit test harness's own container/coordinate
    // setup in a way unrelated to this component.
    await render(
      <template>
        <ChatHistoryPanelItem
          @id='chat-1'
          @name='My chat'
          @actions={{array (hash text='Rename') (hash text='Delete' delete=true)}}
        />
      </template>,
    );

    await click('.cds--overflow-menu');

    assert
      .dom(document.querySelector('.cds--overflow-menu-options')!.closest('.ember-basic-dropdown-content'))
      .hasClass('ember-basic-dropdown-content--right');
  });

  test('the overflow menu is hidden by default and shown via @showActions', async function (assert) {
    await render(<template><ChatHistoryPanelItem @name='My chat' /></template>);
    assert
      .dom('.cds-aichat-history-panel-item__actions')
      .doesNotHaveClass('cds-aichat-history-panel-item__actions--always-show');

    await render(<template><ChatHistoryPanelItem @name='My chat' @showActions={{true}} /></template>);
    assert
      .dom('.cds-aichat-history-panel-item__actions')
      .hasClass('cds-aichat-history-panel-item__actions--always-show');
  });
});
