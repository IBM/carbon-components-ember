import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, rerender } from '@ember/test-helpers';
import { hash } from '@ember/helper';
import Grid from 'carbon-components-ember/components/grid';
import GridRow from 'carbon-components-ember/components/grid/row';
import GridColumn from 'carbon-components-ember/components/grid/column';
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
});
