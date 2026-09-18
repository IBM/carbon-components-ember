import { module, test } from 'qunit';
import { setupTest } from 'test-app/tests/helpers';
import type ChatSessionService from 'carbon-components-ember/services/ai-chat-session';
import { DEFAULT_CHAT_SESSION_ID } from 'carbon-components-ember/services/ai-chat-session';
import type { ChatSessionStorage } from 'carbon-components-ember/services/ai-chat-session';

module('Unit | Service | ai-chat-session', function (hooks) {
  setupTest(hooks);

  function getRegistry(context: { owner: { lookup: (name: string) => unknown } }) {
    return context.owner.lookup('service:carbon.ai-chat-session') as ChatSessionService;
  }

  // Every pre-existing test below exercises the default (single-widget)
  // session, resolved the same way SessionShell resolves it when no
  // @instanceId is given - see the "multi-instance isolation" tests further
  // down for the registry/`for()` behavior itself.
  function getService(context: { owner: { lookup: (name: string) => unknown } }) {
    return getRegistry(context).default;
  }

  // `owner.lookup()` caches the singleton, so a second call in the same
  // test returns the identical instance - not a real stand-in for "a fresh
  // page load, same storage". Unregistering first forces a genuinely new
  // instance so a rehydrate test actually proves storage round-tripped the
  // state, rather than just re-reading the already-live service.
  function getFreshService(context: {
    owner: { lookup: (name: string) => unknown; unregister: (name: string) => void };
  }) {
    context.owner.unregister('service:carbon.ai-chat-session');
    return getService(context);
  }

  // A fake in-memory adapter, not the real `sessionStorage` - a shared
  // browser global across every test in the suite would let one test's
  // persisted session leak into another's, the same class of gotcha
  // already documented for `rich-loader.ts`'s module-level warm cache.
  function createFakeStorage(): ChatSessionStorage {
    const map = new Map<string, string>();
    return {
      getItem: (key) => map.get(key) ?? null,
      setItem: (key, value) => void map.set(key, value),
      removeItem: (key) => void map.delete(key),
    };
  }

  function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

  module('multi-instance isolation (for())', function () {
    test('for() returns the same instance for the same id, and a distinct instance for a different id', function (assert) {
      const registry = getRegistry(this);

      const a1 = registry.for('widget-a');
      const a2 = registry.for('widget-a');
      const b = registry.for('widget-b');

      assert.strictEqual(a1, a2, 'the same id resolves to the same ChatSession every time');
      assert.notStrictEqual(a1, b, 'a different id resolves to a distinct ChatSession');
      assert.strictEqual(a1.id, 'widget-a');
      assert.strictEqual(b.id, 'widget-b');
    });

    test('for() with no id, and for(DEFAULT_CHAT_SESSION_ID), and .default all resolve to the same instance', function (assert) {
      const registry = getRegistry(this);

      assert.strictEqual(registry.for(), registry.default);
      assert.strictEqual(registry.for(DEFAULT_CHAT_SESSION_ID), registry.default);
    });

    test('sending in one instance does not affect another instance\'s messages or draft', function (assert) {
      const registry = getRegistry(this);
      const a = registry.for('widget-a');
      const b = registry.for('widget-b');

      a.setDraft('only in a');
      a.send();

      assert.strictEqual(a.messages.length, 1);
      assert.strictEqual(b.messages.length, 0, 'a send in widget-a leaves widget-b untouched');
      assert.strictEqual(b.draft, '', 'a draft set on widget-a leaves widget-b untouched');
    });

    test('panel/open state is independent per instance', function (assert) {
      const registry = getRegistry(this);
      const a = registry.for('widget-a');
      const b = registry.for('widget-b');

      a.toggleOpen();
      a.toggleHistory();

      assert.true(a.open);
      assert.true(a.showHistory);
      assert.false(b.open, 'widget-b was not opened by toggling widget-a');
      assert.false(b.showHistory, 'widget-b\'s history panel was not opened by toggling widget-a');
    });

    test('event-bus listeners are independent per instance', function (assert) {
      const registry = getRegistry(this);
      const a = registry.for('widget-a');
      const b = registry.for('widget-b');
      let aCalls = 0;
      let bCalls = 0;

      a.on('send', () => (aCalls += 1));
      b.on('send', () => (bCalls += 1));

      a.send('hello from a');

      assert.strictEqual(aCalls, 1, 'widget-a\'s own listener fires for its own send');
      assert.strictEqual(bCalls, 0, 'widget-b\'s listener does not fire for widget-a\'s send');
    });

    test('restart() on one instance does not clear another instance\'s messages', function (assert) {
      const registry = getRegistry(this);
      const a = registry.for('widget-a');
      const b = registry.for('widget-b');

      a.send('a message');
      b.send('b message');

      a.restart();

      assert.strictEqual(a.messages.length, 0);
      assert.strictEqual(b.messages.length, 1, 'restarting widget-a leaves widget-b\'s messages intact');
    });
  });

  module('Persistence', function () {
    test('enablePersistence() with an empty store returns false and leaves state untouched', function (assert) {
      const session = getService(this);

      const restored = session.enablePersistence(createFakeStorage());

      assert.false(restored);
      assert.false(session.wasRehydrated);
      assert.strictEqual(session.messages.length, 0);
    });

    test('send() persists immediately, and a later enablePersistence() restores it', function (assert) {
      const storage = createFakeStorage();
      const session = getService(this);
      session.enablePersistence(storage);
      session.send('remember me');

      // Simulate a reload: a brand new service instance, same storage.
      const reloaded = getFreshService(this);
      const restored = reloaded.enablePersistence(storage);

      assert.true(restored);
      assert.true(reloaded.wasRehydrated);
      assert.strictEqual(reloaded.messages.length, 1);
      assert.strictEqual(reloaded.messages[0]?.text, 'remember me');
    });

    test('restart() persists immediately, clearing a previously-restored session', function (assert) {
      const storage = createFakeStorage();
      const session = getService(this);
      session.enablePersistence(storage);
      session.send('one');

      session.restart();

      const raw = storage.getItem('carbon-ai-chat-session');
      assert.true(raw !== null);
      assert.strictEqual((JSON.parse(raw as string) as { messages: unknown[] }).messages.length, 0);
    });

    test('a message restored mid-stream comes back with streaming cleared', function (assert) {
      const storage = createFakeStorage();
      const session = getService(this);
      session.enablePersistence(storage);
      const message = session.receive('partial reply', { streaming: true });
      session.appendChunk(message.id, '...');
      session.persist(); // force the debounced appendChunk() write instead of waiting it out

      const reloaded = getFreshService(this);
      reloaded.enablePersistence(storage);

      assert.false(reloaded.messages[0]?.streaming);
      assert.false(reloaded.isStreaming);
    });

    test('cancelStreaming() persists the cancelled message', function (assert) {
      const storage = createFakeStorage();
      const session = getService(this);
      session.enablePersistence(storage);
      const message = session.receive('partial reply', { streaming: true });

      session.cancelStreaming(message.id);

      const reloaded = getFreshService(this);
      reloaded.enablePersistence(storage);

      assert.true(reloaded.messages[0]?.cancelled);
      assert.false(reloaded.messages[0]?.streaming);
    });

    test('a version mismatch is discarded rather than restored', function (assert) {
      const storage = createFakeStorage();
      storage.setItem(
        'carbon-ai-chat-session',
        JSON.stringify({ version: 999, messages: [{ id: 'x', role: 'user', text: 'old' }], draft: '', open: false, showHistory: false, showWorkspace: false }),
      );
      const session = getService(this);

      const restored = session.enablePersistence(storage);

      assert.false(restored);
      assert.strictEqual(session.messages.length, 0);
      assert.strictEqual(storage.getItem('carbon-ai-chat-session'), null, 'stale session is cleared, not left behind');
    });

    test('malformed stored JSON is discarded rather than throwing', function (assert) {
      const storage = createFakeStorage();
      storage.setItem('carbon-ai-chat-session', 'not json');
      const session = getService(this);

      const restored = session.enablePersistence(storage);

      assert.false(restored);
      assert.strictEqual(session.messages.length, 0);
    });

    test('restoring an id already used by the current counter does not collide with a later send()', function (assert) {
      const storage = createFakeStorage();
      const firstSession = getService(this);
      firstSession.enablePersistence(storage);
      const restoredMessage = firstSession.send('first ever message');

      const secondSession = getFreshService(this);
      secondSession.enablePersistence(storage);
      const newMessage = secondSession.send('after reload');

      assert.notStrictEqual(newMessage?.id, restoredMessage?.id);
    });

    test('setDraft()/appendChunk() debounce their persistence instead of writing on every call', async function (assert) {
      const storage = createFakeStorage();
      const session = getService(this);
      session.enablePersistence(storage);

      session.setDraft('h');
      session.setDraft('he');
      session.setDraft('hel');
      assert.strictEqual(storage.getItem('carbon-ai-chat-session'), null, 'not written synchronously');

      await wait(300);

      const raw = storage.getItem('carbon-ai-chat-session');
      assert.true(raw !== null);
      assert.strictEqual((JSON.parse(raw as string) as { draft: string }).draft, 'hel');
    });

    test('disablePersistence() stops further writes', function (assert) {
      const storage = createFakeStorage();
      const session = getService(this);
      session.enablePersistence(storage);
      session.send('one');

      session.disablePersistence();
      session.send('two');

      const raw = storage.getItem('carbon-ai-chat-session');
      assert.strictEqual((JSON.parse(raw as string) as { messages: unknown[] }).messages.length, 1, 'the second send() was never persisted');
    });

    test('clearPersistedSession() removes the stored session', function (assert) {
      const storage = createFakeStorage();
      const session = getService(this);
      session.enablePersistence(storage);
      session.send('one');

      session.clearPersistedSession();

      assert.strictEqual(storage.getItem('carbon-ai-chat-session'), null);
    });

    test('a custom storage key keeps two sessions independent', function (assert) {
      const storage = createFakeStorage();
      const sessionA = getService(this);
      sessionA.enablePersistence(storage, 'session-a');
      sessionA.send('a message');

      const sessionB = getFreshService(this);
      const restoredB = sessionB.enablePersistence(storage, 'session-b');

      assert.false(restoredB);
      assert.strictEqual(sessionB.messages.length, 0);
    });

    test('re-enabling persistence with a different key cancels a pending debounced write to the old one', async function (assert) {
      const storage = createFakeStorage();
      const session = getService(this);
      session.enablePersistence(storage, 'key-a');
      session.setDraft('not yet flushed'); // schedules a debounced write to 'key-a'

      session.enablePersistence(storage, 'key-b');
      await wait(300);

      assert.strictEqual(
        storage.getItem('key-a'),
        null,
        'the pending write to the old key never landed once persistence was re-pointed elsewhere',
      );
    });

    test('re-enabling persistence with the same storage/key flushes a pending write instead of reverting to the last-flushed snapshot', function (assert) {
      const storage = createFakeStorage();
      const session = getService(this);
      session.enablePersistence(storage);
      session.send('flushed message'); // written synchronously, not debounced

      session.setDraft('not yet flushed'); // schedules a debounced write, still pending

      // Simulates a same-page remount (e.g. an SPA route transition) whose
      // constructor calls enablePersistence() again with the same target -
      // must not discard the pending write and rehydrate from the stale,
      // last-flushed snapshot.
      session.enablePersistence(storage);

      assert.strictEqual(session.draft, 'not yet flushed', 'the live draft was not reverted');
      const raw = storage.getItem('carbon-ai-chat-session');
      assert.strictEqual(
        (JSON.parse(raw as string) as { draft: string }).draft,
        'not yet flushed',
        'the pending write was flushed rather than discarded',
      );
    });
  });
});
