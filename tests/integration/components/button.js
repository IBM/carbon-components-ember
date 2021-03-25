import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
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

  test('should show loading indicator for async click handler', async function(assert) {

    this.clicked = function() {
      return new Promise(res => setTimeout(res, 1000));
    };

    await render(hbs`<Button @onClick={{this.clicked}} @type='secondary' />`);

    await click('.title-button');

    assert.ok(this.element.querySelector('div').getAttribute('class').includes('secondary'));
  });
});
