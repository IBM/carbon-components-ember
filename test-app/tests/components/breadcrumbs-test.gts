import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, rerender, pauseTest } from '@ember/test-helpers';
import Breadcrumbs from 'carbon-components-ember/components/breadcrumbs';
import { array } from '@ember/helper';
import { cell } from 'ember-resources';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import { getAllElementComputedStyles, getStylesDiff, waitForAnimationFrame } from '../helpers';


module('Integration | Component | Breadcrumbs', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display items', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <Breadcrumbs @crumbs={{array 'a' 'b' 'c'}} @current="b" />
        <style>{{styleValue.current}}</style>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild);
    styleValue.current = carbonStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(this.element.firstElementChild);

    assert.equal(styles.length, 21);

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.deepEqual(stylesDiff,
      [
        [
          "<nav class=\"cds--breadcrumb cds--breadcrumb--no-trailing-slash\" aria-label=\"breadcrumb\"></nav>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "display": "flex",
            "font": "",
            "height": "18px",
            "outline": "rgb(22, 22, 22) none 0px",
            "width": "1276px"
          }
        ],
        [
          "<nav:before class=\"cds--breadcrumb cds--breadcrumb--no-trailing-slash\" aria-label=\"breadcrumb\"></nav:before>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "display": "block",
            "font": "",
            "outline": "rgb(22, 22, 22) none 0px"
          }
        ],
        [
          "<nav:after class=\"cds--breadcrumb cds--breadcrumb--no-trailing-slash\" aria-label=\"breadcrumb\"></nav:after>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "display": "block",
            "font": "",
            "outline": "rgb(22, 22, 22) none 0px"
          }
        ],
        [
          "<div class=\"cds--breadcrumb-item \"></div>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "bottom": "0px",
            "color": "rgb(22, 22, 22)",
            "display": "flex",
            "font": "",
            "height": "18px",
            "inset": "0px",
            "left": "0px",
            "margin": "0px 8px 0px 0px",
            "outline": "rgb(22, 22, 22) none 0px",
            "position": "relative",
            "right": "0px",
            "top": "0px",
            "width": "21.1641px"
          }
        ],
        [
          "<div:before class=\"cds--breadcrumb-item \"></div:before>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "display": "block",
            "font": "",
            "outline": "rgb(22, 22, 22) none 0px"
          }
        ],
        [
          "<div:after class=\"cds--breadcrumb-item \"></div:after>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "content": "\"/\"",
            "display": "block",
            "font": "",
            "height": "18px",
            "margin": "0px 0px 0px 8px",
            "outline": "rgb(22, 22, 22) none 0px",
            "width": "5.52344px"
          }
        ],
        [
          "<a href=\"#\" class=\"cds--link\"></a>",
          {
            "border": "0px none rgb(15, 98, 254)",
            "color": "rgb(15, 98, 254)",
            "display": "flex",
            "font": "",
            "height": "18px",
            "outline": "rgb(15, 98, 254) none 0px",
            "transition": "color 0.07s cubic-bezier(0.2, 0, 0.38, 0.9)",
            "width": "7.64062px"
          }
        ],
        [
          "<a:before href=\"#\" class=\"cds--link\"></a:before>",
          {
            "border": "0px none rgb(15, 98, 254)",
            "color": "rgb(15, 98, 254)",
            "display": "block",
            "font": "",
            "outline": "rgb(15, 98, 254) none 0px"
          }
        ],
        [
          "<a:after href=\"#\" class=\"cds--link\"></a:after>",
          {
            "border": "0px none rgb(15, 98, 254)",
            "color": "rgb(15, 98, 254)",
            "display": "block",
            "font": "",
            "outline": "rgb(15, 98, 254) none 0px"
          }
        ],
        [
          "<div class=\"cds--breadcrumb-item cds--breadcrumb-item--current\"></div>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "bottom": "0px",
            "color": "rgb(22, 22, 22)",
            "display": "flex",
            "font": "",
            "height": "18px",
            "inset": "0px",
            "left": "0px",
            "margin": "0px 8px 0px 0px",
            "outline": "rgb(22, 22, 22) none 0px",
            "position": "relative",
            "right": "0px",
            "top": "0px",
            "width": "21.8047px"
          }
        ],
        [
          "<div:before class=\"cds--breadcrumb-item cds--breadcrumb-item--current\"></div:before>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "display": "block",
            "font": "",
            "outline": "rgb(22, 22, 22) none 0px"
          }
        ],
        [
          "<div:after class=\"cds--breadcrumb-item cds--breadcrumb-item--current\"></div:after>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "content": "\"/\"",
            "display": "block",
            "font": "",
            "height": "18px",
            "margin": "0px 0px 0px 8px",
            "outline": "rgb(22, 22, 22) none 0px",
            "width": "5.52344px"
          }
        ],
        [
          "<a href=\"#\" class=\"cds--link\" aria-current=\"true\"></a>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "cursor": "auto",
            "display": "flex",
            "font": "",
            "height": "18px",
            "outline": "rgb(22, 22, 22) none 0px",
            "transition": "color 0.07s cubic-bezier(0.2, 0, 0.38, 0.9)",
            "width": "8.28125px"
          }
        ],
        [
          "<a:before href=\"#\" class=\"cds--link\" aria-current=\"true\"></a:before>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "cursor": "auto",
            "display": "block",
            "font": "",
            "outline": "rgb(22, 22, 22) none 0px"
          }
        ],
        [
          "<a:after href=\"#\" class=\"cds--link\" aria-current=\"true\"></a:after>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "cursor": "auto",
            "display": "block",
            "font": "",
            "outline": "rgb(22, 22, 22) none 0px"
          }
        ],
        [
          "<div class=\"cds--breadcrumb-item \"></div>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "bottom": "0px",
            "color": "rgb(22, 22, 22)",
            "display": "flex",
            "font": "",
            "height": "18px",
            "inset": "0px",
            "left": "0px",
            "outline": "rgb(22, 22, 22) none 0px",
            "position": "relative",
            "right": "0px",
            "top": "0px",
            "width": "15.2031px"
          }
        ],
        [
          "<div:before class=\"cds--breadcrumb-item \"></div:before>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "display": "block",
            "font": "",
            "outline": "rgb(22, 22, 22) none 0px"
          }
        ],
        [
          "<div:after class=\"cds--breadcrumb-item \"></div:after>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "content": "\"\"",
            "display": "block",
            "font": "",
            "height": "0px",
            "margin": "0px 0px 0px 8px",
            "outline": "rgb(22, 22, 22) none 0px",
            "width": "0px"
          }
        ],
        [
          "<a href=\"#\" class=\"cds--link\"></a>",
          {
            "border": "0px none rgb(15, 98, 254)",
            "color": "rgb(15, 98, 254)",
            "display": "flex",
            "font": "",
            "height": "18px",
            "outline": "rgb(15, 98, 254) none 0px",
            "transition": "color 0.07s cubic-bezier(0.2, 0, 0.38, 0.9)",
            "width": "7.20312px"
          }
        ],
        [
          "<a:before href=\"#\" class=\"cds--link\"></a:before>",
          {
            "border": "0px none rgb(15, 98, 254)",
            "color": "rgb(15, 98, 254)",
            "display": "block",
            "font": "",
            "outline": "rgb(15, 98, 254) none 0px"
          }
        ],
        [
          "<a:after href=\"#\" class=\"cds--link\"></a:after>",
          {
            "border": "0px none rgb(15, 98, 254)",
            "color": "rgb(15, 98, 254)",
            "display": "block",
            "font": "",
            "outline": "rgb(15, 98, 254) none 0px"
          }
        ]
      ]
    );
  });

  test('dark theme: should display items', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    const darkStyleValue = cell('');
    await render(
    <template>
      <Breadcrumbs @crumbs={{array 'a' 'b' 'c'}} @current="b" />
      <style>{{carbonStyle.default}}</style>
      <style>{{darkStyleValue.current}}</style>
    </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild);
    styleValue.current = carbonStyle.default;
    darkStyleValue.current = carbonDarkStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(this.element.firstElementChild);

    assert.equal(styles.length, 21);

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.deepEqual(stylesDiff,
      [
        [
          "<nav class=\"cds--breadcrumb cds--breadcrumb--no-trailing-slash\" aria-label=\"breadcrumb\"></nav>",
          {
            "border": "0px none rgb(244, 244, 244)",
            "color": "rgb(244, 244, 244)",
            "outline": "rgb(244, 244, 244) none 0px"
          }
        ],
        [
          "<nav:before class=\"cds--breadcrumb cds--breadcrumb--no-trailing-slash\" aria-label=\"breadcrumb\"></nav:before>",
          {
            "border": "0px none rgb(244, 244, 244)",
            "color": "rgb(244, 244, 244)",
            "outline": "rgb(244, 244, 244) none 0px"
          }
        ],
        [
          "<nav:after class=\"cds--breadcrumb cds--breadcrumb--no-trailing-slash\" aria-label=\"breadcrumb\"></nav:after>",
          {
            "border": "0px none rgb(244, 244, 244)",
            "color": "rgb(244, 244, 244)",
            "outline": "rgb(244, 244, 244) none 0px"
          }
        ],
        [
          "<div class=\"cds--breadcrumb-item \"></div>",
          {
            "border": "0px none rgb(244, 244, 244)",
            "color": "rgb(244, 244, 244)",
            "outline": "rgb(244, 244, 244) none 0px"
          }
        ],
        [
          "<div:before class=\"cds--breadcrumb-item \"></div:before>",
          {
            "border": "0px none rgb(244, 244, 244)",
            "color": "rgb(244, 244, 244)",
            "outline": "rgb(244, 244, 244) none 0px"
          }
        ],
        [
          "<div:after class=\"cds--breadcrumb-item \"></div:after>",
          {
            "border": "0px none rgb(244, 244, 244)",
            "color": "rgb(244, 244, 244)",
            "outline": "rgb(244, 244, 244) none 0px"
          }
        ],
        [
          "<a href=\"#\" class=\"cds--link\"></a>",
          {
            "border": "0px none rgb(120, 169, 255)",
            "color": "rgb(120, 169, 255)",
            "outline": "rgb(120, 169, 255) none 0px"
          }
        ],
        [
          "<a:before href=\"#\" class=\"cds--link\"></a:before>",
          {
            "border": "0px none rgb(120, 169, 255)",
            "color": "rgb(120, 169, 255)",
            "outline": "rgb(120, 169, 255) none 0px"
          }
        ],
        [
          "<a:after href=\"#\" class=\"cds--link\"></a:after>",
          {
            "border": "0px none rgb(120, 169, 255)",
            "color": "rgb(120, 169, 255)",
            "outline": "rgb(120, 169, 255) none 0px"
          }
        ],
        [
          "<div class=\"cds--breadcrumb-item cds--breadcrumb-item--current\"></div>",
          {
            "border": "0px none rgb(244, 244, 244)",
            "color": "rgb(244, 244, 244)",
            "outline": "rgb(244, 244, 244) none 0px"
          }
        ],
        [
          "<div:before class=\"cds--breadcrumb-item cds--breadcrumb-item--current\"></div:before>",
          {
            "border": "0px none rgb(244, 244, 244)",
            "color": "rgb(244, 244, 244)",
            "outline": "rgb(244, 244, 244) none 0px"
          }
        ],
        [
          "<div:after class=\"cds--breadcrumb-item cds--breadcrumb-item--current\"></div:after>",
          {
            "border": "0px none rgb(244, 244, 244)",
            "color": "rgb(244, 244, 244)",
            "outline": "rgb(244, 244, 244) none 0px"
          }
        ],
        [
          "<a href=\"#\" class=\"cds--link\" aria-current=\"true\"></a>",
          {
            "border": "0px none rgb(244, 244, 244)",
            "color": "rgb(244, 244, 244)",
            "outline": "rgb(244, 244, 244) none 0px"
          }
        ],
        [
          "<a:before href=\"#\" class=\"cds--link\" aria-current=\"true\"></a:before>",
          {
            "border": "0px none rgb(244, 244, 244)",
            "color": "rgb(244, 244, 244)",
            "outline": "rgb(244, 244, 244) none 0px"
          }
        ],
        [
          "<a:after href=\"#\" class=\"cds--link\" aria-current=\"true\"></a:after>",
          {
            "border": "0px none rgb(244, 244, 244)",
            "color": "rgb(244, 244, 244)",
            "outline": "rgb(244, 244, 244) none 0px"
          }
        ],
        [
          "<div class=\"cds--breadcrumb-item \"></div>",
          {
            "border": "0px none rgb(244, 244, 244)",
            "color": "rgb(244, 244, 244)",
            "outline": "rgb(244, 244, 244) none 0px"
          }
        ],
        [
          "<div:before class=\"cds--breadcrumb-item \"></div:before>",
          {
            "border": "0px none rgb(244, 244, 244)",
            "color": "rgb(244, 244, 244)",
            "outline": "rgb(244, 244, 244) none 0px"
          }
        ],
        [
          "<div:after class=\"cds--breadcrumb-item \"></div:after>",
          {
            "border": "0px none rgb(244, 244, 244)",
            "color": "rgb(244, 244, 244)",
            "outline": "rgb(244, 244, 244) none 0px"
          }
        ],
        [
          "<a href=\"#\" class=\"cds--link\"></a>",
          {
            "border": "0px none rgb(120, 169, 255)",
            "color": "rgb(120, 169, 255)",
            "outline": "rgb(120, 169, 255) none 0px"
          }
        ],
        [
          "<a:before href=\"#\" class=\"cds--link\"></a:before>",
          {
            "border": "0px none rgb(120, 169, 255)",
            "color": "rgb(120, 169, 255)",
            "outline": "rgb(120, 169, 255) none 0px"
          }
        ],
        [
          "<a:after href=\"#\" class=\"cds--link\"></a:after>",
          {
            "border": "0px none rgb(120, 169, 255)",
            "color": "rgb(120, 169, 255)",
            "outline": "rgb(120, 169, 255) none 0px"
          }
        ]
      ]
    );
  });

  test('should allow click without handler', async function (assert) {
    assert.expect(0);
    await render(
      <template><Breadcrumbs @crumbs={{array 'a' 'b' 'c'}} /></template>,
    );

    await click('.cds--breadcrumb-item');
  });

  test('should change selected item style', async function (this: RenderingTestContext, assert) {
    const selected = cell('');
    await render(
    <template>
      <Breadcrumbs @crumbs={{array 'a' 'b' 'c'}} @current={{selected.current}} />
      <style>{{carbonStyle.default}}</style>
    </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild);
    selected.current = 'a';
    await rerender();
    await waitForAnimationFrame();
    const aSelectedStyle = getAllElementComputedStyles(this.element.firstElementChild);

    selected.current = 'b';
    await rerender();
    await waitForAnimationFrame();
    const bSelectedStyle = getAllElementComputedStyles(this.element.firstElementChild);

    const stylesDiffA = getStylesDiff(styles, aSelectedStyle);
    const stylesDiffB = getStylesDiff(aSelectedStyle, bSelectedStyle);

    assert.deepEqual(stylesDiffA,
      [
        [
          "<a href=\"#\" class=\"cds--link\"></a>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "cursor": "auto",
            "outline": "rgb(22, 22, 22) none 0px"
          }
        ],
        [
          "<a:before href=\"#\" class=\"cds--link\"></a:before>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "cursor": "auto",
            "outline": "rgb(22, 22, 22) none 0px"
          }
        ],
        [
          "<a:after href=\"#\" class=\"cds--link\"></a:after>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "cursor": "auto",
            "outline": "rgb(22, 22, 22) none 0px"
          }
        ]
      ]
    );

    assert.deepEqual(stylesDiffB,
      [
        [
          "<a href=\"#\" class=\"cds--link\"></a>",
          {
            "border": "0px none rgb(15, 98, 254)",
            "color": "rgb(15, 98, 254)",
            "cursor": "pointer",
            "outline": "rgb(15, 98, 254) none 0px"
          }
        ],
        [
          "<a:before href=\"#\" class=\"cds--link\"></a:before>",
          {
            "border": "0px none rgb(15, 98, 254)",
            "color": "rgb(15, 98, 254)",
            "cursor": "pointer",
            "outline": "rgb(15, 98, 254) none 0px"
          }
        ],
        [
          "<a:after href=\"#\" class=\"cds--link\"></a:after>",
          {
            "border": "0px none rgb(15, 98, 254)",
            "color": "rgb(15, 98, 254)",
            "cursor": "pointer",
            "outline": "rgb(15, 98, 254) none 0px"
          }
        ],
        [
          "<a href=\"#\" class=\"cds--link\" aria-current=\"true\"></a>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "cursor": "auto",
            "outline": "rgb(22, 22, 22) none 0px"
          }
        ],
        [
          "<a:before href=\"#\" class=\"cds--link\" aria-current=\"true\"></a:before>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "cursor": "auto",
            "outline": "rgb(22, 22, 22) none 0px"
          }
        ],
        [
          "<a:after href=\"#\" class=\"cds--link\" aria-current=\"true\"></a:after>",
          {
            "border": "0px none rgb(22, 22, 22)",
            "color": "rgb(22, 22, 22)",
            "cursor": "auto",
            "outline": "rgb(22, 22, 22) none 0px"
          }
        ]
      ]
    );
  });
});
