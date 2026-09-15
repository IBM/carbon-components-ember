import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import ChatHistoryContent from 'carbon-components-ember/components/ai-chat/chat-history-content';

module('Integration | Component | ai-chat/ChatHistoryContent', (hooks) => {
  setupRenderingTest(hooks);

  test('hides the results count when @resultsCount is not passed', async function (assert) {
    await render(
      <template>
        <ChatHistoryContent>
          <p>list</p>
        </ChatHistoryContent>
      </template>,
    );

    assert.dom('.cds-aichat-history-content__results-count').doesNotExist();
    assert.dom('.cds-aichat-history-content').containsText('list');
  });

  test('shows "@resultsLabel: @resultsCount" when a count is passed', async function (assert) {
    await render(<template><ChatHistoryContent @resultsCount={{5}} /></template>);

    assert.dom('.cds-aichat-history-content__results-count').hasText('Results: 5');
  });

  test('@resultsLabel overrides the default label', async function (assert) {
    await render(
      <template><ChatHistoryContent @resultsLabel='Matches' @resultsCount={{3}} /></template>,
    );

    assert.dom('.cds-aichat-history-content__results-count').hasText('Matches: 3');
  });

  test('a resultsCount of 0 still displays (not treated as falsy)', async function (assert) {
    await render(<template><ChatHistoryContent @resultsCount={{0}} /></template>);

    assert.dom('.cds-aichat-history-content__results-count').hasText('Results: 0');
  });
});
