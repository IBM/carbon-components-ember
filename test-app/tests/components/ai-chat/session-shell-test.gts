import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, triggerKeyEvent, settled, clearRender } from '@ember/test-helpers';
import Component from '@glimmer/component';
import { registerDestructor } from '@ember/destroyable';
import { service } from '@ember/service';
import type Owner from '@ember/owner';
import SessionShell from 'carbon-components-ember/components/ai-chat/session-shell';
import type ChatSessionService from 'carbon-components-ember/services/ai-chat-session';

module('Integration | Component | ai-chat/SessionShell', (hooks) => {
  setupRenderingTest(hooks);

  function session(context: { owner: { lookup: (name: string) => unknown } }) {
    return context.owner.lookup('service:carbon.ai-chat-session') as ChatSessionService;
  }

  test('renders the Launcher while closed, and ChatShell once opened', async function (assert) {
    await render(<template><SessionShell @closedLabel='Open chat' /></template>);

    assert.dom('.cds-aichat-launcher').exists();
    assert.dom('.cds-aichat-shell').doesNotExist();

    await click('.cds-aichat-launcher__button');

    assert.dom('.cds-aichat-launcher').doesNotExist();
    assert.dom('.cds-aichat-shell').exists();
    assert.true(session(this).open);
  });

  test('the shell close button toggles back to the launcher', async function (assert) {
    session(this).open = true;
    await render(<template><SessionShell /></template>);

    await click('[aria-label="Close chat"]');

    assert.dom('.cds-aichat-launcher').exists();
    assert.false(session(this).open);
  });

  test('typing and pressing Enter sends a message through the service and clears the draft', async function (assert) {
    session(this).open = true;
    await render(<template><SessionShell /></template>);

    await fillIn('.cds-aichat-prompt-line__field', 'hello there');
    await triggerKeyEvent('.cds-aichat-prompt-line__field', 'keydown', 'Enter');

    assert.dom('.cds-aichat-session-shell__message--user').hasText('hello there');
    assert.strictEqual(session(this).draft, '');
  });

  test('the send button in the shell sends the current draft', async function (assert) {
    const svc = session(this);
    svc.open = true;
    await render(<template><SessionShell /></template>);

    await fillIn('.cds-aichat-prompt-line__field', 'via button');
    await click('[aria-label="Send"]');

    assert.dom('.cds-aichat-session-shell__message--user').hasText('via button');
  });

  test('a streaming assistant message shows the Processing indicator until finalized', async function (assert) {
    const svc = session(this);
    svc.open = true;
    await render(<template><SessionShell /></template>);

    const message = svc.receive('', { streaming: true });
    await settled();

    assert.dom('.cds-aichat-processing').exists();

    svc.finalizeStreaming(message.id);
    await settled();

    assert.dom('.cds-aichat-processing').doesNotExist();
  });

  test('@messagesAriaLabel and @aiEnabled are forwarded to ChatShell', async function (assert) {
    session(this).open = true;
    await render(
      <template><SessionShell @messagesAriaLabel='Conversation' @aiEnabled={{true}} /></template>,
    );

    assert.dom('[aria-label="Conversation"]').exists();
    assert.dom('.cds-aichat-shell.ai-theme').exists();
  });

  test('@showHistory and @showWorkspace are forwarded to ChatShell', async function (assert) {
    const svc = session(this);
    svc.open = true;
    svc.showHistory = true;
    svc.showWorkspace = true;
    await render(<template><SessionShell /></template>);

    assert.dom('.cds-aichat-shell.show-history').exists();
    assert.dom('.cds-aichat-shell.show-workspace').exists();
  });

  test('isReadonly disables the send button and prevents sending', async function (assert) {
    const svc = session(this);
    svc.open = true;
    svc.isReadonly = true;
    await render(<template><SessionShell /></template>);

    assert.dom('[aria-label="Send"]').isDisabled();
  });

  test('a host component following the docs demo pattern (restart() + registerDestructor cleanup) does not leak a send listener across a remount', async function (assert) {
    // Mirrors session-shell.gjs.md's SessionShellDemo: seed via restart() so
    // a remount is idempotent, and unregister the 'send' listener on
    // teardown via registerDestructor, since carbon.ai-chat-session is an
    // app-wide singleton and on()/off() are manual by design.
    let replyCount = 0;

    class Host extends Component {
      @service('carbon.ai-chat-session') declare session: ChatSessionService;

      constructor(owner: Owner, args: object) {
        super(owner, args);
        this.session.restart();
        this.session.on('send', this.reply);
        registerDestructor(this, () => this.session.off('send', this.reply));
      }

      reply = () => {
        replyCount += 1;
      };

      <template><SessionShell /></template>
    }

    await render(<template><Host /></template>);
    session(this).open = true;
    await settled();

    await fillIn('.cds-aichat-prompt-line__field', 'first mount');
    await triggerKeyEvent('.cds-aichat-prompt-line__field', 'keydown', 'Enter');
    assert.strictEqual(replyCount, 1, 'listener fires once for the first mount');

    await clearRender();
    await render(<template><Host /></template>);
    session(this).open = true;
    await settled();

    await fillIn('.cds-aichat-prompt-line__field', 'second mount');
    await triggerKeyEvent('.cds-aichat-prompt-line__field', 'keydown', 'Enter');
    assert.strictEqual(
      replyCount,
      2,
      'listener still fires exactly once per send after a remount - not twice from a leaked first-mount listener',
    );
  });
});
