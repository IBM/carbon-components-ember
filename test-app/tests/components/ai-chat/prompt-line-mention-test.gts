import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerKeyEvent, settled } from '@ember/test-helpers';
import { on } from '@ember/modifier';
import PromptLine, { type PromptLineApi } from 'carbon-components-ember/components/ai-chat/prompt-line';
import { resetRichRuntimeForTests } from 'carbon-components-ember/components/ai-chat/-prompt-line/rich-loader';
import { buildCarbonExtensions } from 'carbon-components-ember/components/ai-chat/-prompt-line/tiptap/build-extensions';
import { carbonMention, carbonCommand } from 'carbon-components-ember/components/ai-chat/-prompt-line/tiptap/carbon-mention';
import { carbonAutocomplete } from 'carbon-components-ember/components/ai-chat/-prompt-line/tiptap/carbon-autocomplete';
import { carbonStarterTrigger } from 'carbon-components-ember/components/ai-chat/-prompt-line/tiptap/carbon-starter-trigger';
import type { SuggestionItem, TriggerChangeEventDetail } from 'carbon-components-ember/components/ai-chat/-prompt-line/tiptap/types';
import { waitForAnimationFrame } from '../../helpers';

module('Integration | Component | ai-chat/PromptLine mention/autocomplete/starter extensions', (hooks) => {
  setupRenderingTest(hooks);

  hooks.afterEach(() => {
    resetRichRuntimeForTests();
  });

  const PEOPLE: SuggestionItem[] = [
    { id: '1', label: 'Alice' },
    { id: '2', label: 'Bob' },
  ];

  test('smoke: build-extensions.ts assembles exactly the requested extensions', function (assert) {
    assert.strictEqual(buildCarbonExtensions({}).length, 0);
    assert.strictEqual(buildCarbonExtensions({ mention: { trigger: '@', items: PEOPLE } }).length, 1);
    assert.strictEqual(
      buildCarbonExtensions({
        mention: { trigger: '@', items: PEOPLE },
        command: { trigger: '/', items: PEOPLE },
        autocomplete: { items: PEOPLE },
        starters: { items: PEOPLE },
      }).length,
      4,
    );
  });

  test('typing "@" opens a mention trigger and dispatches cds-aichat-trigger-change', async function (assert) {
    const events: (TriggerChangeEventDetail | null)[] = [];
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);
    const onTriggerChange = (event: CustomEvent<TriggerChangeEventDetail | null>) => events.push(event.detail);
    const extensions = buildCarbonExtensions({ mention: { trigger: '@', items: PEOPLE } });

    await render(
      <template>
        <PromptLine
          @rich={{true}}
          @extensions={{extensions}}
          @onReady={{onReady}}
          {{on 'cds-aichat-trigger-change' onTriggerChange}}
        />
      </template>,
    );
    await api.ensureEditor();

    api.getEditor()!.commands.insertContent('@');
    await settled();

    assert.strictEqual(events.length, 1);
    assert.strictEqual(events[0]?.type, 'mention');
    assert.strictEqual(events[0]?.query, '');
  });

  test('api.selectSuggestion() inserts a mention chip (no trigger prefix) and calls onSelect', async function (assert) {
    const selected: SuggestionItem[] = [];
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);
    const extensions = buildCarbonExtensions({
      mention: { trigger: '@', items: PEOPLE, onSelect: (item) => selected.push(item) },
    });

    await render(<template><PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} /></template>);
    await api.ensureEditor();

    api.getEditor()!.commands.insertContent('@');
    await settled();

    assert.true(api.selectSuggestion(PEOPLE[0]!));
    await settled();

    assert.dom('.cds-aichat--token[data-token-type="mention"]').hasText('Alice');
    assert.deepEqual(
      selected.map((item) => item.id),
      ['1'],
    );
  });

  test('a command chip is prefixed with its trigger by default; a mention chip is not', async function (assert) {
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);
    const extensions = buildCarbonExtensions({
      mention: { trigger: '@', items: PEOPLE },
      command: { trigger: '/', items: [{ id: 'c1', label: 'summarize' }] },
    });

    await render(<template><PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} /></template>);
    await api.ensureEditor();

    api.getEditor()!.commands.insertContent('@');
    await settled();
    api.selectSuggestion(PEOPLE[0]!);
    await settled();
    assert.dom('.cds-aichat--token[data-token-type="mention"]').hasText('Alice');

    api.getEditor()!.commands.insertContent(' /');
    await settled();
    api.selectSuggestion({ id: 'c1', label: 'summarize' });
    await settled();
    assert.dom('.cds-aichat--token[data-token-type="command"]').hasText('/summarize');
  });

  test('api.dismissSuggestion() closes the trigger without inserting anything', async function (assert) {
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);
    const extensions = buildCarbonExtensions({ mention: { trigger: '@', items: PEOPLE } });

    await render(<template><PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} /></template>);
    await api.ensureEditor();

    api.getEditor()!.commands.insertContent('@');
    await settled();

    assert.true(api.dismissSuggestion());
    await settled();

    assert.dom('.cds-aichat--token').doesNotExist();
    // Nothing is active anymore, so a second dismiss/select is a no-op.
    assert.false(api.dismissSuggestion());
    assert.false(api.selectSuggestion(PEOPLE[0]!));
  });

  test('plain Enter and Mod-Enter do not send while a mention trigger is active', async function (assert) {
    let sent = 0;
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);
    const onSendIntent = () => sent++;
    const extensions = buildCarbonExtensions({ mention: { trigger: '@', items: PEOPLE } });

    await render(
      <template>
        <PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} @onSendIntent={{onSendIntent}} />
      </template>,
    );
    await api.ensureEditor();

    api.getEditor()!.commands.insertContent('@');
    await settled();

    await triggerKeyEvent('.cds-aichat-prompt-line__pm-content', 'keydown', 'Enter');
    await triggerKeyEvent('.cds-aichat-prompt-line__pm-content', 'keydown', 'Enter', { ctrlKey: true });

    assert.strictEqual(sent, 0, 'Enter is withheld from sending while a trigger is open');
  });

  test('deleting an inserted mention chip via a user edit fires onRemove; clearContent()/a controlled @content change do not', async function (assert) {
    const removed: SuggestionItem[] = [];
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);
    const extensions = buildCarbonExtensions({
      mention: { trigger: '@', items: PEOPLE, onRemove: (item) => removed.push(item) },
    });

    await render(<template><PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} /></template>);
    await api.ensureEditor();

    api.getEditor()!.commands.insertContent('@');
    await settled();
    api.selectSuggestion(PEOPLE[0]!);
    await settled();
    assert.dom('.cds-aichat--token').exists({ count: 1 });

    // A real user-edit deletion (a plain command chain, no host-origin tag).
    const editor = api.getEditor()!;
    editor.chain().focus().deleteRange({ from: 1, to: 2 }).run();
    await settled();

    assert.dom('.cds-aichat--token').doesNotExist();
    assert.deepEqual(
      removed.map((item) => item.id),
      ['1'],
      'a real user deletion fires onRemove',
    );
  });

  test('a host-driven clearContent() removes a chip without firing onRemove', async function (assert) {
    const removed: SuggestionItem[] = [];
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);
    const extensions = buildCarbonExtensions({
      mention: { trigger: '@', items: PEOPLE, onRemove: (item) => removed.push(item) },
    });

    await render(<template><PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} /></template>);
    await api.ensureEditor();

    api.getEditor()!.commands.insertContent('@');
    await settled();
    api.selectSuggestion(PEOPLE[0]!);
    await settled();

    api.clearContent();
    await settled();

    assert.dom('.cds-aichat--token').doesNotExist();
    assert.strictEqual(removed.length, 0, 'a host-driven clearContent() is host-origin, not a user edit');
  });

  test('typing plain text opens autocomplete, which stands down while a mention trigger is active', async function (assert) {
    const events: (TriggerChangeEventDetail | null)[] = [];
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);
    const onTriggerChange = (event: CustomEvent<TriggerChangeEventDetail | null>) => events.push(event.detail);
    const extensions = buildCarbonExtensions({
      mention: { trigger: '@', items: PEOPLE },
      autocomplete: { items: [{ id: 'w1', label: 'widget' }] },
    });

    await render(
      <template>
        <PromptLine
          @rich={{true}}
          @extensions={{extensions}}
          @onReady={{onReady}}
          {{on 'cds-aichat-trigger-change' onTriggerChange}}
        />
      </template>,
    );
    await api.ensureEditor();

    api.getEditor()!.commands.insertContent('wid');
    await settled();
    assert.strictEqual(events.at(-1)?.type, 'autocomplete');

    api.getEditor()!.commands.insertContent(' @');
    await settled();
    // Mention's and autocomplete's Suggestion plugins are independent and
    // both react to the same transaction — per trigger-utils.ts's own
    // "concurrent transitions" doc comment, a consumer sees a sequence of
    // detail values (autocomplete's own exit dispatches `null` after
    // finding its own match now excluded), not necessarily 'mention' as the
    // literal last one. What actually matters for "stands down" is that
    // autocomplete never reports its own match for the `@`-prefixed word.
    assert.true(
      events.some((detail) => detail?.type === 'mention'),
      'the mention trigger opened',
    );
    assert.false(
      events.some((detail) => detail?.type === 'autocomplete' && detail.query.startsWith('@')),
      'autocomplete never reports a match once the query starts with the excluded mention trigger char',
    );
  });

  test('carbonAutocomplete selection inserts plain text, not a token chip', async function (assert) {
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);
    const extensions = buildCarbonExtensions({ autocomplete: { items: [{ id: 'w1', label: 'widget', value: 'widget-value' }] } });

    await render(<template><PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} /></template>);
    await api.ensureEditor();

    api.getEditor()!.commands.insertContent('wid');
    await settled();
    api.selectSuggestion({ id: 'w1', label: 'widget', value: 'widget-value' });
    await settled();

    assert.dom('.cds-aichat--token').doesNotExist();
    assert.strictEqual(api.getValue(), 'widget-value');
  });

  test('carbonStarterTrigger emits type "starter" only while the editor is empty and focused', async function (assert) {
    const events: (TriggerChangeEventDetail | null)[] = [];
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);
    const onTriggerChange = (event: CustomEvent<TriggerChangeEventDetail | null>) => events.push(event.detail);
    const extensions = buildCarbonExtensions({ starters: { items: [{ id: 's1', label: 'Get started' }] } });

    await render(
      <template>
        <PromptLine
          @rich={{true}}
          @extensions={{extensions}}
          @onReady={{onReady}}
          {{on 'cds-aichat-trigger-change' onTriggerChange}}
        />
      </template>,
    );
    await api.ensureEditor();
    // Tiptap's focus() command defers the real DOM focus() call to a
    // requestAnimationFrame callback, and carbonStarterTrigger's onFocus
    // hook only runs once that real DOM focus event actually fires.
    api.focus();
    await waitForAnimationFrame();

    assert.strictEqual(events.at(-1)?.type, 'starter');

    api.getEditor()!.commands.insertContent('hello');
    await settled();

    assert.strictEqual(events.at(-1), null, 'typing dismisses the starter list');
  });

  test('an empty starters config never emits a starter trigger', async function (assert) {
    const events: (TriggerChangeEventDetail | null)[] = [];
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);
    const onTriggerChange = (event: CustomEvent<TriggerChangeEventDetail | null>) => events.push(event.detail);
    const extensions = buildCarbonExtensions({ starters: { items: [] } });

    await render(
      <template>
        <PromptLine
          @rich={{true}}
          @extensions={{extensions}}
          @onReady={{onReady}}
          {{on 'cds-aichat-trigger-change' onTriggerChange}}
        />
      </template>,
    );
    await api.ensureEditor();
    api.focus();
    await waitForAnimationFrame();

    assert.strictEqual(events.length, 0);
  });

  test('carbonMention and carbonCommand are exported and usable directly, not just via buildCarbonExtensions', function (assert) {
    assert.ok(carbonMention({ trigger: '@', items: PEOPLE }));
    assert.ok(carbonCommand({ trigger: '/', items: PEOPLE }));
    assert.ok(carbonAutocomplete({ items: PEOPLE }));
    assert.ok(carbonStarterTrigger(PEOPLE));
  });
});
