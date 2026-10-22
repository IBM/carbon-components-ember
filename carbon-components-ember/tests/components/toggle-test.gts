import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import Toggle from '#src/components/toggle.gts';

module('Integration | Component | Toggle', (hooks) => {
  setupRenderingTest(hooks);

  test('class and attributes go on the <button>, @className on the wrapper', async function (assert) {
    await render(
      <template>
        <Toggle
          @className="my-field"
          class="my-switch"
          id="mine"
          data-test-toggle
        />
      </template>,
    );

    assert.dom('.cds--toggle').hasClass('my-field');
    const button = find('button.cds--toggle__button')!;
    assert.dom(button).hasClass('my-switch').hasAttribute('data-test-toggle');
    // Its own id wins, so the label stays associated.
    assert.notStrictEqual(button.id, 'mine');
    assert.dom('.cds--toggle__label').hasAttribute('for', button.id);
  });
});
