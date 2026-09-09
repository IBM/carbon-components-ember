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

  test('it renders each labeled action kind as exactly one Button variant', async function (assert) {
    const allKindClasses = [
      'cds--btn--primary',
      'cds--btn--secondary',
      'cds--btn--tertiary',
      'cds--btn--ghost',
      'cds--btn--danger',
    ];
    const actions: CardFooterAction[] = [
      { id: 'a', label: 'Primary', kind: 'primary' },
      { id: 'b', label: 'Secondary' },
      { id: 'c', label: 'Tertiary', kind: 'tertiary' },
      { id: 'd', label: 'Ghost', kind: 'ghost' },
      { id: 'e', label: 'Danger', kind: 'danger' },
    ];

    await render(<template><AiChatCardFooter @actions={{actions}} /></template>);

    const buttons = document.querySelectorAll(
      '.cds-aichat-card-footer__actions button',
    );
    const expectedClasses = [
      'cds--btn--primary',
      'cds--btn--secondary',
      'cds--btn--tertiary',
      'cds--btn--ghost',
      'cds--btn--danger',
    ];

    expectedClasses.forEach((expected, index) => {
      const present = allKindClasses.filter((kindClass) =>
        buttons[index]!.classList.contains(kindClass),
      );
      assert.deepEqual(
        present,
        [expected],
        `action ${index} (kind ${actions[index]!.kind ?? 'unset'}) renders exactly the ${expected} variant class`,
      );
    });
  });

  test('it defaults icon-only actions to ghost but respects an explicit kind', async function (assert) {
    const allKindClasses = [
      'cds--btn--primary',
      'cds--btn--secondary',
      'cds--btn--tertiary',
      'cds--btn--ghost',
      'cds--btn--danger',
    ];
    const actions: CardFooterAction[] = [
      { id: 'a', label: '', tooltipText: 'Default' },
      { id: 'b', label: '', tooltipText: 'Danger', kind: 'danger' },
    ];

    await render(<template><AiChatCardFooter @actions={{actions}} /></template>);

    const buttons = document.querySelectorAll(
      '.cds-aichat-card-footer__icon-actions button',
    );

    assert.deepEqual(
      allKindClasses.filter((kindClass) => buttons[0]!.classList.contains(kindClass)),
      ['cds--btn--ghost'],
      'icon-only action with no kind defaults to ghost',
    );
    assert.deepEqual(
      allKindClasses.filter((kindClass) => buttons[1]!.classList.contains(kindClass)),
      ['cds--btn--danger'],
      'icon-only action respects an explicit kind instead of always being ghost',
    );
  });
});
