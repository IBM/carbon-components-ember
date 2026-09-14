import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitUntil, find } from '@ember/test-helpers';
import WorkspaceShell from 'carbon-components-ember/components/ai-chat/workspace-shell';

module('Integration | Component | ai-chat/WorkspaceShell', (hooks) => {
  setupRenderingTest(hooks);

  test('renders all five blocks in a single composition', async function (assert) {
    await render(
      <template>
        <WorkspaceShell>
          <:toolbar><div class='tb'>Toolbar</div></:toolbar>
          <:notification><div class='nt'>Notification</div></:notification>
          <:header as |Header|><Header @titleText='Order' /></:header>
          <:body><div class='bd'>Body</div></:body>
          <:footer><div class='ft'>Footer</div></:footer>
        </WorkspaceShell>
      </template>,
    );

    assert.dom('.cds-aichat-workspace-shell__toolbar .tb').exists();
    assert.dom('.cds-aichat-workspace-shell__notification .nt').exists();
    assert.dom('.cds-aichat-workspace-shell__header').exists();
    assert.dom('.cds-aichat-workspace-shell__header-title').containsText('Order');
    assert.dom('.cds-aichat-workspace-shell__body-wrapper .bd').exists();
    assert.dom('.ft').exists();
  });

  test('the yielded header is not collapsible by default (@autoCollapsibleHeader unset)', async function (assert) {
    await render(
      <template>
        <WorkspaceShell>
          <:header as |Header|><Header @titleText='Order' /></:header>
        </WorkspaceShell>
      </template>,
    );

    assert.dom('details').doesNotExist();
    assert.dom('.cds-aichat-workspace-shell__header').exists();
  });

  test('@autoCollapsibleHeader collapses the header once the shell is too short for it', async function (assert) {
    await render(
      <template>
        <WorkspaceShell @autoCollapsibleHeader={{true}} style='block-size: 40px; overflow: hidden;'>
          <:header as |Header|><Header @titleText='Order' /></:header>
          <:body><div class='bd'>Body</div></:body>
        </WorkspaceShell>
      </template>,
    );

    await waitUntil(() => find('.cds-aichat-workspace-shell__header-details'));

    assert.dom('.cds-aichat-workspace-shell__header-details').exists();
    assert.dom('.cds-aichat-workspace-shell__header-title').containsText('Order');
  });
});
