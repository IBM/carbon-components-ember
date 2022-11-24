import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, rerender, settled } from '@ember/test-helpers';
import { hbs } from 'ember-template-imports';
import Button from 'carbon-components-ember/components/button';


module('Integration | Component | Button', (hooks) => {
  setupRenderingTest(hooks);

  test('should set as primary', async function(assert) {
    await render(hbs`<Button @type="primary"></Button>`);
    await rerender()

    assert.ok(this.element.querySelector('button')?.getAttribute('class')?.includes('primary'));
  });

  test('should set as secondary', async function(assert) {
    await render(hbs`<Button @type="secondary"></Button>`);

    assert.ok(this.element.querySelector('button')?.getAttribute('class')?.includes('secondary'));
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
    assert.ok(this.element.querySelector('button')?.getAttribute('class')?.includes('secondary'));
    assert.ok(this.element.querySelector('.cds--loading'), 'should show loading indicator');

    await promise;
    await settled();

    assert.notOk(this.element.querySelector('.cds--loading'), 'should not show loading indicator');
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

    const classAttr = this.element.querySelector('button')?.getAttribute('class');
    assert.ok(classAttr?.includes('cds--btn--disabled'), 'class names should include  cds--btn--disabled');
  });
});

