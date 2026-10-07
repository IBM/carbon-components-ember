import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent } from '@ember/test-helpers';
import Popover, { PopoverContent } from '#src/components/popover.gts';
import { tracked } from '@glimmer/tracking';

module('Integration | Component | Popover', (hooks) => {
  setupRenderingTest(hooks);

  test('renders the container and content', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert.dom('.cds--popover-container').exists();
    assert.dom('.cds--popover-container').hasClass('cds--popover--open');
    assert.dom('.cds--popover').exists();
    assert.dom('.cds--popover-content').hasText('Content');
    assert.dom('.cds--popover-caret').exists();
  });

  test('@open={{false}} does not add the open class', async function (assert) {
    await render(
      <template>
        <Popover @open={{false}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert
      .dom('.cds--popover-container')
      .doesNotHaveClass('cds--popover--open');
  });

  test('defaults to bottom alignment and caret enabled', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert.dom('.cds--popover-container').hasClass('cds--popover--bottom');
    assert.dom('.cds--popover-container').hasClass('cds--popover--caret');
    assert.dom('.cds--popover-container').hasClass('cds--popover--drop-shadow');
  });

  test('@align maps deprecated values to the new alignment classes', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}} @align="top-left">
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert.dom('.cds--popover-container').hasClass('cds--popover--top-start');
  });

  test('@caret={{false}} removes the caret class', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}} @caret={{false}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert
      .dom('.cds--popover-container')
      .doesNotHaveClass('cds--popover--caret');
  });

  test('@dropShadow={{false}} removes the drop shadow class', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}} @dropShadow={{false}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert
      .dom('.cds--popover-container')
      .doesNotHaveClass('cds--popover--drop-shadow');
  });

  test('@border adds the border class', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}} @border={{true}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert.dom('.cds--popover-container').hasClass('cds--popover--border');
  });

  test('@highContrast adds the high-contrast class', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}} @highContrast={{true}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert
      .dom('.cds--popover-container')
      .hasClass('cds--popover--high-contrast');
  });

  test('@backgroundToken="background" adds the background-token class', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}} @backgroundToken="background">
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert
      .dom('.cds--popover-container')
      .hasClass('cds--popover--background-token__background');
  });

  test('@isTabTip adds the tab-tip class and defaults to bottom-start alignment', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}} @isTabTip={{true}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert.dom('.cds--popover-container').hasClass('cds--popover--tab-tip');
    assert
      .dom('.cds--popover-container')
      .hasClass('cds--popover--bottom-start');
    assert.dom('button').hasClass('cds--popover--tab-tip__button');
  });

  test('@as renders a custom element type', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}} @as="div">
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert.dom('div.cds--popover-container').exists();
    assert.dom('span.cds--popover-container').doesNotExist();
  });

  test('clicking outside the popover calls onRequestClose', async function (assert) {
    const open = tracked(true);
    const onRequestClose = () => (open.value = false);

    await render(
      <template>
        <div id="outside">outside</div>
        <Popover @open={{open.value}} @onRequestClose={{onRequestClose}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert.true(open.value);
    await click('#outside');
    assert.false(open.value);
  });

  test('clicking inside the popover content does not call onRequestClose', async function (assert) {
    const open = tracked(true);
    const onRequestClose = () => (open.value = false);

    await render(
      <template>
        <Popover @open={{open.value}} @onRequestClose={{onRequestClose}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    await click('.cds--popover-content');
    assert.true(open.value);
  });

  test('pressing Escape while focus is inside the content calls onRequestClose', async function (assert) {
    const open = tracked(true);
    const onRequestClose = () => (open.value = false);

    await render(
      <template>
        <Popover @open={{open.value}} @onRequestClose={{onRequestClose}}>
          <button type="button">Trigger</button>
          <PopoverContent>
            <button type="button" id="inner">Inner</button>
          </PopoverContent>
        </Popover>
      </template>,
    );

    await triggerKeyEvent('#inner', 'keydown', 'Escape');
    assert.false(open.value);
  });
});
