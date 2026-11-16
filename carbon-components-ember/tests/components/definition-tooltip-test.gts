import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  blur,
  find,
  focus,
  render,
  triggerEvent,
  triggerKeyEvent,
} from '@ember/test-helpers';
import DefinitionTooltip from '#src/components/definition-tooltip.gts';

const TERM = '.cds--definition-term';
const POPOVER = '.cds--popover-container';

module('Integration | Component | DefinitionTooltip', (hooks) => {
  setupRenderingTest(hooks);

  test('renders the term, described by its closed definition', async function (assert) {
    await render(
      <template>
        <DefinitionTooltip
          @definition="Uniform Resource Locator"
        >URL</DefinitionTooltip>
      </template>,
    );

    const id = find('.cds--popover')?.id ?? '';

    assert.strictEqual(find(TERM)?.textContent, 'URL', 'no whitespace around');
    assert
      .dom(TERM)
      .hasAttribute('type', 'button')
      .hasAria('controls', id)
      .hasAria('describedby', id)
      .hasAria('expanded', 'false');
    assert.dom('.cds--definition-tooltip').hasText('Uniform Resource Locator');
    assert.dom(POPOVER).hasClass('cds--popover--bottom');
    assert.dom(POPOVER).doesNotHaveClass('cds--popover--open');
  });

  test('a press toggles it', async function (assert) {
    await render(
      <template>
        <DefinitionTooltip @definition="Locator">URL</DefinitionTooltip>
      </template>,
    );

    await triggerEvent(TERM, 'mousedown', { button: 0 });
    assert.dom(TERM).hasAria('expanded', 'true');
    assert.dom(POPOVER).hasClass('cds--popover--open');

    await triggerEvent(TERM, 'mousedown', { button: 0 });
    assert.dom(TERM).hasAria('expanded', 'false');
  });

  test('focus opens it and blur closes it', async function (assert) {
    await render(
      <template>
        <DefinitionTooltip @definition="Locator">URL</DefinitionTooltip>
      </template>,
    );

    await focus(TERM);
    assert.dom(TERM).hasAria('expanded', 'true');

    await blur(TERM);
    assert.dom(TERM).hasAria('expanded', 'false');
  });

  test('Enter and Space toggle it, and Escape closes it there', async function (assert) {
    let escapes = 0;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') escapes++;
    };

    await render(
      <template>
        {{! eslint-disable-next-line ember/template-no-invalid-interactive -- only listens for the key bubbling up }}
        <div {{on "keydown" onKeyDown}}>
          <DefinitionTooltip @definition="Locator">URL</DefinitionTooltip>
        </div>
      </template>,
    );

    await triggerKeyEvent(TERM, 'keydown', 'Enter');
    assert.dom(TERM).hasAria('expanded', 'true');
    await triggerKeyEvent(TERM, 'keydown', ' ');
    assert.dom(TERM).hasAria('expanded', 'false');

    await triggerKeyEvent(TERM, 'keydown', 'Enter');
    await triggerKeyEvent(TERM, 'keydown', 'Escape');
    assert.dom(TERM).hasAria('expanded', 'false');
    assert.strictEqual(escapes, 0, 'as Carbon React, it stops the Escape');
  });

  test('hover opens it only with @openOnHover, and leaving closes it', async function (assert) {
    await render(
      <template>
        <DefinitionTooltip @definition="Locator">URL</DefinitionTooltip>
      </template>,
    );
    await triggerEvent(POPOVER, 'mouseenter');
    assert.dom(TERM).hasAria('expanded', 'false');

    await render(
      <template>
        <DefinitionTooltip
          @definition="Locator"
          @openOnHover={{true}}
        >URL</DefinitionTooltip>
      </template>,
    );
    await triggerEvent(POPOVER, 'mouseenter');
    assert.dom(TERM).hasAria('expanded', 'true');

    await triggerEvent(POPOVER, 'mouseleave');
    assert.dom(TERM).hasAria('expanded', 'false');
  });

  test('@defaultOpen starts it open', async function (assert) {
    await render(
      <template>
        <DefinitionTooltip
          @defaultOpen={{true}}
          @definition="Locator"
        >URL</DefinitionTooltip>
      </template>,
    );

    assert.dom(TERM).hasAria('expanded', 'true');
    assert.dom(POPOVER).hasClass('cds--popover--open');
  });

  test('@id names the tooltip, and @align places it', async function (assert) {
    await render(
      <template>
        <DefinitionTooltip
          @align="top-start"
          @definition="Locator"
          @id="url-definition"
        >URL</DefinitionTooltip>
      </template>,
    );

    assert.dom('#url-definition').hasClass('cds--popover');
    assert.dom(TERM).hasAria('describedby', 'url-definition');
    assert.dom(POPOVER).hasClass('cds--popover--top-start');
  });

  test('attributes go on the term, and the class arguments where Carbon React puts them', async function (assert) {
    await render(
      <template>
        <DefinitionTooltip
          @className="custom-popover"
          @definition="Locator"
          @triggerClassName="custom-trigger"
          aria-describedby="ignored"
          data-test-term
        >URL</DefinitionTooltip>
      </template>,
    );

    assert.dom('[data-test-term]').hasClass('cds--definition-term');
    assert.dom('[data-test-term]').hasClass('custom-trigger');
    assert
      .dom('[data-test-term]')
      .hasAria(
        'describedby',
        find('.cds--popover')?.id ?? '',
        'the term’s own wins',
      );
    assert.dom(POPOVER).hasClass('custom-popover');
  });

  test('the definition block takes markup', async function (assert) {
    await render(
      <template>
        <DefinitionTooltip>
          <:default>URL</:default>
          <:definition><strong
              data-test-definition
            >Locator</strong></:definition>
        </DefinitionTooltip>
      </template>,
    );

    assert.dom('.cds--definition-tooltip [data-test-definition]').exists();
  });
});
