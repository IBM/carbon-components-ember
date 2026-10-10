import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import CodeSnippetSkeleton from '#src/components/code-snippet-skeleton.gts';

module('Integration | Component | CodeSnippetSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a single line by default', async function (assert) {
    await render(
      <template><CodeSnippetSkeleton data-test-skeleton /></template>,
    );

    assert
      .dom('[data-test-skeleton]')
      .hasClass('cds--snippet')
      .hasClass('cds--skeleton')
      .hasClass('cds--snippet--single');
    assert.dom('.cds--snippet-container span').exists({ count: 1 });
  });

  test('should render three lines for multi', async function (assert) {
    await render(<template><CodeSnippetSkeleton @type="multi" /></template>);

    assert.dom('.cds--snippet').hasClass('cds--snippet--multi');
    assert.dom('.cds--snippet-container span').exists({ count: 3 });
  });
});
