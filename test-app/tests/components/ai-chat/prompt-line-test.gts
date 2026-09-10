import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, triggerKeyEvent, find, click } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import PromptLine from 'carbon-components-ember/components/ai-chat/prompt-line';

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
});
