import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, triggerKeyEvent, find, click, settled } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import PromptLine, { type PromptLineApi } from 'carbon-components-ember/components/ai-chat/prompt-line';
import { waitForAnimationFrame } from '../../helpers';

/** Dispatches a real, untrusted `paste` event carrying plain text - matches
 * how `RichController`'s `PlainTextPaste` plugin reads `event.clipboardData`. */
function pasteText(target: Element, text: string) {
  const clipboardData = new DataTransfer();
  clipboardData.setData('text/plain', text);
  target.dispatchEvent(new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true }));
}

module('Integration | Component | ai-chat/PromptLine', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders the initial @content and placeholder/aria-label', async function (assert) {
    await render(
      <template>
        <PromptLine @content='hello' @placeholder='Type a message' @ariaLabel='Chat input' />
      </template>,
    );

    assert.dom('.cds-aichat-prompt-line__field').hasValue('hello');
    assert.dom('.cds-aichat-prompt-line__field').hasAttribute('placeholder', 'Type a message');
    assert.dom('.cds-aichat-prompt-line__field').hasAttribute('aria-label', 'Chat input');
  });

  test('defaults aria-label to "Message"', async function (assert) {
    await render(<template><PromptLine /></template>);
    assert.dom('.cds-aichat-prompt-line__field').hasAttribute('aria-label', 'Message');
  });

  test('typing calls @onChange with the new value and keeps the mirror in sync', async function (assert) {
    const calls: string[] = [];
    const onChange = (value: string) => calls.push(value);

    await render(<template><PromptLine @onChange={{onChange}} /></template>);

    await fillIn('.cds-aichat-prompt-line__field', 'hi there');

    assert.deepEqual(calls, ['hi there']);
    assert.dom('.cds-aichat-prompt-line__mirror').hasText('hi there');
  });

  test('an external (controlled) @content change updates the field without an @onChange round trip', async function (assert) {
    class State {
      @tracked content = '';
    }
    const state = new State();

    class Host extends Component {
      state = state;
      setContent = () => {
        this.state.content = 'set from outside';
      };
      <template>
        <PromptLine @content={{this.state.content}} />
        <button type='button' class='set-button' {{on 'click' this.setContent}}>Set</button>
      </template>
    }

    await render(<template><Host /></template>);

    assert.dom('.cds-aichat-prompt-line__field').hasValue('');

    await click('.set-button');

    assert.dom('.cds-aichat-prompt-line__field').hasValue('set from outside');
  });

  test('plain Enter on a non-empty field calls @onSendIntent and prevents the newline', async function (assert) {
    let sent = 0;
    const onSendIntent = () => sent++;

    await render(<template><PromptLine @content='ready to send' @onSendIntent={{onSendIntent}} /></template>);

    await triggerKeyEvent('.cds-aichat-prompt-line__field', 'keydown', 'Enter');

    assert.strictEqual(sent, 1);
  });

  test('Shift+Enter does not call @onSendIntent', async function (assert) {
    let sent = 0;
    const onSendIntent = () => sent++;

    await render(<template><PromptLine @content='draft' @onSendIntent={{onSendIntent}} /></template>);

    await triggerKeyEvent('.cds-aichat-prompt-line__field', 'keydown', 'Enter', { shiftKey: true });

    assert.strictEqual(sent, 0);
  });

  test('plain Enter on an empty field does not call @onSendIntent', async function (assert) {
    let sent = 0;
    const onSendIntent = () => sent++;

    await render(<template><PromptLine @onSendIntent={{onSendIntent}} /></template>);

    await triggerKeyEvent('.cds-aichat-prompt-line__field', 'keydown', 'Enter');

    assert.strictEqual(sent, 0);
  });

  test('Mod-Enter sends even on an empty field', async function (assert) {
    let sent = 0;
    const onSendIntent = () => sent++;

    await render(<template><PromptLine @onSendIntent={{onSendIntent}} /></template>);

    await triggerKeyEvent('.cds-aichat-prompt-line__field', 'keydown', 'Enter', { ctrlKey: true });

    assert.strictEqual(sent, 1);
  });

  test('Escape blurs the field', async function (assert) {
    await render(<template><PromptLine /></template>);

    const field = find('.cds-aichat-prompt-line__field') as HTMLTextAreaElement;
    field.focus();
    assert.strictEqual(document.activeElement, field);

    await triggerKeyEvent('.cds-aichat-prompt-line__field', 'keydown', 'Escape');

    assert.notStrictEqual(document.activeElement, field);
  });

  test('@disabled renders the field readonly', async function (assert) {
    await render(<template><PromptLine @disabled={{true}} /></template>);
    assert.dom('.cds-aichat-prompt-line__field').hasAttribute('readonly');
  });

  // -------------------------------------------------------------------------
  // Rich (Tiptap) mode
  // -------------------------------------------------------------------------

  test('defaults to the textarea surface — no Tiptap DOM is ever created', async function (assert) {
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(<template><PromptLine @onReady={{onReady}} /></template>);

    assert.dom('.cds-aichat-prompt-line__field').exists();
    assert.dom('.cds-aichat-prompt-line__pm-content').doesNotExist();
    assert.strictEqual(api.getEditor(), null, 'getEditor() is a probe and never triggers the upgrade');
    assert.dom('.cds-aichat-prompt-line__field').exists('probing getEditor() did not upgrade the surface');
  });

  test('@rich upgrades to the Tiptap surface, transferring text and caret losslessly', async function (assert) {
    class State {
      @tracked content = '';
      @tracked rich = false;
    }
    const state = new State();
    let api!: PromptLineApi;
    const onChange = (value: string) => (state.content = value);
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(
      <template>
        <PromptLine
          @content={{state.content}}
          @onChange={{onChange}}
          @rich={{state.rich}}
          @onReady={{onReady}}
        />
      </template>,
    );

    await fillIn('.cds-aichat-prompt-line__field', 'hello world');
    const field = find('.cds-aichat-prompt-line__field') as HTMLTextAreaElement;
    field.setSelectionRange(5, 5);

    state.rich = true;
    await api.ensureEditor();

    assert.dom('.cds-aichat-prompt-line__field').doesNotExist();
    assert.dom('.cds-aichat-prompt-line__pm-content').hasText('hello world');

    const editor = api.getEditor();
    assert.ok(editor, 'getEditor() returns the live Tiptap editor once rich');
    assert.strictEqual(
      editor!.state.selection.from,
      editor!.state.selection.to,
      'caret is collapsed, not a range selection',
    );
    // "hello" is 5 plain-text characters in; textToDoc's single paragraph
    // costs +1 for the doc/paragraph boundary.
    assert.strictEqual(editor!.state.selection.from, 6, 'caret offset carried over from the textarea');
  });

  test('multi-line content survives the textarea -> rich upgrade without doubled newlines', async function (assert) {
    const calls: string[] = [];
    class State {
      @tracked content = '';
      @tracked rich = false;
    }
    const state = new State();
    let api!: PromptLineApi;
    const onChange = (value: string) => {
      state.content = value;
      calls.push(value);
    };
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(
      <template>
        <PromptLine
          @content={{state.content}}
          @onChange={{onChange}}
          @rich={{state.rich}}
          @onReady={{onReady}}
        />
      </template>,
    );

    await fillIn('.cds-aichat-prompt-line__field', 'hi\nthere');

    state.rich = true;
    await api.ensureEditor();

    assert.strictEqual(
      api.getValue(),
      'hi\nthere',
      'getValue() reports single newlines, not doubled ones, right after the upgrade',
    );

    const editor = api.getEditor()!;
    editor.commands.insertContent(' more');
    await settled();

    assert.strictEqual(
      api.getValue(),
      'hi\nthere more',
      'getValue() still reports single newlines after a further edit',
    );
    assert.strictEqual(
      calls.at(-1),
      'hi\nthere more',
      '@onChange received single newlines, not doubled ones',
    );
  });

  test('setting @rich back to false does not downgrade a rich surface (sticky upgrade)', async function (assert) {
    class State {
      @tracked rich = true;
    }
    const state = new State();
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(<template><PromptLine @rich={{state.rich}} @onReady={{onReady}} /></template>);
    await api.ensureEditor();
    assert.dom('.cds-aichat-prompt-line__pm-content').exists();

    state.rich = false;
    await settled();

    assert.dom('.cds-aichat-prompt-line__pm-content').exists('still rich after @rich flips back to false');
    assert.dom('.cds-aichat-prompt-line__field').doesNotExist();
  });

  test('typing in the rich editor calls @onChange', async function (assert) {
    const calls: string[] = [];
    let api!: PromptLineApi;
    const onChange = (value: string) => calls.push(value);
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(
      <template>
        <PromptLine @rich={{true}} @onChange={{onChange}} @onReady={{onReady}} />
      </template>,
    );
    await api.ensureEditor();

    api.getEditor()!.commands.insertContent('hi there');

    assert.deepEqual(calls, ['hi there']);
  });

  test('a controlled @content update does not re-trigger @onChange in rich mode', async function (assert) {
    class State {
      @tracked content = '';
    }
    const state = new State();
    const calls: string[] = [];
    let api!: PromptLineApi;
    const onChange = (value: string) => calls.push(value);
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(
      <template>
        <PromptLine
          @rich={{true}}
          @content={{state.content}}
          @onChange={{onChange}}
          @onReady={{onReady}}
        />
      </template>,
    );
    await api.ensureEditor();

    state.content = 'set from outside';
    await settled();

    assert.dom('.cds-aichat-prompt-line__pm-content').hasText('set from outside');
    assert.deepEqual(calls, [], 'no onChange echo for a controlled update');
  });

  test('plain Enter sends and Shift+Enter inserts a newline in rich mode', async function (assert) {
    let sent = 0;
    let api!: PromptLineApi;
    const onSendIntent = () => sent++;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(
      <template>
        <PromptLine @rich={{true}} @onSendIntent={{onSendIntent}} @onReady={{onReady}} />
      </template>,
    );
    await api.ensureEditor();

    // Enter on an empty field falls through to a newline, matching the
    // textarea's own empty-field guard.
    await triggerKeyEvent('.cds-aichat-prompt-line__pm-content', 'keydown', 'Enter');
    assert.strictEqual(sent, 0);

    api.getEditor()!.commands.insertContent('ready to send');
    await triggerKeyEvent('.cds-aichat-prompt-line__pm-content', 'keydown', 'Enter');
    assert.strictEqual(sent, 1);

    await triggerKeyEvent('.cds-aichat-prompt-line__pm-content', 'keydown', 'Enter', { shiftKey: true });
    assert.strictEqual(sent, 1, 'Shift+Enter does not send');
  });

  test('Mod-Enter sends even on an empty rich field', async function (assert) {
    let sent = 0;
    let api!: PromptLineApi;
    const onSendIntent = () => sent++;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(
      <template>
        <PromptLine @rich={{true}} @onSendIntent={{onSendIntent}} @onReady={{onReady}} />
      </template>,
    );
    await api.ensureEditor();

    // Unlike the textarea's own hand-rolled keydown handler (which accepts
    // either modifier regardless of platform - see the passing `ctrlKey`-only
    // test above), the rich editor's Mod-Enter comes from real
    // `prosemirror-keymap` binding resolution, which resolves `Mod` to
    // exactly `Meta` on Mac and `Ctrl` elsewhere (`navigator.platform`-based,
    // matching prosemirror-keymap's own detection) and requires an exact
    // modifier-set match - the "other" modifier alone will not fire it.
    const isMac = /Mac|iP(hone|[oa]d)/.test(navigator.platform);
    await triggerKeyEvent(
      '.cds-aichat-prompt-line__pm-content',
      'keydown',
      'Enter',
      isMac ? { metaKey: true } : { ctrlKey: true },
    );

    assert.strictEqual(sent, 1);
  });

  test('undo/redo round-trip through the imperative API', async function (assert) {
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(<template><PromptLine @rich={{true}} @onReady={{onReady}} /></template>);
    await api.ensureEditor();

    api.getEditor()!.commands.insertContent('a change');
    assert.strictEqual(api.getValue(), 'a change');

    const undone = api.undo();
    assert.true(undone);
    assert.strictEqual(api.getValue(), '');

    const redone = api.redo();
    assert.true(redone);
    assert.strictEqual(api.getValue(), 'a change');
  });

  test('@disabled makes the rich editor non-editable', async function (assert) {
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(
      <template>
        <PromptLine @rich={{true}} @disabled={{true}} @onReady={{onReady}} />
      </template>,
    );
    await api.ensureEditor();

    assert.false(api.getEditor()!.isEditable);
  });

  test('@placeholder renders through the Tiptap placeholder decoration', async function (assert) {
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(
      <template>
        <PromptLine @rich={{true}} @placeholder='Type a message' @onReady={{onReady}} />
      </template>,
    );
    await api.ensureEditor();

    assert.dom('.cds-aichat-prompt-line__pm-content p').hasAttribute('data-placeholder', 'Type a message');
  });

  test('a new @extensions array reference rebuilds the rich editor (resets undo, preserves content)', async function (assert) {
    class State {
      // Untyped so this file never has to reference `Extension` (from
      // `@tiptap/core`) by name - `carbon-components-ember`'s own
      // dependencies aren't resolvable from test-app's package context (see
      // the equivalent `flatpickr`/`markdown-it` precedent elsewhere in this
      // suite), and an empty array is assignable regardless. Only the
      // *reference* identity matters for this test, not the contents.
      @tracked extensions = [];
    }
    const state = new State();
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(
      <template>
        <PromptLine @rich={{true}} @extensions={{state.extensions}} @onReady={{onReady}} />
      </template>,
    );
    await api.ensureEditor();

    api.getEditor()!.commands.insertContent('typed text');
    assert.strictEqual(api.getValue(), 'typed text');
    assert.true(api.undo(), 'undo works before the @extensions reference changes');
    assert.strictEqual(api.getValue(), '');
    assert.true(api.redo());

    state.extensions = [];
    await settled();

    assert.strictEqual(api.getValue(), 'typed text', 'content survives the rebuild');
    assert.false(api.undo(), 'undo history was reset by the rebuild');
  });

  test('ensureEditor() called directly (without setting @rich) upgrades the surface', async function (assert) {
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(<template><PromptLine @onReady={{onReady}} /></template>);

    assert.dom('.cds-aichat-prompt-line__field').exists();

    const editor = await api.ensureEditor();

    assert.ok(editor);
    assert.dom('.cds-aichat-prompt-line__pm-content').exists();
  });

  test('api.clearContent() empties the rich editor and fires @onChange', async function (assert) {
    const calls: string[] = [];
    let api!: PromptLineApi;
    const onChange = (value: string) => calls.push(value);
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(
      <template>
        <PromptLine @rich={{true}} @onChange={{onChange}} @onReady={{onReady}} />
      </template>,
    );
    await api.ensureEditor();

    api.getEditor()!.commands.insertContent('to be cleared');
    assert.strictEqual(api.getValue(), 'to be cleared');

    api.clearContent();

    assert.strictEqual(api.getValue(), '');
    assert.strictEqual(calls.at(-1), '', 'clearContent() fires @onChange with the emptied value');
  });

  test('api.insertContent() inserts at an explicit position, independent of the current selection', async function (assert) {
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(<template><PromptLine @rich={{true}} @onReady={{onReady}} /></template>);
    await api.ensureEditor();

    api.insertContent('world');
    assert.strictEqual(api.getValue(), 'world');

    // Position 1 is right after the doc/paragraph boundary, i.e. the start
    // of the text - inserting there (rather than at the current selection,
    // which sits at the end after the insert above) proves `at` is honored.
    api.insertContent('hello ', { at: 1 });

    assert.strictEqual(api.getValue(), 'hello world');
  });

  test('api.insertContent() inserts literal text, not parsed HTML', async function (assert) {
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(<template><PromptLine @rich={{true}} @onReady={{onReady}} /></template>);
    await api.ensureEditor();

    api.insertContent('a<br>b<p>c</p>');

    assert.strictEqual(
      api.getValue(),
      'a<br>b<p>c</p>',
      'HTML-like substrings are inserted as visible characters, not parsed into real nodes',
    );
  });

  test('api.insertContent() merges a multi-line insert at the very start of the document (at: 0)', async function (assert) {
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(<template><PromptLine @rich={{true}} @onReady={{onReady}} /></template>);
    await api.ensureEditor();

    api.insertContent('world');

    // Position 0 sits at the true outer document boundary (before the only
    // paragraph, depth 0) - a naive, unclamped `from`/`to` there would leave
    // 'line1'/'line2' as their own unmerged paragraphs instead of merging the
    // last inserted line into the paragraph that already follows it.
    api.insertContent('line1\nline2', { at: 0 });

    assert.strictEqual(api.getValue(), 'line1\nline2world');
  });

  test('api.insertContent() merges a multi-line insert at the very end of the document (at: doc size)', async function (assert) {
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(<template><PromptLine @rich={{true}} @onReady={{onReady}} /></template>);
    await api.ensureEditor();

    api.insertContent('world');
    const docSize = api.getEditor()!.state.doc.content.size;

    // Symmetric case: `doc.content.size` sits just past the only paragraph's
    // closing boundary (depth 0) - unclamped, the first inserted line would
    // never merge into the preceding 'world' paragraph.
    api.insertContent('line1\nline2', { at: docSize });

    assert.strictEqual(api.getValue(), 'worldline1\nline2');
  });

  test('api.setTextSelection() and api.selectAll() move the Tiptap selection', async function (assert) {
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(<template><PromptLine @rich={{true}} @onReady={{onReady}} /></template>);
    await api.ensureEditor();

    api.getEditor()!.commands.insertContent('hello world');

    api.setTextSelection(1);
    let selection = api.getEditor()!.state.selection;
    assert.strictEqual(selection.from, 1);
    assert.strictEqual(selection.to, 1, 'a single position collapses the selection there');

    api.setTextSelection({ from: 1, to: 6 });
    selection = api.getEditor()!.state.selection;
    assert.strictEqual(selection.from, 1);
    assert.strictEqual(selection.to, 6, 'a {from, to} range selects that range');

    api.selectAll();
    selection = api.getEditor()!.state.selection;
    assert.strictEqual(selection.from, 0);
    assert.strictEqual(
      selection.to,
      api.getEditor()!.state.doc.content.size,
      'selectAll() selects the whole document',
    );
  });

  test('pasting single-line text does not split the surrounding paragraph in two', async function (assert) {
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(<template><PromptLine @rich={{true}} @onReady={{onReady}} /></template>);
    await api.ensureEditor();

    api.getEditor()!.commands.insertContent('hello world');

    // Position 7 is right after "hello " (1 for the doc/paragraph boundary +
    // 6 characters), i.e. mid-paragraph, between "hello " and "world".
    api.setTextSelection(7);
    pasteText(find('.cds-aichat-prompt-line__pm-content')!, 'PASTED');

    assert.strictEqual(
      api.getValue(),
      'hello PASTEDworld',
      'mid-paragraph paste merges inline instead of creating new paragraphs',
    );

    // The end of the document's content, i.e. right after "hello PASTEDworld".
    api.setTextSelection(api.getEditor()!.state.doc.content.size);
    pasteText(find('.cds-aichat-prompt-line__pm-content')!, '!');

    assert.strictEqual(
      api.getValue(),
      'hello PASTEDworld!',
      'end-of-paragraph paste merges inline instead of creating a new paragraph',
    );
  });

  test('pasting multi-line text only turns the interior lines into new paragraphs', async function (assert) {
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(<template><PromptLine @rich={{true}} @onReady={{onReady}} /></template>);
    await api.ensureEditor();

    api.getEditor()!.commands.insertContent('hello world');
    // Position 7 is mid-paragraph, between "hello " and "world".
    api.setTextSelection(7);
    pasteText(find('.cds-aichat-prompt-line__pm-content')!, 'line1\nline2');

    assert.strictEqual(
      api.getValue(),
      'hello line1\nline2world',
      'first/last pasted lines merge with the surrounding paragraph, only the interior line is a new paragraph',
    );
  });

  // -------------------------------------------------------------------------
  // IME composition guard
  // -------------------------------------------------------------------------

  test('an IME composition in progress defers a @rich-triggered upgrade until it ends', async function (assert) {
    class State {
      @tracked rich = false;
    }
    const state = new State();

    await render(<template><PromptLine @rich={{state.rich}} /></template>);

    const field = find('.cds-aichat-prompt-line__field') as HTMLTextAreaElement;
    field.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));

    state.rich = true;
    await settled();

    assert.dom('.cds-aichat-prompt-line__field').exists('upgrade is withheld while a composition is in flight');
    assert.dom('.cds-aichat-prompt-line__pm-content').doesNotExist();

    field.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
    await settled();

    assert.dom('.cds-aichat-prompt-line__pm-content').exists('upgrade proceeds once composition ends');
    assert.dom('.cds-aichat-prompt-line__field').doesNotExist();
  });

  test('an IME composition in progress defers a rich-mode @extensions rebuild until it ends', async function (assert) {
    class State {
      // Untyped, matches the existing @extensions-reference test above -
      // only the reference identity matters here, not the contents.
      @tracked extensions = [];
    }
    const state = new State();
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(
      <template>
        <PromptLine @rich={{true}} @extensions={{state.extensions}} @onReady={{onReady}} />
      </template>,
    );
    await api.ensureEditor();

    const editorBefore = api.getEditor();
    const pmContent = find('.cds-aichat-prompt-line__pm-content')!;
    pmContent.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));

    state.extensions = [];
    await settled();

    assert.strictEqual(api.getEditor(), editorBefore, 'rebuild is withheld while composing');

    pmContent.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
    await settled();

    assert.notStrictEqual(api.getEditor(), editorBefore, 'rebuild proceeds once composition ends');
  });

  // -------------------------------------------------------------------------
  // Preload / warm-mount fast path
  // -------------------------------------------------------------------------

  test('PromptLine.preloadRich() warms the Tiptap chunk so an initial @rich mounts rich directly, no textarea flash', async function (assert) {
    await PromptLine.preloadRich();

    await render(<template><PromptLine @rich={{true}} /></template>);

    assert.dom('.cds-aichat-prompt-line__pm-content').exists();
    assert
      .dom('.cds-aichat-prompt-line__field')
      .doesNotExist('warm runtime skips the textarea entirely, no one-tick flash');
  });

  test('api.focus() and api.blur() move real DOM focus in rich mode', async function (assert) {
    let api!: PromptLineApi;
    const onReady = (fn: PromptLineApi) => (api = fn);

    await render(<template><PromptLine @rich={{true}} @onReady={{onReady}} /></template>);
    await api.ensureEditor();

    // Tiptap's focus()/blur() commands both defer the actual DOM
    // focus()/blur() call to a requestAnimationFrame callback, so a plain
    // settled() (no pending Ember async) isn't enough to observe the effect.
    api.focus();
    await waitForAnimationFrame();
    assert.true(api.hasFocus());
    assert.dom(document.activeElement).hasClass('cds-aichat-prompt-line__pm-content');

    api.blur();
    await waitForAnimationFrame();
    assert.false(api.hasFocus());
    assert.dom(document.activeElement).doesNotHaveClass('cds-aichat-prompt-line__pm-content');
  });
});
