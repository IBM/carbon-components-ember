import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import AiChatCardFooter, {
  type CardFooterAction,
} from 'carbon-components-ember/components/ai-chat/card-footer';

module('Integration | Component | ai-chat/AiChatCardFooter', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders nothing when @actions is empty', async function (assert) {
    await render(<template><AiChatCardFooter /></template>);

    assert.dom('.cds-aichat-card-footer__actions').doesNotExist();
    assert.dom('.cds-aichat-card-footer__icon-actions').doesNotExist();
  });

  test('it renders a button per labeled action and calls @onAction on click', async function (assert) {
    const calls: string[] = [];
    const onAction = (action: CardFooterAction) => calls.push(action.id);
    const actions: CardFooterAction[] = [
      { id: 'a', label: 'Accept' },
      { id: 'b', label: 'Reject' },
    ];

    await render(
      <template>
        <AiChatCardFooter @actions={{actions}} @onAction={{onAction}} />
      </template>,
    );

    assert.dom('.cds-aichat-card-footer__actions button').exists({ count: 2 });
    assert.dom('.cds-aichat-card-footer__actions button:first-child').hasText('Accept');

    await click('.cds-aichat-card-footer__actions button:first-child');
    assert.deepEqual(calls, ['a']);
  });

  test('it switches to icon-only buttons when every action lacks a label', async function (assert) {
    const actions: CardFooterAction[] = [
      { id: 'a', label: '', tooltipText: 'Copy' },
      { id: 'b', label: '', tooltipText: 'Delete' },
    ];

    await render(<template><AiChatCardFooter @actions={{actions}} /></template>);

    assert.dom('.cds-aichat-card-footer__icon-actions').exists();
    assert.dom('.cds-aichat-card-footer__actions').doesNotExist();
    assert.dom('.cds-aichat-card-footer__icon-actions button').exists({ count: 2 });
  });

  test('it stacks more than two actions', async function (assert) {
    const actions: CardFooterAction[] = [
      { id: 'a', label: 'One' },
      { id: 'b', label: 'Two' },
      { id: 'c', label: 'Three' },
    ];

    await render(<template><AiChatCardFooter @actions={{actions}} /></template>);

    assert
      .dom('.cds-aichat-card-footer__actions')
      .hasClass('cds-aichat-card-footer__actions--stacked');
  });
});
