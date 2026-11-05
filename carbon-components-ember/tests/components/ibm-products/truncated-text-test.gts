import { module, test } from 'qunit';
import { tracked } from '@glimmer/tracking';
import { setupRenderingTest } from 'ember-qunit';
import {
  click,
  render,
  settled,
  triggerKeyEvent,
  waitUntil,
} from '@ember/test-helpers';
import TruncatedText from '#src/components/ibm-products/truncated-text.gts';
import { nonce } from '../../helpers';

const LONG =
  'Buttons are used to initialize an action, either in the background or foreground of an experience. There are several kinds of buttons.';

const clamp = () =>
  document
    .querySelector<HTMLElement>('.c4p--truncated-text__text-content')
    ?.style.getPropertyValue('-webkit-line-clamp');

module(
  'Integration | Component | IBM Products | TruncatedText',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it shows text that fits as it is', async function (assert) {
      await render(
        <template>
          <TruncatedText @value="Virtual machine" class="extra" data-test />
        </template>,
      );
      await waitUntil(() => clamp() === '2');

      assert
        .dom('.c4p--truncated-text')
        .hasClass('extra')
        .hasAttribute('data-test');
      assert
        .dom('.c4p--truncated-text__text-content')
        .hasText('Virtual machine')
        .hasAttribute('id', /^c4p--truncated-text-default-id-/);
      assert.dom('button').doesNotExist();
      assert.dom('[role="button"]').doesNotExist();
    });

    test('the tooltip variant shows cut-off text in a tooltip', async function (assert) {
      await render(
        <template>
          <style nonce={{nonce}}>
            .narrow {
              width: 120px;
            }
          </style>
          <div class="narrow">
            <TruncatedText @value={{LONG}} @lines={{1}} @id="text" />
          </div>
        </template>,
      );
      await waitUntil(() =>
        document.querySelector('.c4p--truncated-text__tooltip-trigger'),
      );

      assert
        .dom('.c4p--truncated-text__tooltip-trigger')
        .hasAttribute('type', 'button')
        .hasAttribute('aria-label', LONG);
      assert
        .dom('.c4p--truncated-text__tooltip-trigger #text')
        .hasClass('c4p--truncated-text__text-content');
      assert.strictEqual(clamp(), '1');
      assert.dom('.cds--popover-container.cds--popover--top').exists();
      assert.dom('.cds--tooltip-content').hasText(LONG);
    });

    test('the expand variant toggles cut-off text', async function (assert) {
      await render(
        <template>
          <style nonce={{nonce}}>
            .narrow {
              width: 120px;
            }
          </style>
          <div class="narrow">
            <TruncatedText
              @value={{LONG}}
              @type="expand"
              @id="text"
              @expandLabel="View more"
              @collapseLabel="View less"
            />
          </div>
        </template>,
      );
      await waitUntil(() => document.querySelector('[role="button"]'));

      assert.dom('.c4p--truncated-text__tooltip-trigger').doesNotExist();
      assert
        .dom('[role="button"]')
        .hasClass('c4p--truncated-text__expand-toggle')
        .hasAttribute('tabindex', '0')
        .hasAttribute('aria-controls', 'text')
        .hasAttribute('aria-expanded', 'false')
        .hasText('View more');
      assert.strictEqual(clamp(), '2');

      await click('[role="button"]');
      assert
        .dom('[role="button"]')
        .hasAttribute('aria-expanded', 'true')
        .hasText('View less');
      assert
        .dom('#text')
        .hasClass('c4p--truncated-text__text-content--expanded');
      assert.strictEqual(clamp(), 'none');

      await triggerKeyEvent('[role="button"]', 'keydown', 'Enter');
      assert.dom('[role="button"]').hasAttribute('aria-expanded', 'false');
      assert
        .dom('#text')
        .doesNotHaveClass('c4p--truncated-text__text-content--expanded');

      await triggerKeyEvent('[role="button"]', 'keydown', ' ');
      assert.dom('[role="button"]').hasAttribute('aria-expanded', 'true');

      await triggerKeyEvent('[role="button"]', 'keydown', 'Shift');
      assert.dom('[role="button"]').hasAttribute('aria-expanded', 'true');

      // The toggle stays once the text is expanded and no longer cut off.
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await settled();
      assert.dom('[role="button"]').exists();
    });

    test('it measures again when the text changes', async function (assert) {
      const value = tracked(LONG);

      await render(
        <template>
          <style nonce={{nonce}}>
            .narrow {
              width: 120px;
            }
          </style>
          <div class="narrow">
            <TruncatedText @value={{value.value}} @lines={{1}} />
          </div>
        </template>,
      );
      await waitUntil(() =>
        document.querySelector('.c4p--truncated-text__tooltip-trigger'),
      );

      value.value = 'Short';
      await waitUntil(
        () => !document.querySelector('.c4p--truncated-text__tooltip-trigger'),
      );
      assert.dom('.c4p--truncated-text__text-content').hasText('Short');
    });
  },
);
