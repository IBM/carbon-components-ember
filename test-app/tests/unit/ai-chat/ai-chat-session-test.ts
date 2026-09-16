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

  test('cancelStreaming() stops the message, flags it cancelled, and drops a later stale appendChunk()', function (assert) {
    const session = getService(this);
    const message = session.receive('', { streaming: true });
    const signal = session.getAbortSignal(message.id);
    assert.false(signal?.aborted, 'signal starts unaborted');

    session.appendChunk(message.id, 'partial');
    session.cancelStreaming(message.id);

    assert.true(signal?.aborted, 'cancelStreaming() aborts the response signal');
    assert.false(session.messages[0]?.streaming);
    assert.true(session.messages[0]?.cancelled);
    assert.false(session.isStreaming);
    assert.strictEqual(session.getAbortSignal(message.id), undefined);

    // A host's in-flight streaming loop can still be mid-await when
    // cancelStreaming() runs and keep calling appendChunk() afterward -
    // this must not resurrect the message.
    session.appendChunk(message.id, ' more text');
    assert.strictEqual(session.messages[0]?.text, 'partial', 'a stale chunk after cancellation is dropped');
    assert.false(session.messages[0]?.streaming, 'a stale chunk does not resurrect streaming');
  });

  test('cancelStreaming() with no id defaults to the currently-streaming response', function (assert) {
    const session = getService(this);
    session.receive('already done');
    const streamingMessage = session.receive('', { streaming: true });

    session.cancelStreaming();

    assert.true(session.messages[1]?.cancelled);
    assert.strictEqual(session.messages[1]?.id, streamingMessage.id);
    assert.notOk(session.messages[0]?.cancelled, 'the non-streaming message is untouched');
  });

  test('cancelStreaming() emits a cancel event with the cancelled message', function (assert) {
    const session = getService(this);
    const message = session.receive('', { streaming: true });
    let received: unknown;
    session.on('cancel', (detail) => (received = detail));

    session.cancelStreaming(message.id);

    assert.strictEqual((received as { id: string })?.id, message.id);
    assert.true((received as { cancelled: boolean })?.cancelled);
  });

  test('cancelStreaming() is a no-op when nothing is streaming', function (assert) {
    const session = getService(this);
    session.receive('done already');

    session.cancelStreaming();

    assert.notOk(session.messages[0]?.cancelled);
  });

  test('cancelStreaming() is a no-op for a message that already finished normally', function (assert) {
    const session = getService(this);
    const message = session.receive('', { streaming: true });
    session.finalizeStreaming(message.id);
    let received: unknown;
    session.on('cancel', (detail) => (received = detail));

    session.cancelStreaming(message.id);

    assert.notOk(session.messages[0]?.cancelled, 'a normally-completed message is not relabeled cancelled');
    assert.strictEqual(received, undefined, 'cancel is not emitted for a message that was not streaming');
  });

  test('cancelStreaming() called twice for the same id is a no-op the second time', function (assert) {
    const session = getService(this);
    const message = session.receive('', { streaming: true });
    let callCount = 0;
    session.on('cancel', () => callCount++);

    session.cancelStreaming(message.id);
    session.cancelStreaming(message.id);

    assert.strictEqual(callCount, 1, 'cancel is only emitted once across both calls');
    assert.true(session.messages[0]?.cancelled);
  });

  test('restart() aborts an in-flight stream and a stale appendChunk() after it does not resurrect a message', function (assert) {
    const session = getService(this);
    const message = session.receive('', { streaming: true });
    const signal = session.getAbortSignal(message.id);

    session.restart();

    assert.true(signal?.aborted, 'restart() aborts a still-streaming response');
    assert.strictEqual(session.messages.length, 0);

    // The old (now-restarted-away) stream's loop keeps calling appendChunk()
    // with its stale id - must not resurrect a message.
    session.appendChunk(message.id, 'stale chunk');
    assert.strictEqual(session.messages.length, 0, 'a stale chunk after restart() adds nothing');
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
