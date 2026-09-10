import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import PromptLineShell from 'carbon-components-ember/components/ai-chat/prompt-line-shell';

module('Integration | Component | ai-chat/PromptLineShell', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders each named block in its own region', async function (assert) {
    await render(
      <template>
        <PromptLineShell>
          <:editor><textarea class='my-editor'></textarea></:editor>
          <:messageActions><button type='button' class='my-action'>Action</button></:messageActions>
          <:sendControl><button type='button' class='my-send'>Send</button></:sendControl>
        </PromptLineShell>
      </template>,
    );

    assert.dom('.cds-aichat-prompt-line-shell__text-area .my-editor').exists();
    assert.dom('.cds-aichat-prompt-line-shell__message-actions .my-action').exists();
    assert.dom('.cds-aichat-prompt-line-shell__send-control .my-send').exists();
  });

  test('the --has-message-actions modifier only applies when the block is actually passed', async function (assert) {
    await render(<template><PromptLineShell /></template>);
    assert
      .dom('.cds-aichat-prompt-line-shell__input-container')
      .doesNotHaveClass('cds-aichat-prompt-line-shell__input-container--has-message-actions');
  });

  test('@expanded renders the editor before the message actions', async function (assert) {
    await render(
      <template>
        <PromptLineShell @expanded={{true}}>
          <:editor><span class='marker'>editor</span></:editor>
          <:messageActions><span class='marker'>actions</span></:messageActions>
        </PromptLineShell>
      </template>,
    );

    const markers = document.querySelectorAll(
      '.cds-aichat-prompt-line-shell__text-and-actions .marker',
    );
    assert.strictEqual(markers[0]?.textContent, 'editor');
    assert.strictEqual(markers[1]?.textContent, 'actions');
    assert
      .dom('.cds-aichat-prompt-line-shell__input-container')
      .hasClass('cds-aichat-prompt-line-shell__input-container--expanded');
  });

  test('@rounded, @hasError, and @disabled reflect to modifier classes', async function (assert) {
    await render(
      <template>
        <PromptLineShell @rounded={{true}} @hasError={{true}} @disabled={{true}} />
      </template>,
    );

    assert.dom('.cds-aichat-prompt-line-shell').hasClass('cds-aichat-prompt-line-shell--rounded');
    assert.dom('.cds-aichat-prompt-line-shell').hasClass('cds-aichat-prompt-line-shell--has-error');
    assert.dom('.cds-aichat-prompt-line-shell').hasClass('cds-aichat-prompt-line-shell--disabled');
  });
});
