import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, triggerKeyEvent } from '@ember/test-helpers';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import Tile from '#src/components/tile.gts';
import style from 'ember-style-modifier';
import { setupRoutes } from '../helpers';

module('Integration | Component | Tile', (hooks) => {
  setupRenderingTest(hooks);

  test('plain Tile renders content', async function (assert) {
    await render(
      <template>
        <Tile><:content>Plain content</:content></Tile>
      </template>,
    );

    assert.dom('.cds--tile').exists();
    assert.dom('.cds--tile').hasText('Plain content');
  });

  test('a clickable tile takes attributes and {{on "click"}} on its link', async function (assert) {
    let clicks = 0;
    const onClick = () => clicks++;
    await render(
      <template>
        <Tile @clickable={{true}} class="my-tile" {{on "click" onClick}}>
          <:content>Go</:content>
        </Tile>
      </template>,
    );

    assert.dom('a.cds--tile--clickable').hasClass('my-tile');
    await click('a.cds--tile--clickable');
    assert.strictEqual(clicks, 1);
  });

  test('a clickable tile links to @href, as Carbon React', async function (assert) {
    await render(
      <template>
        <Tile @clickable={{true}} @href="/docs"><:content>Docs</:content></Tile>
      </template>,
    );
    assert
      .dom('a.cds--tile--clickable')
      .hasClass('cds--link')
      .hasAttribute('href', '/docs')
      .doesNotHaveAttribute('tabindex');
  });

  test('a clickable tile without a link is focusable, and Enter and Space click it', async function (assert) {
    const onClick = () => assert.step('click');
    await render(
      <template>
        <Tile @clickable={{true}} {{on "click" onClick}}>
          <:content>Open</:content>
        </Tile>
      </template>,
    );
    assert
      .dom('a.cds--tile--clickable')
      .doesNotHaveAttribute('href')
      .hasAttribute('tabindex', '0');
    await triggerKeyEvent('a.cds--tile--clickable', 'keydown', 'Enter');
    await triggerKeyEvent('a.cds--tile--clickable', 'keydown', ' ');
    assert.verifySteps(['click', 'click']);
  });

  test('a disabled clickable tile is no link and ignores clicks', async function (assert) {
    const onClick = () => assert.step('click');
    await render(
      <template>
        <Tile
          @clickable={{true}}
          @href="/docs"
          @disabled={{true}}
          {{on "click" onClick}}
        >
          <:content>Docs</:content>
        </Tile>
      </template>,
    );
    assert
      .dom('a.cds--tile--clickable')
      .doesNotHaveAttribute('href')
      .doesNotHaveAttribute('tabindex')
      .hasClass('cds--link--disabled');
    await triggerKeyEvent('a.cds--tile--clickable', 'keydown', 'Enter');
    await click('a.cds--tile--clickable');
    assert.verifySteps([]);
  });

  module('with @route', function (hooks) {
    setupRoutes(hooks);

    test('a clickable tile links to its route', async function (assert) {
      await render(
        <template>
          <Tile @clickable={{true}} @route="settings">
            <:content>Settings</:content>
          </Tile>
        </template>,
      );
      assert.dom('a.cds--tile--clickable').hasAttribute('href', '/settings');
      await click('a.cds--tile--clickable');
      const router = this.owner.lookup('service:router');
      assert.strictEqual(router.currentRouteName, 'settings');
    });

    test('a disabled one is no link', async function (assert) {
      await render(
        <template>
          <Tile @clickable={{true}} @route="settings" @disabled={{true}}>
            <:content>Settings</:content>
          </Tile>
        </template>,
      );
      assert
        .dom('a.cds--tile--clickable')
        .doesNotHaveAttribute('href')
        .hasAttribute('aria-disabled', 'true');
    });
  });

  test('@clickable renders an anchor tile', async function (assert) {
    await render(
      <template>
        <Tile @clickable={{true}}><:content>Click me</:content></Tile>
      </template>,
    );

    assert.dom('a.cds--tile--clickable').exists();
    assert.dom('a.cds--tile--clickable').hasText('Click me');
  });

  test('@selectable renders a role=checkbox div with its checkmark icon carrying the tile-specific class, not the default icon margin class', async function (assert) {
    await render(
      <template>
        <Tile @selectable={{true}}><:content>Selectable</:content></Tile>
      </template>,
    );

    assert.dom('.cds--tile--selectable').exists();
    assert.dom('.cds--tile--selectable').hasAttribute('role', 'checkbox');
    assert.dom('.cds--tile--selectable').hasAttribute('aria-checked', 'false');
    assert.dom('.cds--tile--selectable').hasAttribute('tabindex', '0');
    assert.dom('.cds--tile-input').doesNotExist();
    assert.dom('.cds--tile__checkmark svg').exists();
  });

  test('@selectable toggles selection on click, without a native checkbox input', async function (assert) {
    await render(
      <template>
        <Tile @selectable={{true}}><:content>Selectable</:content></Tile>
      </template>,
    );

    assert
      .dom('.cds--tile--selectable')
      .doesNotHaveClass('cds--tile--is-selected');
    await click('.cds--tile--selectable');
    assert.dom('.cds--tile--selectable').hasClass('cds--tile--is-selected');
    assert.dom('.cds--tile--selectable').hasAttribute('aria-checked', 'true');
  });

  test("@selectable renders @id on its root and matches the content label's `for`, and renders neither when omitted", async function (assert) {
    await render(
      <template>
        <Tile @selectable={{true}} @id="my-tile"><:content
          >Selectable</:content></Tile>
      </template>,
    );

    assert.dom('.cds--tile--selectable').hasAttribute('id', 'my-tile');
    assert.dom('label.cds--tile-content').hasAttribute('for', 'my-tile');

    await render(
      <template>
        <Tile @selectable={{true}}><:content>Selectable</:content></Tile>
      </template>,
    );

    assert.dom('.cds--tile--selectable').doesNotHaveAttribute('id');
    assert.dom('label.cds--tile-content').doesNotHaveAttribute('for');
  });

  test('@expandable renders its chevron icon', async function (assert) {
    await render(
      <template>
        <Tile @expandable={{true}}>
          <:above>Above the fold</:above>
          <:below>Below the fold</:below>
        </Tile>
      </template>,
    );

    assert.dom('.cds--tile--expandable').exists();
    assert.dom('.cds--tile__chevron svg').exists();
  });

  test('@expandable always renders the below-the-fold content, toggling visibility and aria-expanded on click', async function (assert) {
    await render(
      <template>
        <Tile @expandable={{true}}>
          <:above>Above the fold</:above>
          <:below>Below the fold</:below>
        </Tile>
      </template>,
    );

    // Matches @carbon/react's ExpandableTile: the below-the-fold content is
    // always in the DOM (clipped via CSS), not only once @expanded is true.
    assert.dom('.cds--tile-content__below-the-fold').hasText('Below the fold');
    assert
      .dom('.cds--tile__chevron--interactive')
      .hasAttribute('aria-expanded', 'false');
    await click('.cds--tile__chevron');
    assert.dom('.cds--tile--is-expanded').exists();
    assert.dom('.cds--tile-content__below-the-fold').hasText('Below the fold');
    assert
      .dom('.cds--tile__chevron--interactive')
      .hasAttribute('aria-expanded', 'true');
  });

  test('@expandable puts aria-expanded/aria-controls on the chevron button, not the root', async function (assert) {
    await render(
      <template>
        <Tile @expandable={{true}}>
          <:above>Above the fold</:above>
          <:below>Below the fold</:below>
        </Tile>
      </template>,
    );

    assert.dom('.cds--tile--expandable').doesNotHaveAttribute('aria-expanded');
    assert.dom('.cds--tile--expandable').doesNotHaveAttribute('aria-controls');
    const chevron = document.querySelector('.cds--tile__chevron--interactive');
    const belowFold = document.querySelector(
      '.cds--tile-content__below-the-fold',
    )?.parentElement;
    assert.dom(chevron).hasAttribute('aria-controls', belowFold?.id ?? '');
  });

  test('@expandable actually clips the collapsed tile to the above-the-fold content height, not just visually', async function (this: RenderingTestContext, assert) {
    await render(
      <template>
        <Tile @expandable={{true}}>
          <:above>Above the fold</:above>
          <:below>
            <div {{style height="400px"}}>tall below content</div>
          </:below>
        </Tile>
      </template>,
    );

    const tile = this.element.querySelector(
      '.cds--tile--expandable',
    ) as HTMLElement;
    // The below-the-fold content is always in the DOM (see the previous
    // test), so without a real measured max-height the collapsed tile would
    // render at its full, expanded content height - `overflow: hidden` has
    // nothing to clip against since nothing actually overflows the box.
    // `offsetHeight` (not `getBoundingClientRect().height`) is used
    // throughout, since test-app's own harness applies a `transform:
    // scale(0.5)` to `#ember-testing` (confirmed by inspecting it directly)
    // - `getBoundingClientRect()` reports post-transform, visually-scaled
    // coordinates, while `offsetHeight` reports the real, unscaled CSS
    // layout size that actually matters here.
    assert.true(
      tile.style.maxHeight.length > 0 && tile.style.maxHeight !== '0px',
      'a real, non-zero inline max-height is set while collapsed',
    );
    const collapsedHeight = tile.offsetHeight;
    await click(tile.querySelector('.cds--tile__chevron') as HTMLElement);
    assert.strictEqual(
      tile.style.maxHeight,
      '',
      'max-height is cleared once expanded',
    );
    const expandedHeight = tile.offsetHeight;
    assert.ok(
      expandedHeight > collapsedHeight + 300,
      `expanded height (${expandedHeight}) should be well past collapsed height (${collapsedHeight}) once the 400px-tall below-the-fold content is visible`,
    );
  });
});
