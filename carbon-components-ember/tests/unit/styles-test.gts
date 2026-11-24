import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';

module('Integration | Stylesheet | styles.scss', function (hooks) {
  setupRenderingTest(hooks);

  test("it has Carbon's type classes", async function (assert) {
    await render(
      <template>
        <p class="cds--type-heading-03">Title</p>
      </template>,
    );

    assert.dom('p').hasStyle({ fontSize: '20px', lineHeight: '28px' });
  });

  test("it has Carbon's spacing tokens on :root", function (assert) {
    const root = getComputedStyle(document.documentElement);

    assert.strictEqual(root.getPropertyValue('--cds-spacing-05'), '1rem');
    assert.strictEqual(root.getPropertyValue('--cds-spacing-13'), '10rem');
  });
});
