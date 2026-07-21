import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Portal from 'carbon-components-ember/components/portal';

module('Integration | Component | Portal', (hooks) => {
  setupRenderingTest(hooks);

  // Note: there is no test here for the default (no `@container`) case,
  // which portals into `document.body`. Doing so via a real `render()` call
  // corrupts `#qunit-fixture` on teardown and breaks every test that runs
  // afterwards in the same suite - an interaction between `{{in-element}}`
  // targeting `document.body` and the rendering-test harness itself, not a
  // problem with the component. The fallback is a single `?? document.body`
  // expression; the container test below covers the actual portal
  // mechanism end-to-end.
  test('it renders its content into a custom container', async function (assert) {
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
});
