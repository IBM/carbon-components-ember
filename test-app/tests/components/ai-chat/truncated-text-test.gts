import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent } from '@ember/test-helpers';
import AiChatTruncatedText from 'carbon-components-ember/components/ai-chat/truncated-text';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import { waitForAnimationFrame } from '../../helpers';

// `AiChatTruncatedText`'s overflow detection reads real `scrollHeight`/
// `clientHeight` off `.cds-aichat-truncated-text__content`, which only
// clamps to `@lines` once the real `-webkit-line-clamp` rule from this
// addon's own `src/styles/ai-chat/_truncated-text.scss` applies. That
// partial isn't part of `@carbon/styles`' prebuilt bundle (the one
// `?inline`-imported elsewhere in this test suite), and test-app's dev
// build doesn't reliably load a new component's own SCSS either - so the
// handful of rules the component actually depends on for clamping are
// reproduced here directly, scoped to this test file.
const lineClampStyle = `
  .cds-aichat-truncated-text__content {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--line-clamp-value, 1);
  }
`;

module('Integration | Component | ai-chat/AiChatTruncatedText', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders @value as plain text when short', async function (assert) {
    await render(
      <template>
        <style>{{carbonStyle.default}}</style>
        <style>{{lineClampStyle}}</style>
        <div style='width: 200px'>
          <AiChatTruncatedText @value='Short text' @lines={{2}} />
        </div>
      </template>,
    );
    await waitForAnimationFrame();

    assert.dom('.cds-aichat-truncated-text__content').hasText('Short text');
    assert.dom('.cds--tooltip-trigger__wrapper').doesNotExist();
  });

  test('it shows a tooltip with the full @value once the content overflows', async function (assert) {
    const longValue = Array.from({ length: 40 }, () => 'word').join(' ');

    await render(
      <template>
        <style>{{carbonStyle.default}}</style>
        <style>{{lineClampStyle}}</style>
        <div style='width: 100px'>
          <AiChatTruncatedText @value={{longValue}} @lines={{1}} />
        </div>
      </template>,
    );
    await waitForAnimationFrame();
    await waitForAnimationFrame();

    assert.dom('.cds--tooltip-trigger__wrapper').exists();
    assert.dom('.cds--tooltip-content').hasText(longValue);
  });

  test('it toggles expanded state on click when @type is expand', async function (assert) {
    const longValue = Array.from({ length: 40 }, () => 'word').join(' ');

    await render(
      <template>
        <style>{{carbonStyle.default}}</style>
        <style>{{lineClampStyle}}</style>
        <div style='width: 100px'>
          <AiChatTruncatedText
            @value={{longValue}}
            @lines={{1}}
            @type='expand'
            @expandLabel='Show more'
            @collapseLabel='Show less'
          />
        </div>
      </template>,
    );
    await waitForAnimationFrame();
    await waitForAnimationFrame();

    assert.dom('.cds-aichat-truncated-text__toggle').hasText('Show more');

    await click('.cds-aichat-truncated-text__toggle');
    assert.dom('.cds-aichat-truncated-text__toggle').hasText('Show less');
    assert
      .dom('.cds-aichat-truncated-text__content')
      .hasClass('cds-aichat-truncated-text__content--expanded');

    await triggerKeyEvent('.cds-aichat-truncated-text__toggle', 'keydown', 'Enter');
    assert.dom('.cds-aichat-truncated-text__toggle').hasText('Show more');
  });

  test('it disconnects the previous ResizeObserver when the overflow flip re-renders the content element', async function (assert) {
    const longValue = Array.from({ length: 40 }, () => 'word').join(' ');

    const observed: { disconnected: boolean }[] = [];
    const OriginalResizeObserver = window.ResizeObserver;
    class TrackingResizeObserver {
      state: { disconnected: boolean } = { disconnected: false };
      observer: ResizeObserver;

      constructor(callback: ResizeObserverCallback) {
        observed.push(this.state);
        this.observer = new OriginalResizeObserver(callback);
      }

      observe(target: Element, options?: ResizeObserverOptions) {
        this.observer.observe(target, options);
      }

      unobserve(target: Element) {
        this.observer.unobserve(target);
      }

      disconnect() {
        this.state.disconnected = true;
        this.observer.disconnect();
      }
    }
    window.ResizeObserver = TrackingResizeObserver as unknown as typeof ResizeObserver;

    try {
      await render(
        <template>
          <style>{{carbonStyle.default}}</style>
          <style>{{lineClampStyle}}</style>
          <div style='width: 100px'>
            <AiChatTruncatedText @value={{longValue}} @lines={{1}} />
          </div>
        </template>,
      );
      await waitForAnimationFrame();
      await waitForAnimationFrame();

      assert.dom('.cds--tooltip-trigger__wrapper').exists();
      assert.strictEqual(observed.length, 2, 'a second ResizeObserver is created for the tooltip-wrapped content');
      assert.true(observed[0]?.disconnected, 'the first (now-detached) ResizeObserver was disconnected');
      assert.false(observed[1]?.disconnected, 'the current ResizeObserver is still connected');
    } finally {
      window.ResizeObserver = OriginalResizeObserver;
    }
  });

  test('it renders default block content instead of @value when passed', async function (assert) {
    await render(
      <template>
        <style>{{carbonStyle.default}}</style>
        <style>{{lineClampStyle}}</style>
        <div style='width: 200px'>
          <AiChatTruncatedText @value='Tooltip text' @lines={{2}}>
            <strong>Rich content</strong>
          </AiChatTruncatedText>
        </div>
      </template>,
    );
    await waitForAnimationFrame();

    assert.dom('.cds-aichat-truncated-text__content strong').hasText('Rich content');
  });
});
