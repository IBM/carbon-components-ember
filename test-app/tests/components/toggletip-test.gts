import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent } from '@ember/test-helpers';
import Toggletip from 'carbon-components-ember/components/toggletip';
import ToggletipLabel from 'carbon-components-ember/components/toggletip/label';

module('Integration | Component | Toggletip', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a trigger button and keep the content hidden until opened', async function (assert) {
    await render(
      <template>
        <Toggletip as |t|>
          <t.Button @label='Show information'>i</t.Button>
          <t.Content>
            <p>Some more information</p>
          </t.Content>
        </Toggletip>
      </template>,
    );

    assert.dom('.cds--toggletip-button').exists();
    assert.dom('.cds--toggletip-button').hasAttribute('aria-expanded', 'false');
    assert.dom('.cds--popover-container').doesNotHaveClass('cds--popover--open');
  });

  test('should open on click and toggle aria-expanded/aria-controls', async function (assert) {
    await render(
      <template>
        <Toggletip as |t|>
          <t.Button @label='Show information'>i</t.Button>
          <t.Content>
            <p>Some more information</p>
          </t.Content>
        </Toggletip>
      </template>,
    );

    await click('.cds--toggletip-button');

    assert.dom('.cds--popover-container').hasClass('cds--popover--open');
    assert.dom('.cds--toggletip-button').hasAttribute('aria-expanded', 'true');
    const id = document
      .querySelector('.cds--toggletip-button')
      ?.getAttribute('aria-controls');
    assert.ok(id);
    assert.dom(`#${id}`).exists();
    assert.dom('.cds--toggletip-button').hasAttribute('aria-describedby', id as string);

    await click('.cds--toggletip-button');
    assert.dom('.cds--popover-container').doesNotHaveClass('cds--popover--open');
  });

  test('should support defaultOpen', async function (assert) {
    await render(
      <template>
        <Toggletip @defaultOpen={{true}} as |t|>
          <t.Button>i</t.Button>
          <t.Content>
            <p>Some more information</p>
          </t.Content>
        </Toggletip>
      </template>,
    );

    assert.dom('.cds--popover-container').hasClass('cds--popover--open');
  });

  test('should apply the align class', async function (assert) {
    await render(
      <template>
        <Toggletip @align='bottom-end' as |t|>
          <t.Button>i</t.Button>
          <t.Content>
            <p>Some more information</p>
          </t.Content>
        </Toggletip>
      </template>,
    );

    assert.dom('.cds--popover-container').hasClass('cds--popover--bottom-end');
  });

  test('should close when pressing Escape and return focus to the button', async function (assert) {
    await render(
      <template>
        <Toggletip @defaultOpen={{true}} as |t|>
          <t.Button>i</t.Button>
          <t.Content>
            <p>Some more information</p>
          </t.Content>
        </Toggletip>
      </template>,
    );

    assert.dom('.cds--popover-container').hasClass('cds--popover--open');

    await triggerKeyEvent('.cds--popover-content', 'keydown', 'Escape');

    assert.dom('.cds--popover-container').doesNotHaveClass('cds--popover--open');
    assert.dom('.cds--toggletip-button').isFocused();
  });

  test('should close when clicking outside', async function (assert) {
    await render(
      <template>
        <div id='outside'>outside</div>
        <Toggletip @defaultOpen={{true}} as |t|>
          <t.Button>i</t.Button>
          <t.Content>
            <p>Some more information</p>
          </t.Content>
        </Toggletip>
      </template>,
    );

    assert.dom('.cds--popover-container').hasClass('cds--popover--open');

    await click('#outside');

    assert.dom('.cds--popover-container').doesNotHaveClass('cds--popover--open');
  });

  test('should render ToggletipActions inside the content', async function (assert) {
    await render(
      <template>
        <Toggletip @defaultOpen={{true}} as |t|>
          <t.Button>i</t.Button>
          <t.Content>
            <p>Some more information</p>
          </t.Content>
        </Toggletip>
      </template>,
    );

    assert.dom('.cds--toggletip-content').exists();
  });

  test('ToggletipLabel renders its content', async function (assert) {
    await render(
      <template>
        <ToggletipLabel>Toggletip label</ToggletipLabel>
      </template>,
    );

    assert.dom('.cds--toggletip-label').hasText('Toggletip label');
  });
});
