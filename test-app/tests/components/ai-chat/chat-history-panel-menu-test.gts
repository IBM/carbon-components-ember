import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import { cell } from 'ember-resources';
import ChatHistoryPanelMenu from 'carbon-components-ember/components/ai-chat/chat-history-panel-menu';

module('Integration | Component | ai-chat/ChatHistoryPanelMenu', (hooks) => {
  setupRenderingTest(hooks);

  test('renders the title, starts expanded, and toggles on click', async function (assert) {
    await render(
      <template>
        <ChatHistoryPanelMenu @title='Yesterday' as |Item|>
          <Item @name='Chat 1' />
        </ChatHistoryPanelMenu>
      </template>,
    );

    assert.dom('.cds--side-nav__submenu-title').hasText('Yesterday');
    assert.dom('.cds--side-nav__submenu').hasAttribute('aria-expanded', 'true');

    await click('.cds--side-nav__submenu');
    assert.dom('.cds--side-nav__submenu').hasAttribute('aria-expanded', 'false');

    await click('.cds--side-nav__submenu');
    assert.dom('.cds--side-nav__submenu').hasAttribute('aria-expanded', 'true');
  });

  test('a controlled menu (@onToggle passed, @expanded round-tripped) never toggles itself; @expanded is the sole source of truth', async function (assert) {
    const expanded = cell(true);
    const calls: boolean[] = [];
    const onToggle = (next: boolean) => {
      calls.push(next);
      expanded.current = next;
    };

    await render(
      <template>
        <ChatHistoryPanelMenu @title='Yesterday' @expanded={{expanded.current}} @onToggle={{onToggle}} />
      </template>,
    );

    await click('.cds--side-nav__submenu');
    assert.deepEqual(calls, [false]);
    assert.dom('.cds--side-nav__submenu').hasAttribute('aria-expanded', 'false');

    // Simulate the host choosing NOT to update @expanded in response.
    expanded.current = true;
    await settled();
    await click('.cds--side-nav__submenu');
    assert.deepEqual(calls, [false, false], 'still reads the live @expanded, not internal state');
  });

  test('yields ChatHistoryPanelItem pre-bound with @parentMenuExpanded reflecting live expanded state', async function (assert) {
    await render(
      <template>
        <ChatHistoryPanelMenu @title='Yesterday' @showActions={{true}} as |Item|>
          <Item @name='Chat 1' @selected={{true}} />
        </ChatHistoryPanelMenu>
      </template>,
    );

    assert.dom('.cds-aichat-history-panel-item').hasAttribute('data-parent-menu-expanded', '');

    await click('.cds--side-nav__submenu');
    assert.dom('.cds-aichat-history-panel-item').doesNotHaveAttribute('data-parent-menu-expanded');
  });
});
