import { module, test } from 'qunit';
import { waitUntil } from '@ember/test-helpers';
import { observeResize } from '#src/utils/resize-observer.ts';

const nextFrames = (count: number) =>
  new Promise<void>((resolve) => {
    const step = (left: number) =>
      left ? requestAnimationFrame(() => step(left - 1)) : resolve();
    step(count);
  });

module('Unit | Utility | observeResize', function (hooks) {
  let element: HTMLDivElement;

  hooks.beforeEach(function () {
    element = document.createElement('div');
    element.style.width = '100px';
    document.body.append(element);
  });

  hooks.afterEach(function () {
    element.remove();
  });

  test('calls back in a later frame once the element resizes', async function (assert) {
    const widths: number[] = [];
    const stop = observeResize(element, (entry) =>
      widths.push(entry.contentRect.width),
    );
    await waitUntil(() => widths.length > 0);
    widths.length = 0;

    element.style.width = '200px';
    await waitUntil(() => widths.length > 0);
    stop();

    assert.deepEqual(widths, [200]);
  });

  test('calls every callback for the element, until each one stops', async function (assert) {
    let first = 0;
    let second = 0;
    const stopFirst = observeResize(element, () => first++);
    const stopSecond = observeResize(element, () => second++);
    await waitUntil(() => first > 0 && second > 0);

    stopFirst();
    first = 0;
    second = 0;
    element.style.width = '200px';
    await waitUntil(() => second > 0);
    stopSecond();

    assert.strictEqual(first, 0, 'the stopped callback is not called');
  });

  test('stops observing once every callback has stopped', async function (assert) {
    let calls = 0;
    const stop = observeResize(element, () => calls++);
    await waitUntil(() => calls > 0);

    stop();
    calls = 0;
    element.style.width = '200px';
    await nextFrames(3);

    assert.strictEqual(calls, 0);
  });

  test('a second callback on an observed element gets its first call', async function (assert) {
    let first = 0;
    let second = 0;
    const stopFirst = observeResize(element, () => first++);
    await waitUntil(() => first > 0);

    const stopSecond = observeResize(element, () => second++);
    await waitUntil(() => second > 0);
    stopFirst();
    stopSecond();

    assert.strictEqual(second, 1);
  });

  test('the same function registered twice stays registered until both stop', async function (assert) {
    let calls = 0;
    const callback = () => calls++;
    const stopOne = observeResize(element, callback);
    const stopTwo = observeResize(element, callback);
    await waitUntil(() => calls > 0);

    stopOne();
    calls = 0;
    element.style.width = '200px';
    await waitUntil(() => calls > 0);
    stopTwo();

    assert.true(calls > 0);
  });

  test('stopping while a resize is pending drops it', async function (assert) {
    let calls = 0;
    const stop = observeResize(element, () => calls++);
    await waitUntil(() => calls > 0);
    calls = 0;

    element.style.width = '200px';
    // The resize is observed in this frame and delivered in the next one;
    // a frame callback queued now runs in the next one, before delivery.
    requestAnimationFrame(() => requestAnimationFrame(stop));
    await nextFrames(4);

    assert.strictEqual(calls, 0);
  });
});
