import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import { hash } from '@ember/helper';
import ChatHistoryToolbar from 'carbon-components-ember/components/ai-chat/chat-history-toolbar';

module('Integration | Component | ai-chat/ChatHistoryToolbar', (hooks) => {
  setupRenderingTest(hooks);

  test('renders a search field and a new-chat button by default', async function (assert) {
    await render(<template><ChatHistoryToolbar /></template>);

    assert.dom('.cds-aichat-history-toolbar__search').exists();
    assert.dom('.cds-aichat-history-toolbar__new-chat').exists();
  });

  test('@searchOff hides the search field', async function (assert) {
    await render(<template><ChatHistoryToolbar @searchOff={{true}} /></template>);

    assert.dom('.cds-aichat-history-toolbar__search').doesNotExist();
    assert.dom('.cds-aichat-history-toolbar__new-chat').exists();
  });

  test('typing in the search field calls @onSearch with the value', async function (assert) {
    const calls: string[] = [];
    const onSearch = (value: string) => calls.push(value);

    await render(<template><ChatHistoryToolbar @onSearch={{onSearch}} /></template>);

    await fillIn('.cds-aichat-history-toolbar__search input', 'today');
    assert.deepEqual(calls, ['today']);
  });

  test('clicking the search field\'s clear button calls @onSearchClear', async function (assert) {
    let clearCalls = 0;
    const onSearchClear = () => clearCalls++;

    await render(<template><ChatHistoryToolbar @onSearchClear={{onSearchClear}} /></template>);

    await fillIn('.cds-aichat-history-toolbar__search input', 'today');
    await click('.cds-aichat-history-toolbar__search .cds--search-close');

    assert.strictEqual(clearCalls, 1);
    assert.dom('.cds-aichat-history-toolbar__search input').hasValue('');
  });

  test('clicking the new-chat button calls @onNewChat', async function (assert) {
    let calls = 0;
    const onNewChat = () => calls++;

    await render(<template><ChatHistoryToolbar @onNewChat={{onNewChat}} /></template>);

    await click('.cds-aichat-history-toolbar__new-chat');
    assert.strictEqual(calls, 1);
  });

  test('@searchAttributes seeds the search field', async function (assert) {
    await render(
      <template>
        <ChatHistoryToolbar
          @searchAttributes={{hash placeholder='Search chats' value='hi'}}
        />
      </template>,
    );

    assert.dom('.cds-aichat-history-toolbar__search input').hasAttribute('placeholder', 'Search chats');
    assert.dom('.cds-aichat-history-toolbar__search input').hasValue('hi');
  });
});
