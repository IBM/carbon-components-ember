import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import ChatShell from 'carbon-components-ember/components/ai-chat/chat-shell';

module('Integration | Component | ai-chat/ChatShell', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders only the blocks the caller passed', async function (assert) {
    await render(
      <template>
        <ChatShell>
          <:messages>the conversation</:messages>
          <:input>the input</:input>
        </ChatShell>
      </template>,
    );

    assert.dom('[data-panel-slot="messages"]').hasText('the conversation');
    assert.dom('[data-panel-slot="input"]').hasText('the input');
    assert.dom('[data-panel-slot="header"]').doesNotExist();
    assert.dom('[data-panel-slot="footer"]').doesNotExist();
    assert.dom('[data-panel-slot="input-before"]').doesNotExist();
    assert.dom('[data-panel-slot="input-after"]').doesNotExist();
  });

  test('it renders header and header-after blocks', async function (assert) {
    await render(
      <template>
        <ChatShell>
          <:header>my header</:header>
          <:headerAfter>after header</:headerAfter>
          <:messages></:messages>
        </ChatShell>
      </template>,
    );

    assert.dom('[data-panel-slot="header"]').hasText('my header');
    assert.dom('[data-panel-slot="header-after"]').hasText('after header');
  });

  test('the history block does not render by default', async function (assert) {
    await render(
      <template>
        <ChatShell>
          <:history>history content</:history>
          <:messages></:messages>
        </ChatShell>
      </template>,
    );

    assert.dom('[data-panel-slot="history"]').doesNotExist();
  });

  test('the history block renders when @showHistory is true', async function (assert) {
    await render(
      <template>
        <ChatShell @showHistory={{true}}>
          <:history>history content</:history>
          <:messages></:messages>
        </ChatShell>
      </template>,
    );

    assert.dom('[data-panel-slot="history"]').hasText('history content');
    assert.dom('.cds-aichat-shell').hasAttribute('history-location', 'start');
    assert.dom('.cds-aichat-shell').hasClass('show-history');
  });

  test('the workspace block does not render by default', async function (assert) {
    await render(
      <template>
        <ChatShell>
          <:workspace>workspace content</:workspace>
          <:messages></:messages>
        </ChatShell>
      </template>,
    );

    assert.dom('[data-panel-slot="messages"]').exists();
    assert.dom('.cds-aichat-shell__workspace').doesNotExist();
  });

  test('the workspace block renders when @showWorkspace is true', async function (assert) {
    await render(
      <template>
        <ChatShell @showWorkspace={{true}} @workspaceLocation='end'>
          <:workspace>workspace content</:workspace>
          <:messages></:messages>
        </ChatShell>
      </template>,
    );

    assert.dom('.cds-aichat-shell__workspace').hasText('workspace content');
    assert.dom('.cds-aichat-shell').hasAttribute('workspace-location', 'end');
  });

  test('it applies aiEnabled/showFrame/rounded modifier classes', async function (assert) {
    await render(
      <template>
        <ChatShell @aiEnabled={{true}} @showFrame={{true}} @cornerAll='round'>
          <:messages></:messages>
        </ChatShell>
      </template>,
    );

    assert.dom('.cds-aichat-shell').hasClass('ai-theme');
    assert.dom('.cds-aichat-shell').hasClass('rounded');
    assert.dom('.cds-aichat-shell').doesNotHaveClass('frameless');
  });

  test('it defaults to frameless and square corners', async function (assert) {
    await render(
      <template>
        <ChatShell>
          <:messages></:messages>
        </ChatShell>
      </template>,
    );

    assert.dom('.cds-aichat-shell').hasClass('frameless');
    assert.dom('.cds-aichat-shell').doesNotHaveClass('rounded');
  });

  test('it uses the aria-label args for the region roles', async function (assert) {
    await render(
      <template>
        <ChatShell
          @showHistory={{true}}
          @historyAriaLabel='Custom history'
          @messagesAriaLabel='Custom messages'
        >
          <:history></:history>
          <:messages></:messages>
        </ChatShell>
      </template>,
    );

    assert.dom('[role="region"][aria-label="Custom history"]').exists();
    assert.dom('[role="region"][aria-label="Custom messages"]').exists();
  });

  test('it applies the messages-max-width class to input slots when @contentMaxWidth is true', async function (assert) {
    await render(
      <template>
        <ChatShell @contentMaxWidth={{true}}>
          <:messages></:messages>
          <:input>the input</:input>
        </ChatShell>
      </template>,
    );

    assert.dom('[data-panel-slot="input"]').hasClass('messages-max-width');
  });

  test('the panels block renders arbitrary caller content', async function (assert) {
    await render(
      <template>
        <ChatShell>
          <:messages></:messages>
          <:panels><div data-test-custom-panel>a panel</div></:panels>
        </ChatShell>
      </template>,
    );

    assert.dom('[data-test-custom-panel]').hasText('a panel');
  });
});
