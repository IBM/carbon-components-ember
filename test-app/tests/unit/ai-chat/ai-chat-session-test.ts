import { module, test } from 'qunit';
import { setupTest } from 'test-app/tests/helpers';
import type ChatSessionService from 'carbon-components-ember/services/ai-chat-session';

module('Unit | Service | ai-chat-session', function (hooks) {
  setupTest(hooks);

  function getService(context: { owner: { lookup: (name: string) => unknown } }) {
    return context.owner.lookup('service:carbon.ai-chat-session') as ChatSessionService;
  }

  test('send() appends a user message and clears the draft', function (assert) {
    const session = getService(this);
    session.setDraft('hello there');

    const message = session.send();

    assert.strictEqual(message?.role, 'user');
    assert.strictEqual(message?.text, 'hello there');
    assert.strictEqual(session.draft, '', 'draft is cleared after an implicit send');
    assert.strictEqual(session.messages.length, 1);
  });

  test('send() ignores empty/whitespace-only text and returns undefined', function (assert) {
    const session = getService(this);

    assert.strictEqual(session.send('   '), undefined);
    assert.strictEqual(session.messages.length, 0);
  });

  test('send() is a no-op while isReadonly is true', function (assert) {
    const session = getService(this);
    session.isReadonly = true;

    assert.strictEqual(session.send('hi'), undefined);
    assert.strictEqual(session.messages.length, 0);
  });

  test('send(text) does not clear an unrelated draft', function (assert) {
    const session = getService(this);
    session.setDraft('unsent draft');

    session.send('explicit text');

    assert.strictEqual(session.draft, 'unsent draft');
  });

  test('receive()/appendChunk()/finalizeStreaming() drive a streaming assistant message', function (assert) {
    const session = getService(this);

    const message = session.receive('', { streaming: true });
    assert.true(message.streaming);
    assert.true(session.isStreaming);

    session.appendChunk(message.id, 'Hel');
    session.appendChunk(message.id, 'lo');
    assert.strictEqual(session.messages[0]?.text, 'Hello');
    assert.true(session.messages[0]?.streaming);

    session.finalizeStreaming(message.id);
    assert.false(session.messages[0]?.streaming);
    assert.false(session.isStreaming);
  });

  test('appendChunk() replaces only the matching message, by array reference', function (assert) {
    const session = getService(this);
    const first = session.receive('first', { streaming: true });
    const second = session.receive('second', { streaming: true });

    const beforeSecond = session.messages[1];
    session.appendChunk(first.id, '!');

    assert.strictEqual(session.messages[0]?.text, 'first!');
    assert.strictEqual(session.messages[1], beforeSecond, 'untouched message keeps its identity');
    assert.strictEqual(second.id, session.messages[1]?.id);
  });

  test('toggleOpen()/toggleHistory()/toggleWorkspace() flip their own flag independently', function (assert) {
    const session = getService(this);

    session.toggleOpen();
    assert.true(session.open);
    session.toggleHistory();
    assert.true(session.showHistory);
    assert.false(session.showWorkspace);
    session.toggleWorkspace();
    assert.true(session.showWorkspace);
  });

  test('on()/off()/emit() dispatch to registered handlers and stop after off()', function (assert) {
    const session = getService(this);
    const calls: unknown[] = [];
    const handler = (detail: unknown) => calls.push(detail);

    session.on('send', handler);
    session.send('one');
    assert.strictEqual(calls.length, 1);

    session.off('send', handler);
    session.send('two');
    assert.strictEqual(calls.length, 1, 'handler no longer called after off()');
  });

  test('restart() clears messages and draft and emits restart', function (assert) {
    const session = getService(this);
    session.send('one');
    session.setDraft('leftover');
    let restarted = false;
    session.on('restart', () => (restarted = true));

    session.restart();

    assert.strictEqual(session.messages.length, 0);
    assert.strictEqual(session.draft, '');
    assert.true(restarted);
  });
});
