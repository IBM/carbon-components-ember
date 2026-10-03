import { module, test } from 'qunit';
import type { RenderingTestContext } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Portal from '#src/components/portal.gts';

module('Integration | Component | Portal', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders its content into a custom container', async function (this: RenderingTestContext, assert) {
    const container = document.createElement('div');
    document.body.appendChild(container);

    await render(
      <template>
        <Portal @container={{container}}>
          <span data-test-portal-content>Hello</span>
        </Portal>
      </template>,
    );

    const content = container.querySelector('[data-test-portal-content]');
    assert.dom(content).exists();
    assert.dom(content).hasText('Hello');
    assert.notOk(
      this.element.querySelector('[data-test-portal-content]'),
      'content is not rendered in place',
    );
  });

  test('it keeps what is already in the container', async function (assert) {
    const container = document.createElement('div');
    container.innerHTML = '<p data-test-existing>Existing</p>';
    document.body.appendChild(container);

    await render(
      <template>
        <Portal @container={{container}}>
          <span data-test-portal-content>Hello</span>
        </Portal>
      </template>,
    );

    assert.dom('[data-test-existing]', container).hasText('Existing');
    assert.dom('[data-test-portal-content]', container).hasText('Hello');
    container.remove();
  });

  test('without @container it appends to document.body', async function (assert) {
    await render(
      <template>
        <Portal>
          <span data-test-body-portal>In body</span>
        </Portal>
      </template>,
    );

    const content = document.querySelector('[data-test-body-portal]');
    assert.strictEqual(content?.parentElement, document.body);
    assert.ok(
      document.getElementById('qunit-fixture'),
      'the rest of the page is left in place',
    );
  });
});
