import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import AILabel from '#src/components/ai-label.gts';

module('Integration | Component | AILabel', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a default label', async function (assert) {
    await render(<template><AILabel data-test-label /></template>);

    assert.dom('[data-test-label]').hasClass('cds--ai-label');
    assert
      .dom('.cds--ai-label__button')
      .hasClass('cds--ai-label__button--xs')
      .hasClass('cds--ai-label__button--default')
      .hasAttribute('aria-expanded', 'false');
    assert.dom('.cds--ai-label__text').hasText('AI');
    assert
      .dom('.cds--ai-label__button')
      .hasAria('label', 'AI Show information');
  });

  test('should take its text, size and label from args', async function (assert) {
    await render(
      <template>
        <AILabel @aiText="KI" @size="mini" @ariaLabel="Mehr erfahren" />
      </template>,
    );

    assert.dom('.cds--ai-label__text').hasText('KI');
    assert
      .dom('.cds--ai-label__button')
      .hasClass('cds--ai-label__button--mini')
      .hasAria('label', 'KI Mehr erfahren');
  });

  test('should show an inline label with its text', async function (assert) {
    await render(
      <template>
        <AILabel @kind="inline" @size="md" @textLabel="Text goes here" />
      </template>,
    );

    assert
      .dom('.cds--ai-label__button')
      .hasClass('cds--ai-label__button--inline')
      .hasClass('cds--ai-label__button--inline-with-content')
      .hasText('AI Text goes here');
    assert.dom('.cds--ai-label__additional-text').hasText('Text goes here');
  });

  test('should open its content and actions', async function (assert) {
    await render(
      <template>
        <AILabel as |label|>
          <label.Content data-test-content>
            <p>Explanation</p>
            <label.Actions data-test-actions>
              <button type="button">View details</button>
            </label.Actions>
          </label.Content>
        </AILabel>
      </template>,
    );

    await click('.cds--ai-label__button');

    assert.dom('.cds--ai-label__button').hasAttribute('aria-expanded', 'true');
    assert.dom('[data-test-content]').hasClass('cds--ai-label-content');
    assert.dom('[data-test-content]').containsText('Explanation');
    assert.dom('[data-test-actions]').hasClass('cds--ai-label-actions');
  });

  test('should show a revert button in place of the label', async function (assert) {
    const onRevertClick = () => assert.step('revert');

    await render(
      <template>
        <AILabel @revertActive={{true}} @onRevertClick={{onRevertClick}} />
      </template>,
    );

    assert.dom('.cds--ai-label').hasClass('cds--ai-label--revert');
    assert.dom('.cds--ai-label__button').doesNotExist();

    await click('button[aria-label="Revert to AI input"]');
    assert.verifySteps(['revert']);
  });
});
