import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, rerender } from '@ember/test-helpers';
import { hash } from '@ember/helper';
import Grid, { FlexGrid } from 'carbon-components-ember/components/grid';
import GridRow from 'carbon-components-ember/components/grid/row';
import GridColumn from 'carbon-components-ember/components/grid/column';
import GridColumnHang from 'carbon-components-ember/components/grid/column-hang';
import GridSettings from 'carbon-components-ember/components/grid/settings';
import { cell } from 'ember-resources';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import * as carbonDarkStyle from '../styles/carbon-gray-90.scss?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import {
  getAllElementComputedStyles,
  getStylesDiff,
  waitForAnimationFrame,
} from '../helpers';

module('Integration | Component | Grid', (hooks) => {
  setupRenderingTest(hooks);

  test('white theme: should display grid', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    await render(
      <template>
        <Grid>
          <GridRow>
            <GridColumn>Column 1</GridColumn>
            <GridColumn>Column 2</GridColumn>
          </GridRow>
        </Grid>
        <style>{{styleValue.current}}</style>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    styleValue.current = carbonStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should have correct initial styles');
  });

  test('dark theme: should display grid', async function (this: RenderingTestContext, assert) {
    const styleValue = cell('');
    const darkStyleValue = cell('');
    await render(
      <template>
        <Grid>
          <GridRow>
            <GridColumn>Column 1</GridColumn>
            <GridColumn>Column 2</GridColumn>
          </GridRow>
        </Grid>
        <style>{{styleValue.current}}</style>
        <style>{{darkStyleValue.current}}</style>
      </template>,
    );

    await waitForAnimationFrame();
    const styles = getAllElementComputedStyles(this.element.firstElementChild!);
    styleValue.current = carbonStyle.default;
    darkStyleValue.current = carbonDarkStyle.default;
    await rerender();
    await waitForAnimationFrame();
    const withCarbonStyles = getAllElementComputedStyles(
      this.element.firstElementChild!,
    );

    const stylesDiff = getStylesDiff(styles, withCarbonStyles);

    assert.snapshot(stylesDiff, 'should correctly switch to dark styles');
  });

  test('renders the base grid class', async function (assert) {
    await render(<template><Grid>content</Grid></template>);

    assert.dom('.cds--grid').exists();
  });

  test('@condensed adds the condensed class', async function (assert) {
    await render(
      <template><Grid @condensed={{true}}>content</Grid></template>,
    );

    assert.dom('.cds--grid--condensed').exists();
  });

  test('@narrow adds the narrow class', async function (assert) {
    await render(<template><Grid @narrow={{true}}>content</Grid></template>);

    assert.dom('.cds--grid--narrow').exists();
  });

  test('@fullWidth adds the full-width class', async function (assert) {
    await render(
      <template><Grid @fullWidth={{true}}>content</Grid></template>,
    );

    assert.dom('.cds--grid--full-width').exists();
  });

  test('@withRowGap adds the with-row-gap class', async function (assert) {
    await render(
      <template><Grid @withRowGap={{true}}>content</Grid></template>,
    );

    assert.dom('.cds--grid--with-row-gap').exists();
  });

  test('@as renders a custom element type', async function (assert) {
    await render(<template><Grid @as='section'>content</Grid></template>);

    assert.dom('div.cds--grid').doesNotExist();
    assert.dom('section.cds--grid').exists();
  });

  test('GridRow renders the base row class', async function (assert) {
    await render(<template><GridRow>content</GridRow></template>);

    assert.dom('.cds--row').exists();
  });

  test('GridRow @condensed and @narrow add modifier classes', async function (assert) {
    await render(
      <template>
        <GridRow @condensed={{true}} @narrow={{true}}>content</GridRow>
      </template>,
    );

    assert.dom('.cds--row--condensed').exists();
    assert.dom('.cds--row--narrow').exists();
  });

  test('GridColumn defaults to the auto-width col class', async function (assert) {
    await render(<template><GridColumn>content</GridColumn></template>);

    assert.dom('.cds--col').exists();
  });

  test('GridColumn @sm as true adds the auto column class for the breakpoint', async function (assert) {
    await render(
      <template><GridColumn @sm={{true}}>content</GridColumn></template>,
    );

    assert.dom('.cds--col-sm').exists();
  });

  test('GridColumn breakpoint span numbers add the matching column classes', async function (assert) {
    await render(
      <template>
        <GridColumn @sm={{2}} @md={{4}} @lg={{6}}>content</GridColumn>
      </template>,
    );

    assert.dom('.cds--col-sm-2').exists();
    assert.dom('.cds--col-md-4').exists();
    assert.dom('.cds--col-lg-6').exists();
  });

  test('GridColumn breakpoint objects add span and offset classes', async function (assert) {
    await render(
      <template>
        <GridColumn @sm={{hash span=1 offset=3}}>content</GridColumn>
      </template>,
    );

    assert.dom('.cds--col-sm-1').exists();
    assert.dom('.cds--offset-sm-3').exists();
  });

  test('FlexGrid renders the flexbox grid even when @mode is css-grid', async function (assert) {
    await render(
      <template><FlexGrid @mode='css-grid'>content</FlexGrid></template>,
    );

    assert.dom('.cds--grid').exists();
    assert.dom('.cds--css-grid').doesNotExist();
  });

  test('GridColumnHang renders the column hang class', async function (assert) {
    await render(<template><GridColumnHang>Text</GridColumnHang></template>);

    assert.dom('.cds--grid-column-hang').exists().hasText('Text');
  });

  module('css-grid mode', function () {
    test('@mode="css-grid" renders the css grid class', async function (assert) {
      await render(<template><Grid @mode='css-grid'>content</Grid></template>);

      assert.dom('.cds--css-grid').exists();
      assert.dom('.cds--grid').doesNotExist();
    });

    test('modifier arguments add the css grid modifier classes', async function (assert) {
      await render(
        <template>
          <Grid
            @mode='css-grid'
            @condensed={{true}}
            @fullWidth={{true}}
            @withRowGap={{true}}
          >content</Grid>
        </template>,
      );

      assert.dom('.cds--css-grid--condensed').exists();
      assert.dom('.cds--css-grid--full-width').exists();
      assert.dom('.cds--css-grid--with-row-gap').exists();
    });

    test('@narrow takes precedence over @condensed', async function (assert) {
      await render(
        <template>
          <Grid
            @mode='css-grid'
            @narrow={{true}}
            @condensed={{true}}
          >content</Grid>
        </template>,
      );

      assert.dom('.cds--css-grid--narrow').exists();
      assert.dom('.cds--css-grid--condensed').doesNotExist();
    });

    test('@align adds the alignment class', async function (assert) {
      await render(
        <template>
          <Grid @mode='css-grid' @align='start'>content</Grid>
          <Grid @mode='css-grid' @align='end'>content</Grid>
          <Grid @mode='css-grid' @align='center'>content</Grid>
        </template>,
      );

      assert.dom('.cds--css-grid--start').exists({ count: 1 });
      assert.dom('.cds--css-grid--end').exists({ count: 1 });
    });

    test('the yielded Column renders css grid column classes', async function (assert) {
      await render(
        <template>
          <Grid @mode='css-grid' as |g|>
            <g.Column @sm={{4}} @md={{true}} @lg='75%'>content</g.Column>
          </Grid>
        </template>,
      );

      assert.dom('.cds--css-grid-column').exists();
      assert.dom('.cds--sm\\:col-span-4').exists();
      assert.dom('.cds--md\\:col-span-auto').exists();
      assert.dom('.cds--lg\\:col-span-75').exists();
    });

    test('the yielded Column supports offset, start and end', async function (assert) {
      await render(
        <template>
          <Grid @mode='css-grid' as |g|>
            <g.Column @sm={{hash span=1 offset=3}}>offset</g.Column>
            <g.Column @md={{hash start=3 end=9}}>start/end</g.Column>
          </Grid>
        </template>,
      );

      assert.dom('.cds--sm\\:col-span-1').exists();
      assert.dom('.cds--sm\\:col-start-4').exists();
      assert.dom('.cds--md\\:col-start-3').exists();
      assert.dom('.cds--md\\:col-end-9').exists();
    });

    test('the yielded Column supports a breakpoint-independent @span', async function (assert) {
      await render(
        <template>
          <Grid @mode='css-grid' as |g|>
            <g.Column @span={{8}}>span</g.Column>
            <g.Column @span={{hash start=2 end=6}}>start/end</g.Column>
          </Grid>
        </template>,
      );

      assert.dom('.cds--col-span-8').exists();
      assert.dom('.cds--col-start-2').exists();
      assert.dom('.cds--col-end-6').exists();
    });

    test('a nested Grid renders as a subgrid', async function (assert) {
      await render(
        <template>
          <Grid @mode='css-grid' as |g|>
            <g.Column @sm={{4}}>
              <g.Grid @narrow={{true}} @withRowGap={{true}}>nested</g.Grid>
            </g.Column>
          </Grid>
        </template>,
      );

      assert.dom('.cds--subgrid').exists();
      assert.dom('.cds--subgrid--narrow').exists();
      assert.dom('.cds--subgrid--with-row-gap').exists();
      assert.dom('.cds--css-grid').exists({ count: 1 });
    });

    test('a nested Grid defaults to the wide subgrid gutter mode', async function (assert) {
      await render(
        <template>
          <Grid @mode='css-grid' as |g|>
            <g.Grid>nested</g.Grid>
          </Grid>
        </template>,
      );

      assert.dom('.cds--subgrid--wide').exists();
    });

    test('a nested Grid in flexbox mode stays a flexbox grid', async function (assert) {
      await render(
        <template>
          <Grid as |g|>
            <g.Grid>nested</g.Grid>
          </Grid>
        </template>,
      );

      assert.dom('.cds--grid').exists({ count: 2 });
      assert.dom('.cds--subgrid').doesNotExist();
    });
  });

  module('GridSettings', function () {
    test('yields components bound to the given mode', async function (assert) {
      await render(
        <template>
          <GridSettings @mode='css-grid' as |g|>
            <g.Grid>
              <g.Column @sm={{2}}>content</g.Column>
            </g.Grid>
          </GridSettings>
        </template>,
      );

      assert.dom('.cds--css-grid').exists();
      assert.dom('.cds--css-grid-column').exists();
      assert.dom('.cds--sm\\:col-span-2').exists();
    });

    test('@subgrid makes the yielded Grid render as a subgrid', async function (assert) {
      await render(
        <template>
          <GridSettings @mode='css-grid' @subgrid={{true}} as |g|>
            <g.Grid>content</g.Grid>
          </GridSettings>
        </template>,
      );

      assert.dom('.cds--subgrid').exists();
      assert.dom('.cds--css-grid').doesNotExist();
    });

    test('defaults to flexbox mode', async function (assert) {
      await render(
        <template>
          <GridSettings as |g|>
            <g.Grid>
              <g.Row>
                <g.Column @sm={{2}}>content</g.Column>
              </g.Row>
            </g.Grid>
          </GridSettings>
        </template>,
      );

      assert.dom('.cds--grid').exists();
      assert.dom('.cds--row').exists();
      assert.dom('.cds--col-sm-2').exists();
    });
  });
});
