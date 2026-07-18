import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import UIShell from 'carbon-components-ember/components/ui-shell';
import { cell } from 'ember-resources';

module('Integration | Component | UIShell', (hooks) => {
  setupRenderingTest(hooks);

  test('renders header and main content regions', async function (assert) {
    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Header @title='IBM' @subtitle='Platform' />
          </:shell>
          <:content>
            <p>Page content</p>
          </:content>
        </UIShell>
      </template>,
    );

    assert.dom('.cds--header').exists();
    assert.dom('.cds--header__name--prefix').hasText('IBM Platform');
    assert.dom('main.cds--content').exists();
    assert.dom('main.cds--content').hasText('Page content');
  });

  test('header menu toggle calls onToggle with the inverse of open', async function (assert) {
    const open = cell(false);
    const onToggle = (value: boolean) => (open.current = value);

    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Header
              @title='IBM'
              @subtitle='Platform'
              @open={{open.current}}
              @onToggle={{onToggle}}
            />
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert.dom('.cds--header__menu-toggle').exists();
    await click('.cds--header__menu-toggle');
    assert.true(open.current);
  });
});
