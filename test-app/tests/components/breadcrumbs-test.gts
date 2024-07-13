import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import Breadcrumbs from 'carbon-components-ember/components/breadcrumbs';
import { array } from '@ember/helper';

module('Integration | Component | Breadcrumbs', (hooks) => {
  setupRenderingTest(hooks);

  test('should display items', async function (assert) {
    await render(
      <template><Breadcrumbs @crumbs={{array 'a' 'b' 'c'}} /></template>,
    );

    assert
      .dom('.cds--breadcrumb-item')
      .exists({ count: 3 }, 'should display all items');
  });

  test('should allow click without handler', async function (assert) {
    assert.expect(0);
    await render(
      <template><Breadcrumbs @crumbs={{array 'a' 'b' 'c'}} /></template>,
    );

    await click('.cds--breadcrumb-item');
  });
});
