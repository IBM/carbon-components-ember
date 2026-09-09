import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find, triggerEvent } from '@ember/test-helpers';
import FileUploaderButton from 'carbon-components-ember/components/file-uploader/file-uploader-button';

function setInputFiles(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', { value: files, configurable: true });
}

module('Integration | Component | FileUploaderButton', (hooks) => {
  setupRenderingTest(hooks);

  test('renders a button and a hidden file input with the default label', async function (assert) {
    await render(<template><FileUploaderButton /></template>);

    assert.dom('button').hasClass('cds--btn').hasClass('cds--btn--primary').hasText('Add file');
    assert.dom('input[type="file"]').exists();
  });

  test('@labelText sets the initial label', async function (assert) {
    await render(<template><FileUploaderButton @labelText='Upload' /></template>);

    assert.dom('button').hasText('Upload');
  });

  test('clicking the button clicks the hidden input', async function (assert) {
    await render(<template><FileUploaderButton /></template>);

    const input = find('input[type="file"]') as HTMLInputElement;
    let clicked = false;
    input.addEventListener('click', () => (clicked = true));

    await click('button');

    assert.true(clicked);
  });

  test('selecting a file updates the label unless @disableLabelChanges', async function (assert) {
    await render(<template><FileUploaderButton /></template>);

    const input = find('input[type="file"]') as HTMLInputElement;
    setInputFiles(input, [new File(['x'], 'report.pdf')]);
    await triggerEvent(input, 'change');

    assert.dom('button').hasText('report.pdf');
  });

  test('@disableLabelChanges keeps the label fixed to @labelText', async function (assert) {
    await render(
      <template><FileUploaderButton @labelText='Upload' @disableLabelChanges={{true}} /></template>,
    );

    const input = find('input[type="file"]') as HTMLInputElement;
    setInputFiles(input, [new File(['x'], 'report.pdf')]);
    await triggerEvent(input, 'change');

    assert.dom('button').hasText('Upload');
  });

  test('@onChange is called when the input changes', async function (assert) {
    let called = false;
    const onChange = () => (called = true);

    await render(<template><FileUploaderButton @onChange={{onChange}} /></template>);

    const input = find('input[type="file"]') as HTMLInputElement;
    setInputFiles(input, [new File(['x'], 'a.txt')]);
    await triggerEvent(input, 'change');

    assert.true(called);
  });

  test('@disabled disables both the button and the input', async function (assert) {
    await render(<template><FileUploaderButton @disabled={{true}} /></template>);

    assert.dom('button').isDisabled();
    assert.dom('input[type="file"]').isDisabled();
  });

  test('@buttonKind and @size affect the rendered classes', async function (assert) {
    await render(
      <template><FileUploaderButton @buttonKind='ghost' @size='sm' /></template>,
    );

    assert.dom('button').hasClass('cds--btn--ghost').hasClass('cds--btn--sm');
  });

  test('@onButtonInsert is called with the underlying button element', async function (assert) {
    let inserted: HTMLButtonElement | undefined;
    const onButtonInsert = (element: HTMLButtonElement) => (inserted = element);

    await render(<template><FileUploaderButton @onButtonInsert={{onButtonInsert}} /></template>);

    assert.strictEqual(inserted, find('button'));
  });
});
