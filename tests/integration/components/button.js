import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | Button', (hooks) => {
  setupRenderingTest(hooks);

  test('should set as primary', async function(assert) {
    await render(hbs`<Button @type='primary' />`);

    assert.ok(this.element.querySelector('div').getAttribute('class').includes('primary'));
  });

  test('should set as secondary', async function(assert) {
    await render(hbs`<Button @type='secondary' />`);

    assert.ok(this.element.querySelector('div').getAttribute('class').includes('secondary'));
  });
});
