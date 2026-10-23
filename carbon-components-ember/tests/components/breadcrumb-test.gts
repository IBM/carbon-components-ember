import { module, test } from 'qunit';
import { setupApplicationTest, setupRenderingTest } from 'ember-qunit';
import { render, rerender, click, find } from '@ember/test-helpers';
import Breadcrumb from '#src/components/breadcrumb.gts';
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
  visitWith,
} from '../helpers';

module('Integration | Component | Breadcrumb', (hooks) => {
  setupRenderingTest(hooks);

  test('should accept an aria-label for the nav element', async function (assert) {
    await render(<template><Breadcrumb aria-label="test-label" /></template>);

    assert.dom('nav').hasAttribute('aria-label', 'test-label');
  });

  test('should provide a default aria-label for the nav element', async function (assert) {
    await render(<template><Breadcrumb /></template>);

    assert.dom('nav').hasAttribute('aria-label', 'Breadcrumb');
  });

  test('should render the BreadcrumbItems it yields', async function (assert) {
    await render(
      <template>
        <Breadcrumb as |BreadcrumbItem|>
          <BreadcrumbItem @href="#a">A</BreadcrumbItem>
          <BreadcrumbItem @href="#b">B</BreadcrumbItem>
          <BreadcrumbItem @href="#c">C</BreadcrumbItem>
        </Breadcrumb>
      </template>,
    );

    assert.dom('nav > ol.cds--breadcrumb > li.cds--breadcrumb-item').exists({
      count: 3,
    });
    assert.dom('li:nth-child(2) a.cds--link').hasText('B');
    assert.dom('li:nth-child(2) a').hasAttribute('href', '#b');
  });

  test('an item yields an OverflowMenu set up for a breadcrumb', async function (assert) {
    await render(
      <template>
        <style nonce={{nonce}}>
          .breadcrumb-test__center {
            padding-inline-start: 12rem;
          }
        </style>
        <div class="breadcrumb-test__center">
          <Breadcrumb as |BreadcrumbItem|>
            <BreadcrumbItem @href="#a">A</BreadcrumbItem>
            <BreadcrumbItem as |item|>
              <item.OverflowMenu as |OverflowMenuItem|>
                <OverflowMenuItem @itemText="B" />
              </item.OverflowMenu>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
      </template>,
    );

    assert
      .dom('.cds--overflow-menu svg circle[cy="16"]')
      .exists({ count: 3 }, 'the horizontal icon');
    await click('.cds--overflow-menu');
    const trigger = find('.cds--overflow-menu')!.getBoundingClientRect();
    const menu = find('.cds--breadcrumb-menu-options')!.getBoundingClientRect();
    const center = (rect: DOMRect) => rect.left + rect.width / 2;
    assert.true(Math.abs(center(menu) - center(trigger) - 59) < 1, 'left');
    assert.true(Math.abs(menu.top - trigger.bottom - 10) < 1, 'top');
  });

  test('should accept @noTrailingSlash', async function (assert) {
    await render(<template><Breadcrumb @noTrailingSlash={{true}} /></template>);

    assert.dom('ol').hasClass('cds--breadcrumb--no-trailing-slash');
  });

  test('should respect @size', async function (assert) {
    await render(<template><Breadcrumb @size="sm" /></template>);

    assert.dom('ol').hasClass('cds--breadcrumb--sm');
  });

  test('should put class and other attributes on the nav element', async function (assert) {
    await render(
      <template><Breadcrumb class="test" data-test-id="test" /></template>,
    );

    assert.dom('nav').hasClass('test');
    assert.dom('nav').hasAttribute('data-test-id', 'test');
  });

  module('BreadcrumbItem', function () {
    test('with @href, renders a link', async function (assert) {
      await render(
        <template>
          <Breadcrumb as |BreadcrumbItem|>
            <BreadcrumbItem @href="/test">Test</BreadcrumbItem>
          </Breadcrumb>
        </template>,
      );

      assert
        .dom('li a.cds--link')
        .hasAttribute('href', '/test')
        .hasText('Test');
      assert.dom('li a').doesNotHaveAttribute('aria-current');
    });

    test('without @href, renders text', async function (assert) {
      await render(
        <template>
          <Breadcrumb as |BreadcrumbItem|>
            <BreadcrumbItem>Test</BreadcrumbItem>
          </Breadcrumb>
        </template>,
      );

      assert.dom('li a').doesNotExist();
      assert.dom('li span.cds--link').hasText('Test');
    });

    test('@isCurrentPage marks the item and its link', async function (assert) {
      await render(
        <template>
          <Breadcrumb as |BreadcrumbItem|>
            <BreadcrumbItem @href="#" @isCurrentPage={{true}}>
              Test
            </BreadcrumbItem>
          </Breadcrumb>
        </template>,
      );

      assert.dom('li').hasClass('cds--breadcrumb-item--current');
      assert.dom('li a').hasAttribute('aria-current', 'true');
    });

    test('@ariaCurrent="page" marks the link, which Carbon styles as current', async function (assert) {
      await render(
        <template>
          <Breadcrumb as |BreadcrumbItem|>
            <BreadcrumbItem
              @href="#"
              @isCurrentPage={{true}}
              @ariaCurrent="page"
            >
              Test
            </BreadcrumbItem>
          </Breadcrumb>
        </template>,
      );

      assert.dom('li').doesNotHaveClass('cds--breadcrumb-item--current');
      assert.dom('li a').hasAttribute('aria-current', 'page');
    });

    test('with block params, the block renders its own link', async function (assert) {
      await render(
        <template>
          <Breadcrumb as |BreadcrumbItem|>
            <BreadcrumbItem @ariaCurrent="page" as |item|>
              <a
                href="/test"
                class="custom-link {{item.class}}"
                aria-current={{item.ariaCurrent}}
              >Test</a>
            </BreadcrumbItem>
          </Breadcrumb>
        </template>,
      );

      assert.dom('li > a').hasClass('cds--link').hasClass('custom-link');
      assert.dom('li > a').hasAttribute('aria-current', 'page');
      assert.dom('li span').doesNotExist();
    });

    test('with block params, the block renders as given', async function (assert) {
      await render(
        <template>
          <Breadcrumb as |BreadcrumbItem|>
            <BreadcrumbItem as |item|>
              <a href="/a" class={{item.class}}>A</a>
              <a href="/b" class={{item.class}}>B</a>
            </BreadcrumbItem>
          </Breadcrumb>
        </template>,
      );

      assert.dom('li > a.cds--link').exists({ count: 2 });
    });

    test('puts class and other attributes on the li', async function (assert) {
      await render(
        <template>
          <Breadcrumb as |BreadcrumbItem|>
            <BreadcrumbItem class="test" data-test-item>Test</BreadcrumbItem>
          </Breadcrumb>
        </template>,
      );

      assert.dom('li').hasClass('test').hasAttribute('data-test-item');
    });
  });

  test('white theme: should display items', async function (this: RenderingTestContext, assert) {
    disableCarbonStyles();
    await render(
      <template>
        <Breadcrumb as |BreadcrumbItem|>
          <BreadcrumbItem @href="#">a</BreadcrumbItem>
          <BreadcrumbItem @href="#" @isCurrentPage={{true}}>b</BreadcrumbItem>
          <BreadcrumbItem @href="#">c</BreadcrumbItem>
        </Breadcrumb>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    enableCarbonStyles();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    assert.equal(styles.length, 24);

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should have correct initial styles');
  });

  test('dark theme: should display items', async function (this: RenderingTestContext, assert) {
    // Carbon stays on: this snapshot is the switch from white to dark.
    const darkStyleValue = tracked('');
    await render(
      <template>
        <Breadcrumb as |BreadcrumbItem|>
          <BreadcrumbItem @href="#">a</BreadcrumbItem>
          <BreadcrumbItem @href="#" @isCurrentPage={{true}}>b</BreadcrumbItem>
          <BreadcrumbItem @href="#">c</BreadcrumbItem>
        </Breadcrumb>
        <style nonce={{nonce}}>
          {{darkStyleValue.value}}
        </style>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    darkStyleValue.value = carbonDarkStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    assert.equal(styles.length, 24);

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should correctly switch to dark styles');
  });

  test('should change the current item style', async function (this: RenderingTestContext, assert) {
    const current = tracked('');
    const isCurrent = (crumb: string) => current.value === crumb;
    await render(
      <template>
        <Breadcrumb as |BreadcrumbItem|>
          <BreadcrumbItem @href="#" @isCurrentPage={{isCurrent "a"}}>
            a
          </BreadcrumbItem>
          <BreadcrumbItem @href="#" @isCurrentPage={{isCurrent "b"}}>
            b
          </BreadcrumbItem>
          <BreadcrumbItem @href="#" @isCurrentPage={{isCurrent "c"}}>
            c
          </BreadcrumbItem>
        </Breadcrumb>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    current.value = 'a';
    await rerender();
    await waitForAnimationFrame();
    const aCurrentStyle = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    current.value = 'b';
    await rerender();
    await waitForAnimationFrame();
    const bCurrentStyle = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiffA = getStylesDiff(styles, aCurrentStyle);
    const stylesDiffB = getStylesDiff(aCurrentStyle, bCurrentStyle);

    assert.snapshot(stylesDiffA, 'does have correct initial styles');
    assert.snapshot(
      stylesDiffB,
      'does correctly change styles after selection',
    );
  });
});

module('Integration | Component | Breadcrumb > with @route', function (hooks) {
  setupApplicationTest(hooks);
  setupRoutes(hooks);

  test('an item links to its route', async function (assert) {
    const models = ['7'];
    await visitWith(
      this,
      <template>
        <Breadcrumb as |BreadcrumbItem|>
          <BreadcrumbItem
            @route="user"
            @models={{models}}
          >Grace</BreadcrumbItem>
        </Breadcrumb>
      </template>,
    );
    assert
      .dom('.cds--breadcrumb-item a.cds--link')
      .hasAttribute('href', '/users/7');
  });
});
