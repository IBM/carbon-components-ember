import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, rerender } from '@ember/test-helpers';
import ProgressBar from '#src/components/progress-bar.gts';
import { tracked } from '@glimmer/tracking';

module('Integration | Component | ProgressBar', (hooks) => {
  setupRenderingTest(hooks);

  test('@hideLabel visually hides the label', async function (assert) {
    await render(
      <template>
        <ProgressBar @label="Loading" @value={{10}} @hideLabel={{true}} />
      </template>,
    );
    assert.dom('.cds--progress-bar__label').hasClass('cds--visually-hidden');
  });

  test('label is visible by default', async function (assert) {
    await render(
      <template><ProgressBar @label="Loading" @value={{10}} /></template>,
    );
    assert
      .dom('.cds--progress-bar__label')
      .doesNotHaveClass('cds--visually-hidden');
  });

  test('a value above @max is clamped to max', async function (assert) {
    await render(
      <template>
        <ProgressBar @label="L" @value={{150}} @max={{100}} />
      </template>,
    );
    assert
      .dom('.cds--progress-bar__track')
      .hasAttribute('aria-valuenow', '100');
    assert
      .dom('.cds--progress-bar__bar')
      .hasAttribute('style', 'transform: scaleX(1);');
  });

  test('a negative value is clamped to 0', async function (assert) {
    await render(<template><ProgressBar @label="L" @value={{-5}} /></template>);
    assert.dom('.cds--progress-bar__track').hasAttribute('aria-valuenow', '0');
    assert
      .dom('.cds--progress-bar__bar')
      .hasAttribute('style', 'transform: scaleX(0);');
  });

  test('an active bar without a value is indeterminate', async function (assert) {
    await render(<template><ProgressBar @label="L" /></template>);
    assert
      .dom('.cds--progress-bar')
      .hasClass('cds--progress-bar--indeterminate');
    assert
      .dom('.cds--progress-bar__track')
      .doesNotHaveAttribute('aria-valuemin')
      .doesNotHaveAttribute('aria-valuemax')
      .doesNotHaveAttribute('aria-valuenow')
      .hasAttribute('aria-busy', 'true');
  });

  test("an explicit @status='indeterminate' ignores @value", async function (assert) {
    await render(
      <template>
        <ProgressBar @label="L" @status="indeterminate" @value={{40}} />
      </template>,
    );
    assert
      .dom('.cds--progress-bar')
      .hasClass('cds--progress-bar--indeterminate');
    assert.dom('.cds--progress-bar__bar').doesNotHaveAttribute('style');
    assert
      .dom('.cds--progress-bar__track')
      .doesNotHaveAttribute('aria-valuenow');
  });

  test('helper text is described and its sentinel flips to Done when finished', async function (assert) {
    const status = tracked<'active' | 'finished'>('active');
    await render(
      <template>
        <ProgressBar
          @label="L"
          @value={{50}}
          @helperText="Helping"
          @status={{status.value}}
        />
      </template>,
    );
    const helper = document.querySelector(
      '.cds--progress-bar__helper-text',
    ) as HTMLElement;
    assert.ok(helper.id, 'helper text has an id');
    assert
      .dom('.cds--progress-bar__track')
      .hasAttribute('aria-describedby', helper.id);
    assert
      .dom('.cds--progress-bar__helper-text .cds--visually-hidden')
      .hasText('Loading');

    status.value = 'finished';
    await rerender();
    assert
      .dom('.cds--progress-bar__helper-text .cds--visually-hidden')
      .hasText('Done');
  });

  test('it renders the label, helper text and progress', async function (assert) {
    await render(
      <template>
        <ProgressBar
          @label="Uploading files"
          @helperText="75 MB of 100 MB"
          @value={{75}}
          @max={{100}}
        />
      </template>,
    );

    assert.dom('.cds--progress-bar__label-text').hasText('Uploading files');
    assert
      .dom('.cds--progress-bar__helper-text')
      .containsText('75 MB of 100 MB');
    assert
      .dom('.cds--progress-bar__track')
      .hasAttribute('role', 'progressbar')
      .hasAttribute('aria-valuenow', '75')
      .hasAttribute('aria-valuemax', '100');
    assert
      .dom('.cds--progress-bar__bar')
      .hasAttribute('style', 'transform: scaleX(0.75);');
  });
});
