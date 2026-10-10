import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import TagSkeleton from '#src/components/tag-skeleton.gts';

module('Integration | Component | TagSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a tag placeholder', async function (assert) {
    await render(<template><TagSkeleton data-test-skeleton /></template>);

    assert
      .dom('span[data-test-skeleton]')
      .hasClass('cds--tag')
      .hasClass('cds--skeleton');
  });

  test('should take a size', async function (assert) {
    await render(<template><TagSkeleton @size="sm" /></template>);

    assert
      .dom('.cds--tag')
      .hasClass('cds--tag--sm')
      .hasClass('cds--layout--size-sm');
  });
});
