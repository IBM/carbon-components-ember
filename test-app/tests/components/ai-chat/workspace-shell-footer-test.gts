import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import WorkspaceShellFooter from 'carbon-components-ember/components/ai-chat/workspace-shell-footer';

module('Integration | Component | ai-chat/WorkspaceShellFooter', (hooks) => {
  setupRenderingTest(hooks);

  test('renders one button per action, ghost/tertiary before primary', async function (assert) {
    const actions = [
      { label: 'Confirm', kind: 'primary' as const },
      { label: 'Cancel', kind: 'ghost' as const },
    ];

    await render(<template><WorkspaceShellFooter @actions={{actions}} /></template>);

    const buttons = document.querySelectorAll('.cds-aichat-workspace-shell__footer button');
    assert.strictEqual(buttons.length, 2);
    assert.dom(buttons[0]).hasText('Cancel');
    assert.dom(buttons[1]).hasText('Confirm');
  });

  test('@onClick receives the clicked action', async function (assert) {
    const calls: string[] = [];
    const actions = [{ label: 'Confirm', kind: 'primary' as const }];
    const onClick = (action: { label: string }) => calls.push(action.label);

    await render(<template><WorkspaceShellFooter @actions={{actions}} @onClick={{onClick}} /></template>);

    await click('.cds-aichat-workspace-shell__footer button');
    assert.deepEqual(calls, ['Confirm']);
  });

  test('three actions get the three-buttons class', async function (assert) {
    const actions = [
      { label: 'A', kind: 'ghost' as const },
      { label: 'B', kind: 'tertiary' as const },
      { label: 'C', kind: 'primary' as const },
    ];

    await render(<template><WorkspaceShellFooter @actions={{actions}} /></template>);

    assert.dom('.cds-aichat-workspace-shell__footer').hasClass('cds-aichat-workspace-shell__footer--three-buttons');
  });

  test('kind: secondary renders the secondary Button variant class', async function (assert) {
    const actions = [{ label: 'Secondary', kind: 'secondary' as const }];

    await render(<template><WorkspaceShellFooter @actions={{actions}} /></template>);

    assert.dom('.cds-aichat-workspace-shell__footer button').hasClass('cds--btn--secondary');
  });

  test('kind: danger renders the danger Button variant class', async function (assert) {
    const actions = [{ label: 'Danger', kind: 'danger' as const }];

    await render(<template><WorkspaceShellFooter @actions={{actions}} /></template>);

    assert.dom('.cds-aichat-workspace-shell__footer button').hasClass('cds--btn--danger');
  });
});
