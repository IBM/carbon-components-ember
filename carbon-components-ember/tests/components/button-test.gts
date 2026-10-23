import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find, rerender } from '@ember/test-helpers';
import Button from '#src/components/button.gts';
import Add from '#src/components/icons/add.ts';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import { tracked } from '@glimmer/tracking';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
  disableCarbonStyles,
  enableCarbonStyles,
  nonce,
  setupRoutes,
} from '../helpers';

module('Integration | Component | Button', (hooks) => {
  setupRenderingTest(hooks);

  test('a type="submit" Button submits its form', async function (assert) {
    const submits: string[] = [];
    const onSubmit = (event: SubmitEvent) => {
      event.preventDefault();
      submits.push(event.submitter?.textContent?.trim() ?? '');
    };
    await render(
      <template>
        <form aria-label="Save or cancel" {{on "submit" onSubmit}}>
          <Button>Cancel</Button>
          <Button type="submit">Save</Button>
        </form>
      </template>,
    );

    await click('button[type="button"]');
    await click('button[type="submit"]');
    assert.deepEqual(submits, ['Save'], 'only the submit button submits');
  });

  test('white theme: should display button', async function (this: RenderingTestContext, assert) {
    disableCarbonStyles();
    await render(
      <template>
        <Button @kind="primary">Button</Button>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    enableCarbonStyles();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should have correct initial styles');
  });

  test('dark theme: should display button', async function (this: RenderingTestContext, assert) {
    disableCarbonStyles();
    const darkStyleValue = tracked('');
    await render(
      <template>
        <Button @kind="primary">Button</Button>
        <style nonce={{nonce}}>
          {{darkStyleValue.value}}
        </style>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    enableCarbonStyles();
    darkStyleValue.value = carbonDarkStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should correctly switch to dark styles');
  });

  test('should change button kind style', async function (this: RenderingTestContext, assert) {
    const kind = tracked<'primary' | 'secondary'>('primary');
    await render(
      <template>
        <Button @kind={{kind.value}}>Button</Button>
      </template>,
    );

    await waitForAnimationFrame();
    const primaryStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    kind.value = 'secondary';
    await rerender();
    await waitForAnimationFrame();
    const secondaryStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiff = getStylesDiff(primaryStyles, secondaryStyles);

    assert.snapshot(
      stylesDiff,
      'should correctly change styles when kind is changed',
    );
  });

  test('an unset @size adds no size classes', async function (assert) {
    const size = undefined;
    await render(
      <template>
        <Button @size={{size}}>Go</Button>
      </template>,
    );

    const button = document.querySelector('#ember-testing button')!;
    assert.false(
      button.className.includes('undefined'),
      `no "undefined" class (got "${button.className}")`,
    );
  });

  test('a click handler gets the click event', async function (assert) {
    const events: MouseEvent[] = [];
    const onClick = (event: MouseEvent) => events.push(event);
    await render(
      <template>
        <Button {{on "click" onClick}}>Go</Button>
      </template>,
    );

    await click('button');
    assert.strictEqual(events.length, 1);
    assert.true(events[0] instanceof MouseEvent);
  });

  test('@href renders a link, and a disabled button with @disabled', async function (assert) {
    const disabled = tracked(false);
    await render(
      <template>
        <Button @href="#docs" @disabled={{disabled.value}}>Docs</Button>
      </template>,
    );

    assert.dom('a.cds--btn').hasAttribute('href', '#docs');
    assert.dom('a').doesNotHaveAttribute('type');

    disabled.value = true;
    await rerender();
    assert.dom('a').doesNotExist();
    assert.dom('button.cds--btn').isDisabled().doesNotHaveAttribute('href');
  });

  test('@hasIconOnly shows the icon in a tooltip that names the button', async function (assert) {
    await render(
      <template>
        <Button
          @kind="ghost"
          @hasIconOnly={{true}}
          @renderIcon={{Add}}
          @iconDescription="Add item"
          @isSelected={{true}}
        />
      </template>,
    );

    assert.dom('.cds--icon-tooltip button').hasClass('cds--btn--icon-only');
    const label = find('button')?.getAttribute('aria-labelledby');
    assert.dom(`[id="${label}"]`).hasText('Add item', 'the tooltip names it');
    assert.dom('button').hasAttribute('aria-pressed', 'true');
    assert.dom('button svg').doesNotHaveAttribute('class');
  });

  test('@tooltipPosition and @tooltipAlignment place an icon-only tooltip', async function (assert) {
    const position = tracked<'top' | 'left'>('top');
    await render(
      <template>
        <Button
          @hasIconOnly={{true}}
          @renderIcon={{Add}}
          @iconDescription="Add"
          @tooltipPosition={{position.value}}
          @tooltipAlignment="end"
          @tooltipDropShadow={{true}}
          @tooltipHighContrast={{false}}
        />
      </template>,
    );

    assert
      .dom('.cds--icon-tooltip')
      .hasClass('cds--popover--top-end')
      .hasClass('cds--popover--drop-shadow')
      .doesNotHaveClass('cds--popover--high-contrast');

    position.value = 'left';
    await rerender();
    assert
      .dom('.cds--icon-tooltip')
      .hasClass('cds--popover--left', 'a side position ignores the alignment');
  });

  test('@as renders another element', async function (assert) {
    await render(
      <template>
        <Button @as="div">Go</Button>
      </template>,
    );

    assert.dom('div.cds--btn.cds--btn--primary').hasText('Go');
  });

  test('@dangerDescription describes a danger button only', async function (assert) {
    const kind = tracked<'danger' | 'primary'>('danger');
    await render(
      <template>
        <Button @kind={{kind.value}} @dangerDescription="Deletes the project">
          Delete
        </Button>
      </template>,
    );

    const description = find('button')?.getAttribute('aria-describedby');
    assert
      .dom(`[id="${description}"]`)
      .hasClass('cds--visually-hidden')
      .hasText('Deletes the project');

    kind.value = 'primary';
    await rerender();
    assert.dom('button').doesNotHaveAttribute('aria-describedby');
    assert.dom('.cds--visually-hidden').doesNotExist();
  });

  test('@renderIcon shows the icon after the label', async function (assert) {
    await render(
      <template>
        <Button @renderIcon={{Add}}>Add</Button>
      </template>,
    );

    assert.dom('button svg').hasClass('cds--btn__icon');
    assert.strictEqual(
      find('button')?.lastElementChild,
      find('button svg'),
      'the icon comes last',
    );
  });

  test('cannot click disabled and has correct styles', async function (this: RenderingTestContext, assert) {
    const onClick = () => {
      // Should not be called
    };

    const disabled = tracked(false);

    await render(
      <template>
        <Button
          @kind="primary"
          @disabled={{disabled.value}}
          {{on "click" onClick}}
        >
          Button
        </Button>
      </template>,
    );

    await waitForAnimationFrame();
    const enabledStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    disabled.value = true;
    await rerender();
    await waitForAnimationFrame();
    const disabledStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiff = getStylesDiff(enabledStyles, disabledStyles);
    assert.snapshot(stylesDiff, 'should have correct disabled styles');

    try {
      await click('button');
    } catch (e) {
      assert.ok(
        (e as Error).message.includes('Can not `click` disabled'),
        'error message is correct when clicking disabled button',
      );
    }

    assert
      .dom('button')
      .hasClass(
        'cds--btn--disabled',
        'class names should include cds--btn--disabled',
      );
  });

  module('with @route', function (hooks) {
    setupRoutes(hooks);

    test('renders a link to the route, styled as a button', async function (assert) {
      await render(
        <template>
          <Button @route="settings">Settings</Button>
        </template>,
      );
      assert.dom('a.cds--btn').hasAttribute('href', '/settings');

      await click('a.cds--btn');
      const router = this.owner.lookup('service:router');
      assert.strictEqual(router.currentRouteName, 'settings');
    });

    test('a disabled one is a disabled button', async function (assert) {
      await render(
        <template>
          <Button @route="settings" @disabled={{true}}>Settings</Button>
        </template>,
      );
      assert.dom('a').doesNotExist();
      assert.dom('button.cds--btn').isDisabled();
    });
  });
});
