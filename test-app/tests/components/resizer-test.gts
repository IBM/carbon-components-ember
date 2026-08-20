import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerKeyEvent } from '@ember/test-helpers';
import Resizer from 'carbon-components-ember/components/resizer';
import { cell } from 'ember-resources';

function mouseEvent(type: string, options: MouseEventInit = {}) {
  return new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, ...options });
}

module('Integration | Component | Resizer', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders with the correct role, orientation and classes', async function (assert) {
    await render(<template><Resizer @orientation='horizontal' /></template>);

    const resizer = this.element.querySelector('[role="separator"]');
    assert.dom(resizer).exists();
    assert.dom(resizer).hasAttribute('aria-orientation', 'horizontal');
    assert.dom(resizer).hasAttribute('aria-live', 'assertive');
    assert.dom(resizer).hasAttribute('tabindex', '0');
    assert.dom(resizer).hasClass('cds--resizer');
    assert.dom(resizer).hasClass('cds--resizer--horizontal');
  });

  test('it applies the vertical orientation class', async function (assert) {
    await render(<template><Resizer @orientation='vertical' /></template>);

    assert.dom('[role="separator"]').hasClass('cds--resizer--vertical');
  });

  test('it defaults the handle thickness to 4px', async function (assert) {
    await render(<template><Resizer @orientation='horizontal' /></template>);

    const resizer = this.element.querySelector('[role="separator"]') as HTMLElement;
    assert.strictEqual(resizer.style.blockSize, '0.25rem');
  });

  test('it accepts a custom thickness', async function (assert) {
    await render(<template><Resizer @orientation='vertical' @thickness={{8}} /></template>);

    const resizer = this.element.querySelector('[role="separator"]') as HTMLElement;
    assert.strictEqual(resizer.style.inlineSize, '0.5rem');
  });

  test('it yields block content into the handle', async function (assert) {
    await render(
      <template>
        <Resizer @orientation='horizontal'>
          <span data-test-handle-icon>::</span>
        </Resizer>
      </template>,
    );

    assert.dom('[role="separator"] [data-test-handle-icon]').exists();
  });

  test('dragging resizes the previous and next siblings by default', async function (assert) {
    await render(
      <template>
        <div style='height: 100px;'></div>
        <Resizer @orientation='horizontal' />
        <div style='height: 100px;'></div>
      </template>,
    );

    const resizer = this.element.querySelector('[role="separator"]') as HTMLElement;
    const prev = resizer.previousElementSibling as HTMLElement;
    const next = resizer.nextElementSibling as HTMLElement;
    const prevHeight = prev.getBoundingClientRect().height;
    const nextHeight = next.getBoundingClientRect().height;

    resizer.dispatchEvent(mouseEvent('mousedown', { clientX: 0, clientY: 0 }));
    window.dispatchEvent(mouseEvent('mousemove', { clientX: 0, clientY: 20 }));
    window.dispatchEvent(mouseEvent('mouseup', { clientX: 0, clientY: 20 }));

    assert.strictEqual(prev.style.height, `${prevHeight + 20}px`);
    assert.strictEqual(next.style.height, `${nextHeight - 20}px`);
  });

  test('@onResize makes the component fully controlled', async function (assert) {
    const deltas: number[] = [];
    const onResize = (_event: MouseEvent | KeyboardEvent, delta: number) => deltas.push(delta);

    await render(
      <template>
        <div style='height: 100px;'></div>
        <Resizer @orientation='horizontal' @onResize={{onResize}} />
        <div style='height: 100px;'></div>
      </template>,
    );

    const resizer = this.element.querySelector('[role="separator"]') as HTMLElement;
    const prev = resizer.previousElementSibling as HTMLElement;
    const next = resizer.nextElementSibling as HTMLElement;

    resizer.dispatchEvent(mouseEvent('mousedown', { clientX: 0, clientY: 0 }));
    window.dispatchEvent(mouseEvent('mousemove', { clientX: 0, clientY: 15 }));
    window.dispatchEvent(mouseEvent('mouseup', { clientX: 0, clientY: 15 }));

    assert.deepEqual(deltas, [15]);
    assert.strictEqual(prev.style.height, '100px', 'siblings are not auto-resized when controlled');
    assert.strictEqual(next.style.height, '100px', 'siblings are not auto-resized when controlled');
  });

  test('@onResizeEnd is called on mouse-up with the resizer element', async function (assert) {
    const calls: unknown[] = [];
    const onResizeEnd = (_event: MouseEvent | KeyboardEvent, element: HTMLDivElement) =>
      calls.push(element);

    await render(
      <template>
        <div></div>
        <Resizer @orientation='horizontal' @onResizeEnd={{onResizeEnd}} />
        <div></div>
      </template>,
    );

    const resizer = this.element.querySelector('[role="separator"]') as HTMLElement;

    resizer.dispatchEvent(mouseEvent('mousedown', { clientX: 0, clientY: 0 }));
    window.dispatchEvent(mouseEvent('mouseup', { clientX: 0, clientY: 0 }));

    assert.strictEqual(calls.length, 1);
    assert.strictEqual(calls[0], resizer);
  });

  test('arrow keys resize by 5px, and by 25px with Shift', async function (assert) {
    await render(
      <template>
        <div style='height: 100px;'></div>
        <Resizer @orientation='horizontal' />
        <div style='height: 100px;'></div>
      </template>,
    );

    const resizer = this.element.querySelector('[role="separator"]') as HTMLElement;
    const prev = resizer.previousElementSibling as HTMLElement;

    const beforeFirstPress = prev.getBoundingClientRect().height;
    await triggerKeyEvent(resizer, 'keydown', 'ArrowDown');
    assert.strictEqual(prev.style.height, `${beforeFirstPress + 5}px`);

    const beforeSecondPress = prev.getBoundingClientRect().height;
    await triggerKeyEvent(resizer, 'keydown', 'ArrowDown', { shiftKey: true });
    assert.strictEqual(prev.style.height, `${beforeSecondPress + 25}px`);
  });

  test('@onResizeEnd fires (debounced) after a key-driven resize', async function (assert) {
    let called = false;
    const onResizeEnd = () => (called = true);

    await render(
      <template>
        <div></div>
        <Resizer @orientation='horizontal' @onResizeEnd={{onResizeEnd}} />
        <div></div>
      </template>,
    );

    const resizer = this.element.querySelector('[role="separator"]') as HTMLElement;
    // `triggerKeyEvent` awaits Ember's settledness, which includes the
    // ember-concurrency debounce task, so the call has already landed by
    // the time this resolves — this asserts it fires at all, not its timing.
    await triggerKeyEvent(resizer, 'keydown', 'ArrowDown');

    assert.ok(called);
  });

  test('double-click resets siblings to their initial size', async function (assert) {
    await render(
      <template>
        <div style='height: 100px;'></div>
        <Resizer @orientation='horizontal' />
        <div style='height: 100px;'></div>
      </template>,
    );

    const resizer = this.element.querySelector('[role="separator"]') as HTMLElement;
    const prev = resizer.previousElementSibling as HTMLElement;
    const initialHeight = prev.getBoundingClientRect().height;

    resizer.dispatchEvent(mouseEvent('mousedown', { clientX: 0, clientY: 0 }));
    window.dispatchEvent(mouseEvent('mousemove', { clientX: 0, clientY: 30 }));
    window.dispatchEvent(mouseEvent('mouseup', { clientX: 0, clientY: 30 }));
    assert.strictEqual(prev.style.height, `${initialHeight + 30}px`);

    resizer.dispatchEvent(mouseEvent('dblclick'));
    assert.strictEqual(prev.style.height, `${initialHeight}px`);
  });

  test('@onDoubleClick suppresses the default reset behavior', async function (assert) {
    const called = cell(false);
    const onDoubleClick = () => (called.current = true);

    await render(
      <template>
        <div style='height: 100px;'></div>
        <Resizer @orientation='horizontal' @onDoubleClick={{onDoubleClick}} />
        <div style='height: 100px;'></div>
      </template>,
    );

    const resizer = this.element.querySelector('[role="separator"]') as HTMLElement;
    const prev = resizer.previousElementSibling as HTMLElement;
    const initialHeight = prev.getBoundingClientRect().height;

    resizer.dispatchEvent(mouseEvent('mousedown', { clientX: 0, clientY: 0 }));
    window.dispatchEvent(mouseEvent('mousemove', { clientX: 0, clientY: 30 }));
    window.dispatchEvent(mouseEvent('mouseup', { clientX: 0, clientY: 30 }));

    resizer.dispatchEvent(mouseEvent('dblclick'));

    assert.true(called.current);
    assert.strictEqual(
      prev.style.height,
      `${initialHeight + 30}px`,
      'default reset is suppressed',
    );
  });
});
