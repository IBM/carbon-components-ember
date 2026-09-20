import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitUntil } from '@ember/test-helpers';
import type { RenderingTestContext } from '@ember/test-helpers/setup-rendering-context';
import Tile from 'carbon-components-ember/components/tile';

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
    await waitUntil(() => document.querySelector('.cds--tile__checkmark svg'));
    const icon = document.querySelector('.cds--tile__checkmark svg');
    assert.dom(icon).hasClass('cds--tile__checkmark-icon');
    assert.dom(icon).doesNotHaveClass('icon');
  });

  test('@selectable toggles selection on click, without a native checkbox input', async function (assert) {
    await render(
      <template>
        <Tile @selectable={{true}}><:content>Selectable</:content></Tile>
      </template>,
    );

    assert.dom('.cds--tile--selectable').doesNotHaveClass('cds--tile--is-selected');
    await click('.cds--tile--selectable');
    assert.dom('.cds--tile--selectable').hasClass('cds--tile--is-selected');
    assert.dom('.cds--tile--selectable').hasAttribute('aria-checked', 'true');
  });

  test('@expandable renders its chevron icon with the tile-specific class, not the default icon margin class', async function (assert) {
    await render(
      <template>
        <Tile @expandable={{true}}>
          <:above>Above the fold</:above>
          <:below>Below the fold</:below>
        </Tile>
      </template>,
    );

    assert.dom('.cds--tile--expandable').exists();
    await waitUntil(() => document.querySelector('.cds--tile__chevron svg'));
    const icon = document.querySelector('.cds--tile__chevron svg');
    assert.dom(icon).hasClass('cds--tile__chevron-icon');
    assert.dom(icon).doesNotHaveClass('icon');
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
    assert.dom('.cds--tile__chevron--interactive').hasAttribute('aria-expanded', 'false');
    await click('.cds--tile__chevron');
    assert.dom('.cds--tile--is-expanded').exists();
    assert.dom('.cds--tile-content__below-the-fold').hasText('Below the fold');
    assert.dom('.cds--tile__chevron--interactive').hasAttribute('aria-expanded', 'true');
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
    const belowFold = document.querySelector('.cds--tile-content__below-the-fold')
      ?.parentElement;
    assert.dom(chevron).hasAttribute('aria-controls', belowFold?.id ?? '');
  });

  test('@expandable actually clips the collapsed tile to the above-the-fold content height, not just visually', async function (this: RenderingTestContext, assert) {
    await render(
      <template>
        <Tile @expandable={{true}}>
          <:above>Above the fold</:above>
          <:below>
            <div style='height: 400px;'>tall below content</div>
          </:below>
        </Tile>
      </template>,
    );

    const tile = this.element.querySelector('.cds--tile--expandable') as HTMLElement;
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
    assert.strictEqual(tile.style.maxHeight, '', 'max-height is cleared once expanded');
    const expandedHeight = tile.offsetHeight;
    assert.ok(
      expandedHeight > collapsedHeight + 300,
      `expanded height (${expandedHeight}) should be well past collapsed height (${collapsedHeight}) once the 400px-tall below-the-fold content is visible`,
    );
  });
});
