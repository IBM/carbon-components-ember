import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import ButtonSet from 'carbon-components-ember/components/button-set';
import Button from 'carbon-components-ember/components/button';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import { waitForAnimationFrame } from '../helpers';

module('Integration | Component | ButtonSet', (hooks) => {
  setupRenderingTest(hooks);

  test('should render button set with default layout', async function (assert) {
    await render(
      <template>
        <ButtonSet>
          <Button @type="secondary">Cancel</Button>
          <Button @type="primary">Submit</Button>
        </ButtonSet>
        <style>{{carbonStyle.default}}</style>
      </template>
    );

    await waitForAnimationFrame();

    assert.dom('.cds--btn-set').exists('should render button set container');
    assert.dom('.cds--btn-set button').exists({ count: 2 }, 'should render two buttons');
  });

  test('should render stacked button set', async function (assert) {
    await render(
      <template>
        <ButtonSet @stacked={{true}}>
          <Button @type="secondary">Cancel</Button>
          <Button @type="primary">Submit</Button>
        </ButtonSet>
        <style>{{carbonStyle.default}}</style>
      </template>
    );

    await waitForAnimationFrame();

    assert.dom('.cds--btn-set--stacked').exists('should have stacked class');
  });

  test('should render fluid button set', async function (assert) {
    await render(
      <template>
        <ButtonSet @fluid={{true}}>
          <Button @type="secondary">Cancel</Button>
          <Button @type="primary">Submit</Button>
        </ButtonSet>
        <style>{{carbonStyle.default}}</style>
      </template>
    );

    await waitForAnimationFrame();

    assert.dom('.cds--btn-set--fluid').exists('should have fluid class');
    assert.dom('.cds--btn-set__fluid-inner').exists('should have fluid inner container');
    assert.dom('.cds--btn-set__fluid-inner--auto-stack').exists('should have auto-stack class');
  });

  test('should render multiple buttons', async function (assert) {
    await render(
      <template>
        <ButtonSet>
          <Button @type="ghost">Cancel</Button>
          <Button @type="secondary">Back</Button>
          <Button @type="primary">Submit</Button>
        </ButtonSet>
        <style>{{carbonStyle.default}}</style>
      </template>
    );

    await waitForAnimationFrame();

    assert.dom('.cds--btn-set button').exists({ count: 3 }, 'should render three buttons');
  });

  test('should pass through HTML attributes', async function (assert) {
    await render(
      <template>
        <ButtonSet data-test-id="my-button-set" class="custom-class">
          <Button @type="primary">Submit</Button>
        </ButtonSet>
        <style>{{carbonStyle.default}}</style>
      </template>
    );

    await waitForAnimationFrame();

    assert.dom('[data-test-id="my-button-set"]').exists('should pass through data attributes');
    assert.dom('.custom-class').exists('should pass through custom classes');
  });

  test('fluid overrides stacked', async function (assert) {
    await render(
      <template>
        <ButtonSet @fluid={{true}} @stacked={{true}}>
          <Button @type="secondary">Cancel</Button>
          <Button @type="primary">Submit</Button>
        </ButtonSet>
        <style>{{carbonStyle.default}}</style>
      </template>
    );

    await waitForAnimationFrame();

    assert.dom('.cds--btn-set--fluid').exists('should have fluid class');
    assert.dom('.cds--btn-set__fluid-inner').exists('should render fluid inner container');
  });
});
