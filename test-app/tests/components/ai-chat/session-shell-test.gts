import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, triggerKeyEvent, settled, clearRender } from '@ember/test-helpers';
import Component from '@glimmer/component';
import { registerDestructor } from '@ember/destroyable';
import { service } from '@ember/service';
import { array, hash } from '@ember/helper';
import type Owner from '@ember/owner';
import SessionShell from 'carbon-components-ember/components/ai-chat/session-shell';
import type ChatSessionService from 'carbon-components-ember/services/ai-chat-session';

module('Integration | Component | ai-chat/SessionShell', (hooks) => {
  setupRenderingTest(hooks);

  function registry(context: { owner: { lookup: (name: string) => unknown } }) {
    return context.owner.lookup('service:carbon.ai-chat-session') as ChatSessionService;
  }

  // Every pre-existing test below drives a single, unnamed <SessionShell />
  // (no @instanceId), which resolves the same default session as before
  // multi-instance isolation - see the "multi-instance isolation" tests
  // further down for @instanceId-scoped behavior itself.
  function session(context: { owner: { lookup: (name: string) => unknown } }) {
    return registry(context).default;
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

  test('a streaming message keeps its DOM node identity across appendChunk calls', async function (assert) {
    const svc = session(this);
    svc.open = true;
    await render(<template><SessionShell /></template>);

    const message = svc.receive('', { streaming: true });
    await settled();

    const nodeBefore = document.querySelector('.cds-aichat-session-shell__message--assistant');
    assert.ok(nodeBefore, 'the streaming bubble is rendered');

    svc.appendChunk(message.id, 'hello');
    await settled();
    const nodeAfterChunk1 = document.querySelector(
      '.cds-aichat-session-shell__message--assistant',
    );
    assert.strictEqual(
      nodeAfterChunk1,
      nodeBefore,
      'the DOM node survives the first appendChunk call',
    );

    svc.appendChunk(message.id, ' there');
    await settled();
    const nodeAfterChunk2 = document.querySelector(
      '.cds-aichat-session-shell__message--assistant',
    );
    assert.strictEqual(
      nodeAfterChunk2,
      nodeBefore,
      'the DOM node survives a second appendChunk call',
    );
    assert.dom('.cds-aichat-session-shell__message--assistant').hasText('hello there');
  });

  test('the Stop generating button cancels the active stream and hides once cancelled', async function (assert) {
    const svc = session(this);
    svc.open = true;
    await render(<template><SessionShell /></template>);

    const message = svc.receive('', { streaming: true });
    await settled();

    assert.dom('.cds-aichat-processing').exists();
    assert.dom('.cds-aichat-session-shell__streaming-actions button').hasText('Stop generating');

    await click('.cds-aichat-session-shell__streaming-actions button');

    assert.dom('.cds-aichat-processing').doesNotExist('the Processing indicator disappears once cancelled');
    assert.strictEqual(svc.messages.find((m) => m.id === message.id)?.cancelled, true);
    assert.dom('.cds-aichat-session-shell__stopped-label').exists();
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

  test('always renders ChatShell with a frame and an expanded PromptLineShell', async function (assert) {
    session(this).open = true;
    await render(<template><SessionShell /></template>);

    assert.dom('.cds-aichat-shell').doesNotHaveClass('frameless');
    assert
      .dom('.cds-aichat-prompt-line-shell__input-container')
      .hasClass('cds-aichat-prompt-line-shell__input-container--expanded');
  });

  test('isReadonly disables the send button and prevents sending', async function (assert) {
    const svc = session(this);
    svc.open = true;
    svc.isReadonly = true;
    await render(<template><SessionShell /></template>);

    assert.dom('[aria-label="Send"]').isDisabled();

    svc.draft = 'should not send';
    await triggerKeyEvent('.cds-aichat-prompt-line__field', 'keydown', 'Enter');

    assert.strictEqual(svc.messages.length, 0, 'no message was added while readonly');
    assert.dom('.cds-aichat-session-shell__message--user').doesNotExist();
  });

  test('a host component following the docs demo pattern (restart() + registerDestructor cleanup) does not leak a send listener across a remount', async function (assert) {
    // Mirrors session-shell.gjs.md's SessionShellDemo: seed via restart() so
    // a remount is idempotent, and unregister the 'send' listener on
    // teardown via registerDestructor, since carbon.ai-chat-session is an
    // app-wide singleton and on()/off() are manual by design.
    let replyCount = 0;

    class Host extends Component {
      @service('carbon.ai-chat-session') declare sessions: ChatSessionService;

      get session() {
        return this.sessions.default;
      }

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

  test('two SessionShells with different @instanceId drive fully isolated conversations', async function (assert) {
    const support = registry(this).for('support');
    const sales = registry(this).for('sales');
    support.open = true;
    sales.open = true;

    await render(
      <template>
        <div data-test-widget='support'>
          <SessionShell @instanceId='support' />
        </div>
        <div data-test-widget='sales'>
          <SessionShell @instanceId='sales' />
        </div>
      </template>,
    );

    await fillIn(
      '[data-test-widget="support"] .cds-aichat-prompt-line__field',
      'support question',
    );
    await triggerKeyEvent(
      '[data-test-widget="support"] .cds-aichat-prompt-line__field',
      'keydown',
      'Enter',
    );

    assert
      .dom('[data-test-widget="support"] .cds-aichat-session-shell__message--user')
      .hasText('support question');
    assert
      .dom('[data-test-widget="sales"] .cds-aichat-session-shell__message--user')
      .doesNotExist('sending in the support widget left the sales widget untouched');
    assert.strictEqual(support.messages.length, 1);
    assert.strictEqual(sales.messages.length, 0);
  });

  test('omitting @instanceId resolves the same default session as the registry\'s .default', async function (assert) {
    const svc = registry(this).default;
    svc.open = true;
    await render(<template><SessionShell /></template>);

    assert.dom('.cds-aichat-shell').exists();

    await fillIn('.cds-aichat-prompt-line__field', 'no instance id');
    await triggerKeyEvent('.cds-aichat-prompt-line__field', 'keydown', 'Enter');

    assert.strictEqual(svc.messages.length, 1);
    assert.strictEqual(svc.messages[0]?.text, 'no instance id');
  });

  module('<:history> integration', () => {
    test('the header history button toggles the panel open and closed', async function (assert) {
      session(this).open = true;
      await render(<template><SessionShell /></template>);

      assert.dom('.cds-aichat-shell__history').doesNotExist();

      await click('[aria-label="Chat history"]');
      assert.dom('.cds-aichat-shell__history').exists();
      assert.true(session(this).showHistory);

      await click('[aria-label="Chat history"]');
      assert.dom('.cds-aichat-shell__history').doesNotExist();
    });

    test('the default assembly renders @historyItems and forwards selection', async function (assert) {
      const svc = session(this);
      svc.open = true;
      svc.showHistory = true;
      const calls: string[] = [];
      const items = [
        { id: '1', name: 'Trip planning' },
        { id: '2', name: 'Recipe ideas' },
      ];
      const onSelect = (id: string) => calls.push(id);

      await render(
        <template>
          <SessionShell
            @historyItems={{items}}
            @selectedHistoryItemId='1'
            @onHistoryItemSelect={{onSelect}}
          />
        </template>,
      );

      assert.dom('.cds-aichat-history-panel-item').exists({ count: 2 });
      assert.dom('.cds--side-nav__link--current').hasText('Trip planning');

      await click('.cds--side-nav__link:not(.cds--side-nav__link--current)');
      assert.deepEqual(calls, ['2']);
    });

    test('the toolbar new-chat action restarts the session and closes the history panel', async function (assert) {
      const svc = session(this);
      svc.open = true;
      svc.showHistory = true;
      svc.send('leftover message');
      await render(<template><SessionShell /></template>);

      await click('.cds-aichat-history-toolbar__new-chat');

      assert.strictEqual(svc.messages.length, 0, 'restart() cleared the conversation');
      assert.false(svc.showHistory, 'the history panel closed back to the live conversation');
    });

    test('the header close button closes the history panel without closing the whole shell', async function (assert) {
      const svc = session(this);
      svc.open = true;
      svc.showHistory = true;
      await render(<template><SessionShell /></template>);

      await click('.cds-aichat-history-header__close-button');

      assert.false(svc.showHistory);
      assert.true(svc.open, 'the shell itself stays open');
    });

    test('rename and delete forward to @onHistoryItemRename/@onHistoryItemDelete', async function (assert) {
      const svc = session(this);
      svc.open = true;
      svc.showHistory = true;
      const renameCalls: Array<[string, string]> = [];
      const deleteCalls: string[] = [];
      const items = [{ id: '1', name: 'Trip planning' }];
      const onRename = (id: string, name: string) => renameCalls.push([id, name]);
      const onDelete = (id: string) => deleteCalls.push(id);

      await render(
        <template>
          <SessionShell
            @historyItems={{items}}
            @onHistoryItemRename={{onRename}}
            @onHistoryItemDelete={{onDelete}}
          />
        </template>,
      );

      await click('.cds--overflow-menu');
      await click('.cds--overflow-menu-options__option:first-child button');
      assert.dom('.cds-aichat-history-panel-item-input').exists('menu action switched the item into rename mode');

      await fillIn('.cds-aichat-history-panel-item-input input', 'Renamed chat');
      await click('.cds-aichat-history-panel-item-input__save');
      assert.deepEqual(renameCalls, [['1', 'Renamed chat']]);

      await click('.cds--overflow-menu');
      await click('.cds--overflow-menu-options__option:last-child button');
      assert.dom('.cds-aichat-history-delete-panel').exists('menu action opened the delete-confirm overlay');

      await click('.cds-aichat-history-delete-panel button:last-child');
      assert.deepEqual(deleteCalls, ['1']);
      assert.dom('.cds-aichat-history-delete-panel').doesNotExist();
    });

    test('closing the panel via the header toggle (not Cancel/Confirm) resets a pending delete so reopening does not resurrect it', async function (assert) {
      const svc = session(this);
      svc.open = true;
      svc.showHistory = true;
      const items = [{ id: '1', name: 'Trip planning' }];

      await render(<template><SessionShell @historyItems={{items}} /></template>);

      await click('.cds--overflow-menu');
      await click('.cds--overflow-menu-options__option:last-child button');
      assert.dom('.cds-aichat-history-delete-panel').exists('delete-confirm overlay opened');

      // Leave via the header's history toggle instead of Cancel/Confirm.
      await click('[aria-label="Chat history"]');
      assert.dom('.cds-aichat-shell__history').doesNotExist();

      await click('[aria-label="Chat history"]');
      assert.dom('.cds-aichat-shell__history').exists();
      assert
        .dom('.cds-aichat-history-delete-panel')
        .doesNotExist('reopening the panel does not resurrect the stale delete-confirm overlay');
    });

    test('closing the whole shell while mid-rename resets it so reopening the panel starts clean', async function (assert) {
      const svc = session(this);
      svc.open = true;
      svc.showHistory = true;
      const items = [{ id: '1', name: 'Trip planning' }];

      await render(<template><SessionShell @historyItems={{items}} /></template>);

      await click('.cds--overflow-menu');
      await click('.cds--overflow-menu-options__option:first-child button');
      assert.dom('.cds-aichat-history-panel-item-input').exists('menu action switched the item into rename mode');

      // Close the whole shell via the service directly (not a real click on
      // a different element) so the rename input's own blur-triggered
      // auto-cancel - a real click elsewhere would naturally shift focus
      // and trigger that unrelated path first - can't mask whether
      // `renamingId` itself actually got reset on teardown.
      svc.toggleOpen();
      await settled();
      assert.dom('.cds-aichat-launcher').exists();

      // Reopening leaves `showHistory` as it was (the session doesn't reset
      // it), so the history panel - and, without the fix, the stale rename
      // input inside it - is visible again immediately.
      svc.toggleOpen();
      await settled();
      assert.dom('.cds-aichat-shell__history').exists();
      assert
        .dom('.cds-aichat-history-panel-item-input')
        .doesNotExist('reopening does not resurrect the stale rename input');
    });

    test('a <:history> block overrides the default assembly entirely', async function (assert) {
      session(this).open = true;
      session(this).showHistory = true;

      await render(
        <template>
          <SessionShell @historyItems={{array (hash id='1' name='Trip planning')}}>
            <:history><div class='custom-history'>Custom history content</div></:history>
          </SessionShell>
        </template>,
      );

      assert.dom('.custom-history').hasText('Custom history content');
      assert.dom('.cds-aichat-history-shell').doesNotExist();
    });
  });
});
