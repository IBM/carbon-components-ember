import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find, triggerEvent, waitUntil } from '@ember/test-helpers';
import { on } from '@ember/modifier';
import FileUploader from 'carbon-components-ember/components/file-uploader';

function setInputFiles(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', { value: files, configurable: true });
}

async function selectFiles(files: File[]) {
  const input = find('input[type="file"]') as HTMLInputElement;
  setInputFiles(input, files);
  await triggerEvent(input, 'change');
}

module('Integration | Component | FileUploader', (hooks) => {
  setupRenderingTest(hooks);

  test('renders label title, description, and the upload button', async function (assert) {
    await render(
      <template>
        <FileUploader
          @labelTitle='Upload files'
          @labelDescription='Max file size is 1 MB.'
          @buttonLabel='Add file'
          @filenameStatus='uploading'
        />
      </template>,
    );

    assert.dom('.cds--file--label').hasText('Upload files');
    assert.dom('.cds--label-description').hasText('Max file size is 1 MB.');
    assert.dom('button').hasText('Add file');
    assert.dom('.cds--file-container').exists();
  });

  test('selecting a file adds it to the list with @filenameStatus applied', async function (assert) {
    await render(<template><FileUploader @filenameStatus='complete' /></template>);

    await selectFiles([new File(['x'], 'report.pdf')]);

    assert.dom('.cds--file__selected-file').exists({ count: 1 });
    assert.dom('.cds--file-filename').hasText('report.pdf');
    await waitUntil(() => find('.cds--file-complete'));
    assert.dom('.cds--file-complete').exists();
  });

  test('@multiple accumulates files, single mode replaces the selection', async function (assert) {
    await render(<template><FileUploader @filenameStatus='complete' @multiple={{true}} /></template>);

    await selectFiles([new File(['x'], 'one.txt')]);
    await selectFiles([new File(['x'], 'two.txt')]);

    assert.dom('.cds--file__selected-file').exists({ count: 2 });

    await render(<template><FileUploader @filenameStatus='complete' /></template>);

    await selectFiles([new File(['x'], 'one.txt')]);
    await selectFiles([new File(['x'], 'two.txt')]);

    assert.dom('.cds--file__selected-file').exists({ count: 1 });
    assert.dom('.cds--file-filename').hasText('two.txt');
  });

  test('@maxFileSize filters oversized files out of the rendered list', async function (assert) {
    await render(
      <template><FileUploader @filenameStatus='complete' @maxFileSize={{5}} /></template>,
    );

    await selectFiles([new File(['this is way more than five bytes'], 'big.txt')]);

    assert.dom('.cds--file__selected-file').doesNotExist();
  });

  test('@onAddFiles and @onChange fire when files are added', async function (assert) {
    let addFilesCount = 0;
    let changeAction: string | undefined;
    const onAddFiles = () => addFilesCount++;
    const onChange = (_event: Event, data: { action: string }) => {
      changeAction = data.action;
    };

    await render(
      <template>
        <FileUploader
          @filenameStatus='complete'
          @onAddFiles={{onAddFiles}}
          @onChange={{onChange}}
        />
      </template>,
    );

    await selectFiles([new File(['x'], 'a.txt')]);

    assert.strictEqual(addFilesCount, 1);
    assert.strictEqual(changeAction, 'add');
  });

  test('with @filenameStatus="edit", activating a file removes it and calls @onDelete', async function (assert) {
    let deletedName: string | undefined;
    const onDelete = (_event: Event, data: { deletedFile: { name: string } }) => {
      deletedName = data.deletedFile.name;
    };

    await render(
      <template><FileUploader @filenameStatus='edit' @onDelete={{onDelete}} /></template>,
    );

    await selectFiles([new File(['x'], 'report.pdf')]);
    assert.dom('.cds--file__selected-file').exists({ count: 1 });

    await click('.cds--file-close');

    assert.dom('.cds--file__selected-file').doesNotExist();
    assert.strictEqual(deletedName, 'report.pdf');
  });

  test('with @filenameStatus="edit", removing a file returns focus to the upload button', async function (assert) {
    await render(<template><FileUploader @filenameStatus='edit' /></template>);

    await selectFiles([new File(['x'], 'report.pdf')]);
    await click('.cds--file-close');

    assert.dom('button').isFocused();
  });

  test('the yielded clearFiles action resets the selected-file list and fires @onChange with a "clear" action', async function (assert) {
    let changeAction: string | undefined;
    const onChange = (_event: Event, data: { action: string }) => {
      changeAction = data.action;
    };

    await render(
      <template>
        <FileUploader @filenameStatus='complete' @onChange={{onChange}} as |clearFiles|>
          <button type='button' class='clear-files' {{on 'click' clearFiles}}>Clear</button>
        </FileUploader>
      </template>,
    );

    await selectFiles([new File(['x'], 'report.pdf')]);
    assert.dom('.cds--file__selected-file').exists({ count: 1 });

    await click('.clear-files');

    assert.dom('.cds--file__selected-file').doesNotExist();
    assert.strictEqual(changeAction, 'clear');
  });

  test('with @filenameStatus="uploading" or "complete", the status icon is not interactive', async function (assert) {
    await render(<template><FileUploader @filenameStatus='uploading' /></template>);

    await selectFiles([new File(['x'], 'report.pdf')]);

    assert.dom('.cds--file-close').doesNotExist();
  });

  test('@disabled disables the upload button', async function (assert) {
    await render(<template><FileUploader @filenameStatus='uploading' @disabled={{true}} /></template>);

    assert.dom('button').isDisabled();
  });
});
