import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent, settled, find, findAll } from '@ember/test-helpers';
import { cell } from 'ember-resources';
import PromptLine, { type PromptLineApi } from 'carbon-components-ember/components/ai-chat/prompt-line';
import PromptLineAutocomplete from 'carbon-components-ember/components/ai-chat/prompt-line-autocomplete';
import { resetRichRuntimeForTests } from 'carbon-components-ember/components/ai-chat/-prompt-line/rich-loader';
import { buildCarbonExtensions } from 'carbon-components-ember/components/ai-chat/-prompt-line/tiptap/build-extensions';
import type { SuggestionItem, TriggerChangeEventDetail } from 'carbon-components-ember/components/ai-chat/-prompt-line/tiptap/types';
import { waitForAnimationFrame } from '../../helpers';

module('Integration | Component | ai-chat/PromptLineAutocomplete', (hooks) => {
  setupRenderingTest(hooks);

  hooks.afterEach(() => {
    resetRichRuntimeForTests();
  });

  const PEOPLE: SuggestionItem[] = [
    { id: '1', label: 'Alice' },
    { id: '2', label: 'Bob' },
  ];

  function fakeApi(overrides: Partial<PromptLineApi> = {}): PromptLineApi {
    return {
      getEditor: () => null,
      ensureEditor: () => Promise.reject(new Error('not used in this fake')),
      getValue: () => '',
      focus: () => undefined,
      blur: () => undefined,
      hasFocus: () => false,
      clearContent: () => undefined,
      insertContent: () => undefined,
      setTextSelection: () => undefined,
      selectAll: () => undefined,
      undo: () => false,
      redo: () => false,
      selectSuggestion: () => false,
      dismissSuggestion: () => false,
      ...overrides,
    };
  }

  /**
   * `PromptLineAutocomplete`'s `@promptLine` is a real Ember arg, re-read on
   * every render - a bare outer-scope `let api!; const onReady = (fn) => (api = fn)`
   * (the pattern `prompt-line-mention-test.gts` uses for tests that only
   * ever read `api` from *test code*) doesn't work here, since reassigning
   * a plain untracked variable never schedules a rerender, so `{{api}}}`
   * passed as an arg stays frozen at its initial (`undefined`) value
   * forever. `cell()` gives `onReady` a real tracked target instead.
   */
  function apiHandle() {
    const handle = cell<PromptLineApi | undefined>(undefined);
    const onReady = (fn: PromptLineApi) => (handle.current = fn);
    return { handle, onReady };
  }

  // -----------------------------------------------------------------------
  // Reconciliation of a same-tick batch of raw `cds-aichat-trigger-change`
  // events - the load-bearing part of this component, with no upstream
  // reference (see class doc). Driven via raw event dispatch on the
  // `.cds-aichat-prompt-line-shell` container so each case is deterministic,
  // independent of real Tiptap extension timing.
  // -----------------------------------------------------------------------
  module('same-tick batch reconciliation', () => {
    const api = fakeApi();
    const mentionConfig = { trigger: '@', items: PEOPLE };
    const autocompleteConfig = { items: [{ id: 'w1', label: 'widget' }] };
    const startersConfig = { items: [{ id: 's1', label: 'Get started' }] };

    async function renderWithContainer() {
      await render(
        <template>
          <div class='cds-aichat-prompt-line-shell' data-test-container>
            <PromptLineAutocomplete @promptLine={{api}} @mention={{mentionConfig}} @autocomplete={{autocompleteConfig}} @starters={{startersConfig}} />
          </div>
        </template>,
      );
    }

    function dispatch(detail: TriggerChangeEventDetail | null) {
      const container = find('[data-test-container]')!;
      container.dispatchEvent(
        new CustomEvent<TriggerChangeEventDetail | null>('cds-aichat-trigger-change', {
          detail,
          bubbles: true,
          composed: true,
        }),
      );
    }

    test('[starter, mention, null] resolves to mention (the documented race)', async function (assert) {
      await renderWithContainer();

      dispatch({ type: 'starter', query: '', triggerOffset: 0 });
      dispatch({ type: 'mention', query: '', triggerOffset: 0 });
      dispatch(null);
      await settled();

      assert.dom('.cds-aichat-autocomplete-item').exists({ count: 2 }, 'mention items (Alice, Bob) are showing');
      assert.dom(findAll('.cds-aichat-autocomplete-item')[0]!).hasText('Alice');
    });

    test('[null] resolves to closed', async function (assert) {
      await renderWithContainer();

      dispatch({ type: 'mention', query: '', triggerOffset: 0 });
      await settled();
      assert.dom('.cds-aichat-autocomplete').exists('a mention trigger opened first');

      dispatch(null);
      await settled();

      assert.dom('.cds-aichat-autocomplete').doesNotExist();
    });

    test('[null(mention exit), starter] resolves to starters', async function (assert) {
      await renderWithContainer();

      dispatch(null);
      dispatch({ type: 'starter', query: '', triggerOffset: 0 });
      await settled();

      assert.dom('.cds-aichat-autocomplete-item').exists({ count: 1 });
      assert.dom('.cds-aichat-autocomplete-item').hasText('Get started');
    });

    test('[null(starter exit), autocomplete] resolves to autocomplete', async function (assert) {
      await renderWithContainer();

      dispatch(null);
      dispatch({ type: 'autocomplete', query: 'wid', triggerOffset: 0 });
      await settled();

      assert.dom('.cds-aichat-autocomplete-item').exists({ count: 1 });
      assert.dom('.cds-aichat-autocomplete-item').hasText('widget');
    });

    test('an explicit cancel (Escape) immediately closes and drops a stale queued event', async function (assert) {
      await renderWithContainer();

      dispatch({ type: 'mention', query: '', triggerOffset: 0 });
      await settled();
      assert.dom('.cds-aichat-autocomplete').exists();

      // Queue a stale re-affirmation of the same trigger, then synchronously
      // cancel before the microtask flush runs.
      dispatch({ type: 'mention', query: '', triggerOffset: 0 });
      await triggerKeyEvent('[data-test-container]', 'keydown', 'Escape');
      assert.dom('.cds-aichat-autocomplete').doesNotExist('closes immediately, synchronously with the keydown');

      await settled();
      assert.dom('.cds-aichat-autocomplete').doesNotExist('the stale queued event does not reopen it');
    });
  });

  // -----------------------------------------------------------------------
  // Real end-to-end behavior against a live `PromptLine` + Tiptap extensions.
  // -----------------------------------------------------------------------

  test('live repro: focusing empty (starters) then typing "@" (mention) ends up showing mention, not closed', async function (assert) {
    const { handle: api, onReady } = apiHandle();
    const mentionConfig = { trigger: '@', items: PEOPLE };
    const startersConfig = { items: [{ id: 's1', label: 'Get started' }] };
    const extensions = buildCarbonExtensions({ mention: mentionConfig, starters: startersConfig });

    await render(
      <template>
        <div class='cds-aichat-prompt-line-shell'>
          <PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} />
          <PromptLineAutocomplete @promptLine={{api.current}} @mention={{mentionConfig}} @starters={{startersConfig}} />
        </div>
      </template>,
    );
    await api.current!.ensureEditor();
    api.current!.focus();
    await waitForAnimationFrame();
    assert.dom('.cds-aichat-autocomplete-item').hasText('Get started', 'starters showed first');

    api.current!.getEditor()!.commands.insertContent('@');
    await settled();

    assert.dom('.cds-aichat-autocomplete-item').exists({ count: 2 }, 'mention items are showing, not closed');
    assert.dom(findAll('.cds-aichat-autocomplete-item')[0]!).hasText('Alice');
  });

  test('clicking a mention item inserts a chip and fires onItemSelected (mention/command always insert, never send-direct)', async function (assert) {
    const { handle: api, onReady } = apiHandle();
    const selected: SuggestionItem[] = [];
    const onItemSelected = (item: SuggestionItem) => selected.push(item);
    const mentionConfig = { trigger: '@', items: PEOPLE };
    const extensions = buildCarbonExtensions({ mention: mentionConfig });

    await render(
      <template>
        <div class='cds-aichat-prompt-line-shell'>
          <PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} />
          <PromptLineAutocomplete @promptLine={{api.current}} @mention={{mentionConfig}} @onItemSelected={{onItemSelected}} />
        </div>
      </template>,
    );
    await api.current!.ensureEditor();

    api.current!.getEditor()!.commands.insertContent('@');
    await settled();
    await click('.cds-aichat-autocomplete-item');

    assert.dom('.cds-aichat--token[data-token-type="mention"]').hasText('Alice');
    assert.dom('.cds-aichat-autocomplete').doesNotExist('the popup closed after selection');
    assert.deepEqual(
      selected.map((i) => i.id),
      ['1'],
    );
  });

  test('clicking an autocomplete item (default disableDirectSend: false) fires onItemSend and never touches the editor', async function (assert) {
    const { handle: api, onReady } = apiHandle();
    const sent: string[] = [];
    const onItemSend = (text: string) => sent.push(text);
    const item = { id: 'w1', label: 'widget', value: 'widget-value' };
    const autocompleteConfig = { items: [item] };
    const extensions = buildCarbonExtensions({ autocomplete: autocompleteConfig });

    await render(
      <template>
        <div class='cds-aichat-prompt-line-shell'>
          <PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} />
          <PromptLineAutocomplete @promptLine={{api.current}} @autocomplete={{autocompleteConfig}} @onItemSend={{onItemSend}} />
        </div>
      </template>,
    );
    await api.current!.ensureEditor();

    api.current!.getEditor()!.commands.insertContent('wid');
    await settled();
    await click('.cds-aichat-autocomplete-item');

    assert.deepEqual(sent, ['widget-value']);
    assert.strictEqual(api.current!.getValue(), 'wid', 'the editor content is untouched by the direct-send path');
  });

  test('@isSendDisabled makes the direct-send click path a no-op (no dismiss, no callback)', async function (assert) {
    const { handle: api, onReady } = apiHandle();
    const sent: string[] = [];
    const onItemSend = (text: string) => sent.push(text);
    const item = { id: 'w1', label: 'widget' };
    const autocompleteConfig = { items: [item] };
    const extensions = buildCarbonExtensions({ autocomplete: autocompleteConfig });

    await render(
      <template>
        <div class='cds-aichat-prompt-line-shell'>
          <PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} />
          <PromptLineAutocomplete
            @promptLine={{api.current}}
            @autocomplete={{autocompleteConfig}}
            @isSendDisabled={{true}}
            @onItemSend={{onItemSend}}
          />
        </div>
      </template>,
    );
    await api.current!.ensureEditor();

    api.current!.getEditor()!.commands.insertContent('wid');
    await settled();
    await click('.cds-aichat-autocomplete-item');

    assert.strictEqual(sent.length, 0);
    assert.dom('.cds-aichat-autocomplete').exists('stays open - nothing happened');
  });

  test('autocomplete with disableDirectSend: true inserts text and fires onItemSelected instead of sending', async function (assert) {
    const { handle: api, onReady } = apiHandle();
    const selected: SuggestionItem[] = [];
    const onItemSelected = (item: SuggestionItem) => selected.push(item);
    const item = { id: 'w1', label: 'widget', value: 'widget-value' };
    const autocompleteConfig = { items: [item], disableDirectSend: true };
    const extensions = buildCarbonExtensions({ autocomplete: autocompleteConfig });

    await render(
      <template>
        <div class='cds-aichat-prompt-line-shell'>
          <PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} />
          <PromptLineAutocomplete @promptLine={{api.current}} @autocomplete={{autocompleteConfig}} @onItemSelected={{onItemSelected}} />
        </div>
      </template>,
    );
    await api.current!.ensureEditor();

    api.current!.getEditor()!.commands.insertContent('wid');
    await settled();
    await click('.cds-aichat-autocomplete-item');

    assert.strictEqual(api.current!.getValue(), 'widget-value');
    assert.deepEqual(
      selected.map((i) => i.id),
      ['w1'],
    );
  });

  test('a starter (default disableDirectSend: false) sends its text without touching the editor', async function (assert) {
    const { handle: api, onReady } = apiHandle();
    const sent: string[] = [];
    const onItemSend = (text: string) => sent.push(text);
    const startersConfig = { items: [{ id: 's1', label: 'Get started' }] };
    const extensions = buildCarbonExtensions({ starters: startersConfig });

    await render(
      <template>
        <div class='cds-aichat-prompt-line-shell'>
          <PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} />
          <PromptLineAutocomplete @promptLine={{api.current}} @starters={{startersConfig}} @onItemSend={{onItemSend}} />
        </div>
      </template>,
    );
    await api.current!.ensureEditor();
    api.current!.focus();
    await waitForAnimationFrame();

    await click('.cds-aichat-autocomplete-item');

    assert.deepEqual(sent, ['Get started']);
    assert.strictEqual(api.current!.getValue(), '');
  });

  test('a starter with disableDirectSend: true inserts its text and fires onStarterSelected with the full value', async function (assert) {
    const { handle: api, onReady } = apiHandle();
    const starterTexts: string[] = [];
    const onStarterSelected = (text: string) => starterTexts.push(text);
    const startersConfig = { items: [{ id: 's1', label: 'Get started' }], disableDirectSend: true };
    const extensions = buildCarbonExtensions({ starters: startersConfig });

    await render(
      <template>
        <div class='cds-aichat-prompt-line-shell'>
          <PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} />
          <PromptLineAutocomplete @promptLine={{api.current}} @starters={{startersConfig}} @onStarterSelected={{onStarterSelected}} />
        </div>
      </template>,
    );
    await api.current!.ensureEditor();
    api.current!.focus();
    await waitForAnimationFrame();

    await click('.cds-aichat-autocomplete-item');

    assert.strictEqual(api.current!.getValue(), 'Get started');
    assert.deepEqual(starterTexts, ['Get started']);
  });

  test('keyboard: ArrowDown/ArrowUp move the active item, skipping disabled ones, and Enter selects', async function (assert) {
    const { handle: api, onReady } = apiHandle();
    const items = [
      { id: '1', label: 'Alice' },
      { id: '2', label: 'Bob', disabled: true },
      { id: '3', label: 'Carol' },
    ];
    const mentionConfig = { trigger: '@', items };
    const extensions = buildCarbonExtensions({ mention: mentionConfig });

    await render(
      <template>
        <div class='cds-aichat-prompt-line-shell'>
          <PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} />
          <PromptLineAutocomplete @promptLine={{api.current}} @mention={{mentionConfig}} />
        </div>
      </template>,
    );
    await api.current!.ensureEditor();

    api.current!.getEditor()!.commands.insertContent('@');
    await settled();

    const pmContent = '.cds-aichat-prompt-line__pm-content';
    assert.dom(findAll('.cds-aichat-autocomplete-item')[0]!).hasClass('cds-aichat-autocomplete-item--active');
    assert.dom(findAll('.cds-aichat-autocomplete-item')[0]!).hasAttribute('aria-selected', 'true');
    assert.dom(findAll('.cds-aichat-autocomplete-item')[2]!).hasAttribute('aria-selected', 'false');

    await triggerKeyEvent(pmContent, 'keydown', 'ArrowDown');
    // Bob is disabled - Carol (index 2) should become active, not Bob.
    assert.dom(findAll('.cds-aichat-autocomplete-item')[2]!).hasClass('cds-aichat-autocomplete-item--active');
    assert.dom(findAll('.cds-aichat-autocomplete-item')[2]!).hasAttribute('aria-selected', 'true');
    assert.dom(findAll('.cds-aichat-autocomplete-item')[0]!).hasAttribute('aria-selected', 'false');

    await triggerKeyEvent(pmContent, 'keydown', 'Enter');
    assert.dom('.cds-aichat--token[data-token-type="mention"]').hasText('Carol');
  });

  test('Escape calls dismissSuggestion() and closes the list without inserting', async function (assert) {
    const { handle: api, onReady } = apiHandle();
    const mentionConfig = { trigger: '@', items: PEOPLE };
    const extensions = buildCarbonExtensions({ mention: mentionConfig });

    await render(
      <template>
        <div class='cds-aichat-prompt-line-shell'>
          <PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} />
          <PromptLineAutocomplete @promptLine={{api.current}} @mention={{mentionConfig}} />
        </div>
      </template>,
    );
    await api.current!.ensureEditor();

    api.current!.getEditor()!.commands.insertContent('@');
    await settled();
    assert.dom('.cds-aichat-autocomplete').exists();

    await triggerKeyEvent('.cds-aichat-prompt-line__pm-content', 'keydown', 'Escape');

    assert.dom('.cds-aichat-autocomplete').doesNotExist();
    assert.dom('.cds-aichat--token').doesNotExist();
    assert.strictEqual(api.current!.getValue(), '@');

    // A real assertion that dismissSuggestion() actually closed the
    // Suggestion plugin's own match-tracking state, not just this
    // component's local UI - typing another character within the same
    // still-open match range must NOT reopen it.
    api.current!.getEditor()!.commands.insertContent('l');
    await settled();
    assert.dom('.cds-aichat-autocomplete').doesNotExist('typing more does not reopen the dismissed trigger');
  });

  test('clicking outside dismisses the list', async function (assert) {
    const { handle: api, onReady } = apiHandle();
    const mentionConfig = { trigger: '@', items: PEOPLE };
    const extensions = buildCarbonExtensions({ mention: mentionConfig });

    await render(
      <template>
        <div>
          <div class='cds-aichat-prompt-line-shell'>
            <PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} />
            <PromptLineAutocomplete @promptLine={{api.current}} @mention={{mentionConfig}} />
          </div>
          <button type='button' data-test-outside>Outside</button>
        </div>
      </template>,
    );
    await api.current!.ensureEditor();

    api.current!.getEditor()!.commands.insertContent('@');
    await settled();
    assert.dom('.cds-aichat-autocomplete').exists();

    await click('[data-test-outside]');

    assert.dom('.cds-aichat-autocomplete').doesNotExist();
  });

  test('groupId/groupTitle render items under group headings, with ungrouped items first', async function (assert) {
    const { handle: api, onReady } = apiHandle();
    const items = [
      { id: '1', label: 'Alice', groupId: 'people', groupTitle: 'People' },
      { id: '2', label: 'widget', groupId: 'items', groupTitle: 'Items' },
      { id: '3', label: 'Bare' },
    ];
    const mentionConfig = { trigger: '@', items };
    const extensions = buildCarbonExtensions({ mention: mentionConfig });

    await render(
      <template>
        <div class='cds-aichat-prompt-line-shell'>
          <PromptLine @rich={{true}} @extensions={{extensions}} @onReady={{onReady}} />
          <PromptLineAutocomplete @promptLine={{api.current}} @mention={{mentionConfig}} />
        </div>
      </template>,
    );
    await api.current!.ensureEditor();

    api.current!.getEditor()!.commands.insertContent('@');
    await settled();

    const groupTitles = findAll('.cds-aichat-autocomplete-item-group__title').map((el) => el.textContent?.trim());
    assert.deepEqual(groupTitles, ['People', 'Items']);
    const itemLabels = findAll('.cds-aichat-autocomplete-item').map((el) => el.textContent?.trim());
    assert.deepEqual(itemLabels, ['Bare', 'Alice', 'widget'], 'ungrouped items render first, then groups in first-occurrence order');
  });
});
