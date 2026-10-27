import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import AspectRatio from '#src/components/aspect-ratio.gts';

module('Integration | Component | AspectRatio', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a square div by default', async function (assert) {
    await render(
      <template>
        <AspectRatio class="extra">Content</AspectRatio>
      </template>,
    );
    assert
      .dom('div.cds--aspect-ratio')
      .hasClass('cds--aspect-ratio--1x1')
      .hasClass('extra')
      .hasText('Content');
  });

  test('@ratio and @as set the ratio and the element', async function (assert) {
    await render(
      <template><AspectRatio @ratio="16x9" @as="section" /></template>,
    );
    assert.dom('section.cds--aspect-ratio').hasClass('cds--aspect-ratio--16x9');
  });
});
