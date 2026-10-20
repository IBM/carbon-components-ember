import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  find,
  triggerEvent,
  triggerKeyEvent,
} from '@ember/test-helpers';
import Toggletip from '#src/components/toggletip.gts';
import ToggletipLabel from '#src/components/toggletip/toggletip-label.gts';

module('Integration | Component | Toggletip', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a trigger button and keep the content hidden until opened', async function (assert) {
    await render(
      <template>
        <Toggletip as |t|>
          <t.Button @label="Show information">i</t.Button>
          <t.Content>
            <p>Some more information</p>
          </t.Content>
        </Toggletip>
      </template>,
    );

    assert.dom('.cds--toggletip-button').exists();
    assert.dom('.cds--toggletip-button').hasAttribute('aria-expanded', 'false');
    assert
      .dom('.cds--popover-container')
      .doesNotHaveClass('cds--popover--open');
  });

  test('should open on click and toggle aria-expanded/aria-controls', async function (assert) {
    await render(
      <template>
        <Toggletip as |t|>
          <t.Button @label="Show information">i</t.Button>
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
    assert
      .dom('.cds--toggletip-button')
      .hasAttribute('aria-describedby', id as string);

    await click('.cds--toggletip-button');
    assert
      .dom('.cds--popover-container')
      .doesNotHaveClass('cds--popover--open');
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
        <Toggletip @align="bottom-end" as |t|>
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

    assert
      .dom('.cds--popover-container')
      .doesNotHaveClass('cds--popover--open');
    assert.dom('.cds--toggletip-button').isFocused();
  });

  test('should close when clicking outside', async function (assert) {
    await render(
      <template>
        <div id="outside">outside</div>
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

    assert
      .dom('.cds--popover-container')
      .doesNotHaveClass('cds--popover--open');
  });

  test('should stay open after a drag from the content to outside', async function (assert) {
    await render(
      <template>
        <div id="outside">outside</div>
        <Toggletip @defaultOpen={{true}} as |t|>
          <t.Button>i</t.Button>
          <t.Content>
            <p>Some more information</p>
          </t.Content>
        </Toggletip>
      </template>,
    );

    await triggerEvent('.cds--toggletip-content p', 'pointerdown');
    await triggerEvent('#outside', 'click', { detail: 1 });

    assert.dom('.cds--popover-container').hasClass('cds--popover--open');
  });

  test('@autoAlign positions the open content in the top layer', async function (assert) {
    await render(
      <template>
        <Toggletip @autoAlign={{true}} @defaultOpen={{true}} as |t|>
          <t.Button>i</t.Button>
          <t.Content>
            <p>Some more information</p>
          </t.Content>
        </Toggletip>
      </template>,
    );

    const content = find('.cds--popover-content') as HTMLElement;
    assert
      .dom('.cds--toggletip')
      .hasClass('cds--popover--auto-align')
      .hasClass('cds--autoalign');
    assert.dom('.cds--popover-content > .cds--popover-caret').exists();
    assert.true(content.matches(':popover-open'));
  });

  test('@autoAlign still closes on Escape and outside clicks', async function (assert) {
    await render(
      <template>
        <div id="outside">outside</div>
        <Toggletip @autoAlign={{true}} as |t|>
          <t.Button>i</t.Button>
          <t.Content>
            <button type="button" id="inner">Inner</button>
          </t.Content>
        </Toggletip>
      </template>,
    );

    await click('.cds--toggletip-button');
    await triggerKeyEvent('#inner', 'keydown', 'Escape');
    assert.dom('.cds--toggletip').doesNotHaveClass('cds--toggletip--open');
    assert.dom('.cds--toggletip-button').isFocused();

    await click('.cds--toggletip-button');
    await click('#outside');
    assert.dom('.cds--toggletip').doesNotHaveClass('cds--toggletip--open');
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
