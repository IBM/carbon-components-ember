import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent, waitUntil } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import TruncatedText from '#src/components/ai-chat/truncated-text.gts';
import { waitForAnimationFrame } from '../../helpers';
import style from 'ember-style-modifier';

module('Integration | Component | ai-chat/TruncatedText', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders @value as plain text when short', async function (assert) {
    await render(
      <template>
        <div {{style width="200px"}}>
          <TruncatedText @value="Short text" @lines={{2}} />
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
        <div {{style width="100px"}}>
          <TruncatedText @value={{longValue}} @lines={{1}} />
        </div>
      </template>,
    );
    await waitForAnimationFrame();
    await waitForAnimationFrame();

    assert.dom('.cds--tooltip-trigger__wrapper').exists();
    assert.dom('.cds--tooltip-content').hasText(longValue);
  });

  test('it keeps watching the content after the tooltip replaces it', async function (assert) {
    const longValue = Array.from({ length: 40 }, () => 'word').join(' ');
    const width = tracked('100px');

    await render(
      <template>
        <div {{style width=width.value}}>
          <TruncatedText @value={{longValue}} @lines={{1}} />
        </div>
      </template>,
    );
    await waitUntil(() =>
      document.querySelector('.cds--tooltip-trigger__wrapper'),
    );

    width.value = '4000px';
    await waitUntil(
      () => !document.querySelector('.cds--tooltip-trigger__wrapper'),
      { timeout: 2000 },
    );

    assert.dom('.cds--tooltip-trigger__wrapper').doesNotExist();
  });

  test('it toggles expanded state on click when @type is expand', async function (assert) {
    const longValue = Array.from({ length: 40 }, () => 'word').join(' ');

    await render(
      <template>
        <div {{style width="100px"}}>
          <TruncatedText
            @value={{longValue}}
            @lines={{1}}
            @type="expand"
            @expandLabel="Show more"
            @collapseLabel="Show less"
          />
        </div>
      </template>,
    );
    await waitForAnimationFrame();
    await waitForAnimationFrame();

    assert.dom('.cds-aichat-truncated-text__toggle').hasText('Show more');
    assert
      .dom('.cds-aichat-truncated-text__toggle')
      .hasAttribute('aria-expanded', 'false');

    await click('.cds-aichat-truncated-text__toggle');
    assert.dom('.cds-aichat-truncated-text__toggle').hasText('Show less');
    assert
      .dom('.cds-aichat-truncated-text__toggle')
      .hasAttribute('aria-expanded', 'true');
    assert
      .dom('.cds-aichat-truncated-text__content')
      .hasClass('cds-aichat-truncated-text__content--expanded');

    await triggerKeyEvent(
      '.cds-aichat-truncated-text__toggle',
      'keydown',
      'Enter',
    );
    assert.dom('.cds-aichat-truncated-text__toggle').hasText('Show more');
  });

  test('it renders default block content instead of @value when passed', async function (assert) {
    await render(
      <template>
        <div {{style width="200px"}}>
          <TruncatedText @value="Tooltip text" @lines={{2}}>
            <strong>Rich content</strong>
          </TruncatedText>
        </div>
      </template>,
    );
    await waitForAnimationFrame();

    assert
      .dom('.cds-aichat-truncated-text__content strong')
      .hasText('Rich content');
  });
});
