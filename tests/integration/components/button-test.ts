import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, rerender, TestContext} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Button from 'carbon-components-ember/components/button';

type Context = {
  Button: typeof Button;
  onClick: () => void;
}

module('Integration | Component | Button', (hooks) => {
  setupRenderingTest(hooks);

  hooks.beforeEach(function(this: TestContext&Context){
    this.Button = Button;
  });

  test('should set as primary', async function(this: TestContext&Context,assert) {
    await render(hbs`<this.Button @type="primary"></this.Button>`);
    await rerender()

    assert.ok(this.element.querySelector('button')?.getAttribute('class')?.includes('primary'));
  });

  test('should set as secondary', async function(this: TestContext&Context,assert) {
    await render(hbs`<this.Button @type="secondary"></this.Button>`);

    assert.ok(this.element.querySelector('button')?.getAttribute('class')?.includes('secondary'));
  });

  test('should show loading indicator for async click handler', async function(this: TestContext&Context,assert) {

    this.onClick = function() {
      return new Promise(res => setTimeout(res, 1000));
    };

    await render(hbs`<this.Button @onClick={{this.onClick}} @type="secondary"></this.Button>`);

    await click('button');

    assert.ok(this.element.querySelector('button')?.getAttribute('class')?.includes('secondary'));
  });
});
