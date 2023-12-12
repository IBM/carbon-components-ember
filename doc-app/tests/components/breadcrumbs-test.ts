import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-template-imports';
import Breadcrumbs from 'carbon-components-ember/components/breadcrumbs';
import { array } from '@ember/helper';


module('Integration | Component | Breadcrumbs', (hooks) => {
  setupRenderingTest(hooks);

  test('should display items', async function(assert) {
    await render(hbs`<Breadcrumbs @crumbs={{array "a" "b" "c"}}></Breadcrumbs>`);

    assert.dom('.cds--breadcrumb-item').exists({ count: 3 }, 'should display all items');
  });

  test('should allow click without handler', async function(assert) {
    assert.expect(0);
    await render(hbs`<Breadcrumbs @crumbs={{array "a" "b" "c"}}></Breadcrumbs>`);

    await click('.cds--breadcrumb-item');
  });
});

