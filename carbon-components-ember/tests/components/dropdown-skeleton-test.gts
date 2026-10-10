import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import DropdownSkeleton from '#src/components/dropdown-skeleton.gts';

module('Integration | Component | DropdownSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a label and field', async function (assert) {
    await render(<template><DropdownSkeleton data-test-skeleton /></template>);

    assert.dom('[data-test-skeleton]').hasClass('cds--form-item');
    assert.dom('.cds--label').exists();
    assert.dom('.cds--dropdown').hasClass('cds--skeleton');
  });

  test('should take a size and hide its label', async function (assert) {
    await render(
      <template><DropdownSkeleton @size="sm" @hideLabel={{true}} /></template>,
    );

    assert.dom('.cds--label').doesNotExist();
    assert.dom('.cds--dropdown').hasClass('cds--list-box--sm');
  });
});
