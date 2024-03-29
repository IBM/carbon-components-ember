import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, rerender, settled } from '@ember/test-helpers';
import { hbs } from 'ember-template-imports';


module('Integration | Component | Button', (hooks) => {
  setupRenderingTest(hooks);

  test('should set as primary', async function(assert) {
    await render(hbs`<Button @type="primary"></Button>`);
    await rerender()

    assert.dom('button').hasClass('cds--btn--primary');
  });

  test('should set as secondary', async function(assert) {
    await render(hbs`<Button @type="secondary"></Button>`);
    assert.dom('button').hasClass('cds--btn--secondary');
  });

  test('should show loading indicator for async click handler', async function(assert) {

    let promise;
    const onClick = function() {
      promise = new Promise(res => setTimeout(res, 100));
      return promise;
    };

    await render(hbs`<Button @onClick={{onClick}} @type="secondary"></Button>`);

    await click('button');

    assert.ok(promise, 'should trigger onClick');
    assert.dom('button').hasClass('cds--btn--secondary');
    assert.dom('.cds--loading').exists('should show loading indicator');

    await promise;
    await settled();

    assert.dom('.cds--loading').doesNotExist('should not show loading indicator');
  });

  test('cannot click disabled', async function(assert) {
    assert.expect(2);

    const onClick = function() {
      return new Promise(res => setTimeout(res, 1000));
    };

    await render(hbs`<Button @onClick={{onClick}} @type="primary" @disabled={{true}}></Button>`);

    try {
      await click('button');
    } catch (e) {
      assert.deepEqual(e.message, 'Can not `click` disabled [object HTMLButtonElement]', 'cannot click');
    }

    assert.dom('button').hasClass('cds--btn--disabled', 'class names should include  cds--btn--disabled');
  });
});

