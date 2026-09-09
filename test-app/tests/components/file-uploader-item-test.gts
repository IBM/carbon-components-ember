import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitUntil, find } from '@ember/test-helpers';
import FileUploaderItem from 'carbon-components-ember/components/file-uploader/file-uploader-item';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import { waitForAnimationFrame } from '../helpers';

module('Integration | Component | FileUploaderItem', (hooks) => {
  setupRenderingTest(hooks);

  test('uploading status renders a loading indicator', async function (assert) {
    await render(
      <template><FileUploaderItem @name='report.pdf' @status='uploading' /></template>,
    );

    assert.dom('.cds--file-filename').hasText('report.pdf');
    assert.dom('.cds--file-loading').exists();
    assert.dom('.cds--file-close').doesNotExist();
    assert.dom('.cds--file-complete').doesNotExist();
  });

  test('complete status renders a checkmark', async function (assert) {
    await render(
      <template><FileUploaderItem @name='report.pdf' @status='complete' /></template>,
    );

    await waitUntil(() => find('.cds--file-complete'));

    assert.dom('.cds--file-complete').exists();
    assert.dom('.cds--file-loading').doesNotExist();
    assert.dom('.cds--file-close').doesNotExist();
  });

  test('edit status renders a delete button that calls @onDelete with the uuid', async function (assert) {
    let received: { uuid: string } | undefined;
    const onDelete = (_event: Event, data: { uuid: string }) => {
      received = data;
    };

    await render(
      <template>
        <FileUploaderItem
          @name='report.pdf'
          @status='edit'
          @uuid='file-1'
          @onDelete={{onDelete}}
        />
      </template>,
    );

    assert.dom('.cds--file-close').exists();
    await waitUntil(() => find('.cds--file-close__icon'));

    await click('.cds--file-close');

    assert.strictEqual(received?.uuid, 'file-1');
  });

  test('@invalid with @errorSubject renders a form-requirement error', async function (assert) {
    await render(
      <template>
        <FileUploaderItem
          @name='report.pdf'
          @status='edit'
          @invalid={{true}}
          @errorSubject='File size exceeds limit'
          @errorBody='1 MB max file size.'
        />
      </template>,
    );

    assert.dom('.cds--file__selected-file').hasClass('cds--file__selected-file--invalid');
    assert.dom('.cds--form-requirement').exists();
    assert.dom('.cds--form-requirement__title').hasText('File size exceeds limit');
    assert.dom('.cds--form-requirement__supplement').hasText('1 MB max file size.');
  });

  test('@size applies the corresponding size class', async function (assert) {
    await render(
      <template><FileUploaderItem @name='a.txt' @status='edit' @size='sm' /></template>,
    );

    assert.dom('.cds--file__selected-file').hasClass('cds--file__selected-file--sm');
  });

  test('long filenames become ellipsis-truncated and wrapped in a tooltip trigger', async function (assert) {
    await render(
      <template>
        <style>{{carbonStyle.default}}</style>
        <div style='width: 100px'>
          <FileUploaderItem
            @name='this-is-a-very-long-filename-that-will-definitely-overflow-its-container.txt'
            @status='edit'
          />
        </div>
      </template>,
    );
    await waitForAnimationFrame();
    await waitUntil(() => find('.cds--file-filename-button'));

    assert.dom('.cds--file-filename-button').exists();
  });
});
