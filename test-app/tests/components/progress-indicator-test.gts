import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import { cell } from 'ember-resources';
import ProgressIndicator from 'carbon-components-ember/components/progress-indicator';

module('Integration | Component | ProgressIndicator', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a list of steps', async function (assert) {
    await render(
      <template>
        <ProgressIndicator @currentIndex={{1}} as |Step|>
          <Step @label='First step' />
          <Step @label='Second step' />
          <Step @label='Third step' />
        </ProgressIndicator>
      </template>,
    );

    assert.dom('ul.cds--progress').exists();
    assert.dom('li.cds--progress-step').exists({ count: 3 });
  });

  test('should mark steps before currentIndex as complete', async function (assert) {
    await render(
      <template>
        <ProgressIndicator @currentIndex={{1}} as |Step|>
          <Step @label='First step' />
          <Step @label='Second step' />
          <Step @label='Third step' />
        </ProgressIndicator>
      </template>,
    );

    const steps = this.element.querySelectorAll('li.cds--progress-step');
    assert.dom(steps[0]).hasClass('cds--progress-step--complete');
    assert.dom(steps[1]).hasClass('cds--progress-step--current');
    assert.dom(steps[2]).hasClass('cds--progress-step--incomplete');
  });

  test('should render a vertical progress indicator', async function (assert) {
    await render(
      <template>
        <ProgressIndicator @vertical={{true}} as |Step|>
          <Step @label='First step' />
        </ProgressIndicator>
      </template>,
    );

    assert.dom('ul.cds--progress').hasClass('cds--progress--vertical');
  });

  test('should space steps equally', async function (assert) {
    await render(
      <template>
        <ProgressIndicator @spaceEqually={{true}} as |Step|>
          <Step @label='First step' />
        </ProgressIndicator>
      </template>,
    );

    assert.dom('ul.cds--progress').hasClass('cds--progress--space-equal');
  });

  test('should render invalid and disabled steps', async function (assert) {
    await render(
      <template>
        <ProgressIndicator @currentIndex={{1}} as |Step|>
          <Step @label='First step' @invalid={{true}} />
          <Step @label='Second step' @disabled={{true}} />
        </ProgressIndicator>
      </template>,
    );
    await settled();

    const steps = this.element.querySelectorAll('li.cds--progress-step');
    assert.dom(steps[0]?.querySelector('svg')).hasClass('cds--progress__warning');
    assert.dom(steps[1]).hasClass('cds--progress-step--disabled');
    assert.dom(steps[1]?.querySelector('button')).isDisabled();
  });

  test('should call onChange with the clicked step index', async function (assert) {
    const currentIndex = cell(1);
    const onChange = (index: number) => (currentIndex.current = index);

    await render(
      <template>
        <ProgressIndicator
          @currentIndex={{currentIndex.current}}
          @onChange={{onChange}}
          as |Step|
        >
          <Step @label='First step' />
          <Step @label='Second step' />
          <Step @label='Third step' />
        </ProgressIndicator>
      </template>,
    );

    const steps = this.element.querySelectorAll('li.cds--progress-step button');
    await click(steps[0]!);
    assert.strictEqual(currentIndex.current, 0);

    await click(steps[2]!);
    assert.strictEqual(currentIndex.current, 2);
  });

  test('should not call onChange when clicking the current step', async function (assert) {
    let called = false;
    const onChange = () => (called = true);

    await render(
      <template>
        <ProgressIndicator @currentIndex={{1}} @onChange={{onChange}} as |Step|>
          <Step @label='First step' />
          <Step @label='Second step' />
        </ProgressIndicator>
      </template>,
    );

    const steps = this.element.querySelectorAll('li.cds--progress-step button');
    await click(steps[1]!);
    assert.false(called, 'onChange should not be called');
  });

  test('should render secondary label', async function (assert) {
    await render(
      <template>
        <ProgressIndicator as |Step|>
          <Step @label='First step' @secondaryLabel='Optional' />
        </ProgressIndicator>
      </template>,
    );

    assert.dom('.cds--progress-optional').hasText('Optional');
  });
});
