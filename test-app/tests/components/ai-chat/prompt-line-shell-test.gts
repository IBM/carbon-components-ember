import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
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

  test('@expanded reflows via a container class, not by reordering the DOM', async function (assert) {
    await render(
      <template>
        <PromptLineShell @expanded={{true}}>
          <:editor><span class='marker'>editor</span></:editor>
          <:messageActions><span class='marker'>actions</span></:messageActions>
        </PromptLineShell>
      </template>,
    );

    // The visual reflow (editor above, actions below) is driven entirely by
    // CSS `order` on the always-fixed DOM below, not by swapping markup —
    // see _prompt-line.scss's `--expanded` `order` rules.
    const markers = document.querySelectorAll(
      '.cds-aichat-prompt-line-shell__text-and-actions .marker',
    );
    assert.strictEqual(markers[0]?.textContent, 'actions');
    assert.strictEqual(markers[1]?.textContent, 'editor');
    assert
      .dom('.cds-aichat-prompt-line-shell__input-container')
      .hasClass('cds-aichat-prompt-line-shell__input-container--expanded');
  });

  test('toggling @expanded after initial render does not destroy/recreate the yielded editor', async function (assert) {
    class State {
      @tracked expanded = false;
    }
    const state = new State();

    class Host extends Component {
      state = state;
      <template>
        <PromptLineShell @expanded={{this.state.expanded}}>
          <:editor><textarea class='my-editor'></textarea></:editor>
          <:messageActions><button type='button' class='my-action'>Action</button></:messageActions>
        </PromptLineShell>
      </template>
    }

    await render(<template><Host /></template>);

    const editorBefore = document.querySelector('.my-editor');
    const actionBefore = document.querySelector('.my-action');
    assert.ok(editorBefore, 'precondition: editor rendered');

    state.expanded = true;
    await settled();

    assert.strictEqual(
      document.querySelector('.my-editor'),
      editorBefore,
      'the same editor DOM node survives an @expanded toggle',
    );
    assert.strictEqual(
      document.querySelector('.my-action'),
      actionBefore,
      'the same message-actions DOM node survives an @expanded toggle',
    );
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
