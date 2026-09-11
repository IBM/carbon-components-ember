import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import { waitForAnimationFrame } from '../../helpers';
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

  test('the input-and-messages column shrinks instead of overflowing the shell when @showHistory is true on a narrow container', async function (assert) {
    // `.cds-aichat-shell__history` (320px) and the default
    // `min-inline-size` floor on `.cds-aichat-shell__input-and-messages`
    // (also 320px) together need more width than this 480px shell has -
    // without the `show-history` override in `_chat-shell.scss`, the
    // messages column overflows the shell's own right edge instead of
    // shrinking. That override only comes from real `@carbon/styles` CSS,
    // which test-app's dev-mode build doesn't reliably load for a
    // component under test - inject it directly so this test exercises
    // real layout instead of the browser's static default.
    await render(
      <template>
        <style>{{carbonStyle.default}}</style>
        <div style='inline-size: 480px'>
          <ChatShell @showHistory={{true}}>
            <:history>history content</:history>
            <:messages></:messages>
            <:input>the input</:input>
          </ChatShell>
        </div>
      </template>,
    );
    await waitForAnimationFrame();

    const shellRect = document
      .querySelector('.cds-aichat-shell')!
      .getBoundingClientRect();
    const inputRect = document
      .querySelector('[data-panel-slot="input"]')!
      .getBoundingClientRect();

    assert.ok(
      inputRect.right <= shellRect.right + 1,
      `input column right edge (${inputRect.right}) stays within the shell's right edge (${shellRect.right})`,
    );
  });
});
