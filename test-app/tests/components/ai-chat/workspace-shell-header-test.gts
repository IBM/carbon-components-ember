import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import WorkspaceShellHeader from 'carbon-components-ember/components/ai-chat/workspace-shell-header';

module('Integration | Component | ai-chat/WorkspaceShellHeader', (hooks) => {
  setupRenderingTest(hooks);

  test('renders title/subtitle without a details/summary when not collapsible', async function (assert) {
    await render(
      <template><WorkspaceShellHeader @titleText='Order #1234' @subTitleText='Placed 2 days ago' /></template>,
    );

    assert.dom('.cds-aichat-workspace-shell__header-title').containsText('Order #1234');
    assert.dom('.cds-aichat-workspace-shell__header-sub-title').hasText('Placed 2 days ago');
    assert.dom('details').doesNotExist();
  });

  test('@collapsible renders a details/summary that starts closed and toggles', async function (assert) {
    const calls: boolean[] = [];
    const onToggle = (open: boolean) => calls.push(open);

    await render(
      <template><WorkspaceShellHeader @titleText='Order #1234' @collapsible={{true}} @onToggle={{onToggle}} /></template>,
    );

    assert.dom('details').exists();
    assert.dom('details').doesNotHaveAttribute('open');

    await click('.cds-aichat-workspace-shell__header-summary');

    assert.dom('details').hasAttribute('open');
    assert.deepEqual(calls, [true]);
  });

  test('headerDescription and headerAction blocks render', async function (assert) {
    await render(
      <template>
        <WorkspaceShellHeader @titleText='Order'>
          <:headerDescription><p class='desc'>Extra detail</p></:headerDescription>
          <:headerAction><button type='button' class='action-btn'>Edit</button></:headerAction>
        </WorkspaceShellHeader>
      </template>,
    );

    assert.dom('.desc').hasText('Extra detail');
    assert.dom('.action-btn').exists();
  });
});
