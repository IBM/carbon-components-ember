import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import WorkspaceShellBody from 'carbon-components-ember/components/ai-chat/workspace-shell-body';

module('Integration | Component | ai-chat/WorkspaceShellBody', (hooks) => {
  setupRenderingTest(hooks);

  test('renders yielded content', async function (assert) {
    await render(<template><WorkspaceShellBody><p class='content'>Body</p></WorkspaceShellBody></template>);

    assert.dom('.cds-aichat-workspace-shell__body .content').hasText('Body');
  });
});
