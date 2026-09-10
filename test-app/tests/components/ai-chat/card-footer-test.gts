import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitUntil, find, triggerEvent } from '@ember/test-helpers';
import AiChatCardFooter, {
  type CardFooterAction,
} from 'carbon-components-ember/components/ai-chat/card-footer';
import Checkmark from 'carbon-components-ember/components/icons/checkmark';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
// The addon's own custom SCSS (its `.cds-aichat-card-footer__icon-actions`
// rules, incl. whether it clips its own overflow) — not part of
// `@carbon/styles`' prebuilt bundle above.
import * as carbonComponentStyle from 'carbon-components-ember/styles.scss?inline';

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

  test("icon-only action tooltips are not clipped by the icon-actions container", async function (assert) {
    const actions: CardFooterAction[] = [
      { id: 'a', label: '', tooltipText: 'Copy' },
    ];

    await render(
      <template>
        <style>{{carbonStyle.default}}</style>
        <style>{{carbonComponentStyle.default}}</style>
        <AiChatCardFooter @actions={{actions}} />
      </template>,
    );

    const container = find(
      '.cds-aichat-card-footer__icon-actions',
    ) as HTMLElement;
    assert.notStrictEqual(
      getComputedStyle(container).overflow,
      'hidden',
      'the container does not clip its own contents — a Tooltip popping up above one of its buttons (the default alignment) would otherwise be cut off',
    );

    await triggerEvent('.cds--tooltip', 'mouseenter');
    await waitUntil(() =>
      find('.cds--tooltip')?.classList.contains('cds--popover--open'),
    );

    const containerRect = container.getBoundingClientRect();
    const tooltipRect = find(
      '.cds--popover-content',
    )!.getBoundingClientRect();

    assert.true(
      tooltipRect.top < containerRect.top,
      "the open tooltip renders above the icon-actions container's own box (its default alignment), so it must not be clipped there",
    );
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

  test('it opts icon-only and labeled action icons out of the default icon margin', async function (assert) {
    const actions: CardFooterAction[] = [
      { id: 'a', label: '', tooltipText: 'Copy', icon: Checkmark },
    ];

    await render(<template><AiChatCardFooter @actions={{actions}} /></template>);
    await waitUntil(() => find('.cds-aichat-card-footer__icon-actions svg'));

    assert
      .dom('.cds-aichat-card-footer__icon-actions svg')
      .hasClass('cds-aichat-card-footer__action-icon');

    const labeledActions: CardFooterAction[] = [
      { id: 'a', label: 'Accept', icon: Checkmark },
    ];

    await render(<template><AiChatCardFooter @actions={{labeledActions}} /></template>);
    await waitUntil(() => find('.cds-aichat-card-footer__actions svg'));

    assert
      .dom('.cds-aichat-card-footer__actions svg')
      .hasClass('cds-aichat-card-footer__action-icon');
  });
});
