import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import SkeletonText from '#src/components/skeleton-text.gts';

module('Integration | Component | SkeletonText', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a single line by default', async function (assert) {
    await render(<template><SkeletonText /></template>);

    assert.dom('p.cds--skeleton__text').exists({ count: 1 });
  });

  test('should render at a larger, heading size', async function (assert) {
    await render(<template><SkeletonText @heading={{true}} /></template>);

    assert.dom('p.cds--skeleton__text.cds--skeleton__heading').exists();
  });

  test('should render multiple lines when paragraph is true', async function (assert) {
    await render(
      <template>
        <SkeletonText @paragraph={{true}} @lineCount={{4}} />
      </template>,
    );

    assert.dom('div > p.cds--skeleton__text').exists({ count: 4 });
  });

  test('should default to 3 lines when paragraph is true', async function (assert) {
    await render(<template><SkeletonText @paragraph={{true}} /></template>);

    assert.dom('div > p.cds--skeleton__text').exists({ count: 3 });
  });

  test('should apply the given width', async function (assert) {
    await render(<template><SkeletonText @width="75%" /></template>);

    assert.dom('p.cds--skeleton__text').hasAttribute('style', 'width: 75%;');
  });

  test('should pass through attributes on a single line', async function (assert) {
    await render(<template><SkeletonText class="custom-class" /></template>);

    assert.dom('p.cds--skeleton__text').hasClass('custom-class');
  });

  test('should pass attributes to every line', async function (assert) {
    await render(
      <template>
        <SkeletonText @paragraph={{true}} class="custom-class" />
      </template>,
    );

    assert.dom('p.cds--skeleton__text.custom-class').exists({ count: 3 });
    assert.dom('div.custom-class').doesNotExist();
  });
});
