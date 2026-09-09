import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import FileUploaderSkeleton from 'carbon-components-ember/components/file-uploader/file-uploader-skeleton';

module('Integration | Component | FileUploaderSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('renders the skeleton placeholders', async function (assert) {
    await render(<template><FileUploaderSkeleton /></template>);

    assert.dom('.cds--form-item').exists();
    assert.dom('.cds--skeleton__text').exists({ count: 2 });
    assert.dom('.cds--skeleton__heading').exists();
    assert.dom('.cds--skeleton.cds--btn').exists();
  });

  test('passes through html attributes', async function (assert) {
    await render(<template><FileUploaderSkeleton id='my-skeleton' /></template>);

    assert.dom('#my-skeleton').exists();
  });
});
