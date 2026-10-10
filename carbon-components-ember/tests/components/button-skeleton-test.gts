import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import ButtonSkeleton from '#src/components/button-skeleton.gts';

module('Integration | Component | ButtonSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a large button by default', async function (assert) {
    await render(<template><ButtonSkeleton data-test-skeleton /></template>);

    assert
      .dom('[data-test-skeleton]')
      .hasClass('cds--skeleton')
      .hasClass('cds--btn')
      .hasClass('cds--btn--lg')
      .hasClass('cds--layout--size-lg');
  });

  test('should take a size', async function (assert) {
    await render(<template><ButtonSkeleton @size="sm" /></template>);

    assert
      .dom('.cds--btn')
      .hasClass('cds--btn--sm')
      .hasClass('cds--layout--size-sm');
  });

  test('should render a link with @href', async function (assert) {
    await render(<template><ButtonSkeleton @href="/save" /></template>);

    assert
      .dom('a.cds--skeleton.cds--btn')
      .hasClass('cds--btn--lg')
      .hasClass('cds--layout--size-lg')
      .hasAttribute('href', '/save')
      .hasAttribute('role', 'button');
    assert.dom('div.cds--btn').doesNotExist();
  });
});
