import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render, settled } from '@ember/test-helpers';
import Button from '#src/components/button.gts';
import ButtonSet from '#src/components/button-set.gts';
import { waitForAnimationFrame } from '../helpers';

module('Integration | Component | ButtonSet', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders its buttons side by side', async function (assert) {
    await render(
      <template>
        <ButtonSet class="extra">
          <Button @kind="secondary">Cancel</Button>
          <Button>Save</Button>
        </ButtonSet>
      </template>,
    );

    assert
      .dom('div.cds--btn-set')
      .hasClass('extra')
      .doesNotHaveClass('cds--btn-set--stacked')
      .doesNotHaveClass('cds--btn-set--fluid');
    assert.dom('.cds--btn-set > .cds--btn').exists({ count: 2 });
  });

  test('@stacked stacks them', async function (assert) {
    await render(
      <template>
        <ButtonSet @stacked={{true}}><Button>Save</Button></ButtonSet>
      </template>,
    );

    assert.dom('.cds--btn-set').hasClass('cds--btn-set--stacked');
  });

  test('a fluid set stacks when its container is too narrow', async function (assert) {
    await render(
      <template>
        <div id="container">
          <ButtonSet @fluid={{true}} @stacked={{true}}>
            <Button @kind="secondary">Cancel</Button>
            <Button>Save</Button>
          </ButtonSet>
        </div>
      </template>,
    );
    const container = find('#container') as HTMLElement;
    const resize = async (width: string) => {
      container.style.inlineSize = width;
      await waitForAnimationFrame();
      await settled();
    };

    await resize('800px');
    assert
      .dom('.cds--btn-set')
      .hasClass('cds--btn-set--fluid')
      .doesNotHaveClass('cds--btn-set--stacked', 'ignores @stacked');
    assert.dom('.cds--btn-set__fluid-inner > .cds--btn').exists({ count: 2 });

    await resize('200px');
    assert.dom('.cds--btn-set').hasClass('cds--btn-set--stacked');
  });
});
