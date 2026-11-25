import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import Form from '#src/components/form.gts';

module('Integration | Component | Form', (hooks) => {
  setupRenderingTest(hooks);

  test('renders a form with the cds--form class around its content', async function (assert) {
    await render(
      <template>
        <Form>Form content</Form>
      </template>,
    );

    assert.dom('form.cds--form').exists();
    assert.strictEqual(
      document.querySelector('form.cds--form')!.textContent,
      'Form content',
    );
  });

  test('passes attributes and classes to the form', async function (assert) {
    await render(
      <template>
        <Form class="custom-class" aria-label="new project setup" />
      </template>,
    );

    assert.dom('form').hasClass('cds--form').hasClass('custom-class');
    assert.dom('form').hasAttribute('aria-label', 'new project setup');
  });

  test('calls a submit handler given with {{on}}', async function (assert) {
    let submitted = false;
    const submit = (event: SubmitEvent) => {
      event.preventDefault();
      submitted = true;
    };

    await render(<template><Form {{on "submit" submit}} /></template>);
    await triggerEvent('form', 'submit');

    assert.true(submitted);
  });
});
