import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find, triggerEvent } from '@ember/test-helpers';
import { array } from '@ember/helper';
import FileUploaderDropContainer from 'carbon-components-ember/components/file-uploader/file-uploader-drop-container';

function setInputFiles(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', { value: files, configurable: true });
}

module('Integration | Component | FileUploaderDropContainer', (hooks) => {
  setupRenderingTest(hooks);

  test('renders the drop area with @labelText', async function (assert) {
    await render(
      <template><FileUploaderDropContainer @labelText='Drag and drop a file' /></template>,
    );

    assert.dom('.cds--file__drop-container').hasText('Drag and drop a file');
    assert.dom('input[type="file"]').exists();
  });

  test('dragover applies the drag-over class, dragleave removes it', async function (assert) {
    await render(<template><FileUploaderDropContainer /></template>);

    await triggerEvent('.cds--file', 'dragover', { dataTransfer: {} });
    assert.dom('.cds--file__drop-container').hasClass('cds--file__drop-container--drag-over');

    await triggerEvent('.cds--file', 'dragleave', { dataTransfer: {} });
    assert
      .dom('.cds--file__drop-container')
      .doesNotHaveClass('cds--file__drop-container--drag-over');
  });

  test('dropping files calls @onAddFiles with the dropped files', async function (assert) {
    let received: File[] = [];
    const onAddFiles = (_event: Event, data: { addedFiles: File[] }) => {
      received = data.addedFiles;
    };

    await render(
      <template><FileUploaderDropContainer @onAddFiles={{onAddFiles}} /></template>,
    );

    const file = new File(['content'], 'photo.png', { type: 'image/png' });
    await triggerEvent('.cds--file', 'drop', { dataTransfer: { files: [file] } });

    assert.strictEqual(received.length, 1);
    assert.strictEqual(received[0]?.name, 'photo.png');
  });

  test('@maxFileSize marks oversized files as invalid but still includes them', async function (assert) {
    let received: (File & { invalidFileType?: boolean })[] = [];
    const onAddFiles = (
      _event: Event,
      data: { addedFiles: (File & { invalidFileType?: boolean })[] },
    ) => {
      received = data.addedFiles;
    };

    await render(
      <template>
        <FileUploaderDropContainer @maxFileSize={{5}} @onAddFiles={{onAddFiles}} />
      </template>,
    );

    const file = new File(['this is longer than five bytes'], 'big.txt');
    await triggerEvent('.cds--file', 'drop', { dataTransfer: { files: [file] } });

    assert.strictEqual(received.length, 1);
    assert.true(received[0]?.invalidFileType);
  });

  test('@accept filters out files whose extension is not accepted', async function (assert) {
    let received: (File & { invalidFileType?: boolean })[] = [];
    const onAddFiles = (
      _event: Event,
      data: { addedFiles: (File & { invalidFileType?: boolean })[] },
    ) => {
      received = data.addedFiles;
    };

    await render(
      <template>
        <FileUploaderDropContainer @accept={{array '.png'}} @onAddFiles={{onAddFiles}} />
      </template>,
    );

    const file = new File(['x'], 'notes.txt');
    await triggerEvent('.cds--file', 'drop', { dataTransfer: { files: [file] } });

    assert.strictEqual(received.length, 1);
    assert.true(received[0]?.invalidFileType);
  });

  test('clicking the drop area button clicks the hidden input', async function (assert) {
    await render(<template><FileUploaderDropContainer /></template>);

    const input = find('input[type="file"]') as HTMLInputElement;
    let clicked = false;
    input.addEventListener('click', () => (clicked = true));

    await click('.cds--file-browse-btn');

    assert.true(clicked);
  });

  test('selecting a file via the input calls @onAddFiles', async function (assert) {
    let received: File[] = [];
    const onAddFiles = (_event: Event, data: { addedFiles: File[] }) => {
      received = data.addedFiles;
    };

    await render(
      <template><FileUploaderDropContainer @onAddFiles={{onAddFiles}} /></template>,
    );

    const input = find('input[type="file"]') as HTMLInputElement;
    setInputFiles(input, [new File(['x'], 'a.txt')]);
    await triggerEvent(input, 'change');

    assert.strictEqual(received.length, 1);
  });

  test('@disabled prevents the click handler from opening the file picker', async function (assert) {
    await render(<template><FileUploaderDropContainer @disabled={{true}} /></template>);

    const input = find('input[type="file"]') as HTMLInputElement;
    let clicked = false;
    input.addEventListener('click', () => (clicked = true));

    await click('.cds--file-browse-btn');

    assert.false(clicked);
    assert.dom('.cds--file-browse-btn').hasClass('cds--file-browse-btn--disabled');
  });
});
