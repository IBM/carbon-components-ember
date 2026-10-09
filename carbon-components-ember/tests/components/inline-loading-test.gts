import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  find,
  render,
  rerender,
  settled,
  waitUntil,
} from '@ember/test-helpers';
import { trackedObject } from '@ember/reactive/collections';
import InlineLoading from '#src/components/inline-loading.gts';

module('Integration | Component | InlineLoading', (hooks) => {
  setupRenderingTest(hooks);

  test('is active by default, with a spinner labelled "loading"', async function (assert) {
    await render(<template><InlineLoading @description="Loading" /></template>);

    assert.dom('.cds--inline-loading').hasAttribute('aria-live', 'assertive');
    assert
      .dom('.cds--inline-loading__animation .cds--loading')
      .hasClass('cds--loading--small');
    assert.dom('.cds--loading__svg title').hasText('loading');
    assert.dom('.cds--inline-loading__text').hasText('Loading');
  });

  test('lays out the icon and text side by side', async function (assert) {
    await render(<template><InlineLoading @description="Saving" /></template>);

    assert.strictEqual(
      getComputedStyle(find('.cds--inline-loading') as Element).display,
      'flex',
    );
  });

  test('renders no text without @description', async function (assert) {
    await render(<template><InlineLoading /></template>);

    assert.dom('.cds--inline-loading__text').doesNotExist();
  });

  test('@iconDescription labels the icon', async function (assert) {
    await render(
      <template><InlineLoading @iconDescription="Loading data..." /></template>,
    );

    assert.dom('.cds--loading__svg title').hasText('Loading data...');
  });

  test('inactive shows no icon and turns aria-live off', async function (assert) {
    await render(<template><InlineLoading @status="inactive" /></template>);

    assert.dom('.cds--inline-loading').hasAttribute('aria-live', 'off');
    assert.dom('.cds--inline-loading__animation').doesNotExist();
    assert.dom('.cds--inline-loading__text').doesNotExist();
  });

  test('finished and error show icons labelled with the status', async function (assert) {
    const state = trackedObject({ status: 'finished' as 'finished' | 'error' });
    await render(
      <template>
        <InlineLoading @status={{state.status}} @successDelay={{0}} />
      </template>,
    );

    // Icons load their SVG asynchronously; settled() doesn't wait for it.
    await waitUntil(() => find('svg.cds--inline-loading__checkmark-container'));
    assert
      .dom('svg.cds--inline-loading__checkmark-container title')
      .hasText('finished');

    state.status = 'error';
    await waitUntil(() => find('svg.cds--inline-loading--error'));
    assert.dom('svg.cds--inline-loading--error title').hasText('error');
  });

  test('an aria-live attribute overrides the default', async function (assert) {
    await render(<template><InlineLoading aria-live="polite" /></template>);

    assert.dom('.cds--inline-loading').hasAttribute('aria-live', 'polite');
  });

  test('@onSuccess runs @successDelay ms after the status becomes finished', async function (assert) {
    const state = trackedObject({
      status: 'active' as 'active' | 'finished',
      calls: 0,
    });
    const onSuccess = () => state.calls++;
    await render(
      <template>
        <InlineLoading
          @status={{state.status}}
          @successDelay={{10}}
          @onSuccess={{onSuccess}}
        />
      </template>,
    );
    assert.strictEqual(state.calls, 0);

    state.status = 'finished';
    await settled();
    assert.strictEqual(state.calls, 1);
  });

  test('a @successDelay of 0 calls @onSuccess right away', async function (assert) {
    const state = trackedObject({ calls: 0 });
    const onSuccess = () => state.calls++;
    await render(
      <template>
        <InlineLoading
          @status="finished"
          @successDelay={{0}}
          @onSuccess={{onSuccess}}
        />
      </template>,
    );

    assert.strictEqual(state.calls, 1);
  });

  test('leaving finished before the delay cancels @onSuccess', async function (assert) {
    const state = trackedObject({
      status: 'active' as 'active' | 'finished',
      calls: 0,
    });
    const onSuccess = () => state.calls++;
    await render(
      <template>
        <InlineLoading
          @status={{state.status}}
          @successDelay={{1000}}
          @onSuccess={{onSuccess}}
        />
      </template>,
    );

    state.status = 'finished';
    // rerender() waits for rendering only; settled() would wait out the delay.
    await rerender();
    state.status = 'active';
    // settled() waits for a pending timer, so a timer that wasn't cancelled
    // would have run by now.
    await settled();
    assert.strictEqual(state.calls, 0);
  });
});
