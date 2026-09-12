import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, rerender, click, waitUntil, find } from '@ember/test-helpers';
import { cell } from 'ember-resources';
import FileUploadItem from 'carbon-components-ember/components/ai-chat/file-upload-item';

module('Integration | Component | ai-chat/FileUploadItem', (hooks) => {
  setupRenderingTest(hooks);

  test('renders the file name and a file-type icon for a known extension', async function (assert) {
    const upload = {
      id: '1',
      file: new File(['hello'], 'report.pdf', { type: 'application/pdf' }),
      status: 'edit' as const,
    };

    await render(<template><FileUploadItem @upload={{upload}} /></template>);

    assert.dom('.cds-aichat-file-upload-item__name').hasText('report.pdf');
    // Icons load their SVG asynchronously via a TrackedPromise - settled() alone isn't enough.
    await waitUntil(() => find('.cds-aichat-file-upload-item__icon svg'));
    assert.dom('.cds-aichat-file-upload-item__icon svg').exists();
  });

  test('status "edit" renders a remove button that calls @onRemove with the file id', async function (assert) {
    const calls: string[] = [];
    const upload = {
      id: '42',
      file: new File(['x'], 'notes.txt', { type: 'text/plain' }),
      status: 'edit' as const,
    };
    const onRemove = (detail: { fileId: string }) => calls.push(detail.fileId);

    await render(<template><FileUploadItem @upload={{upload}} @onRemove={{onRemove}} /></template>);

    await click('.cds--file-close');
    assert.deepEqual(calls, ['42']);
  });

  test('status "uploading" shows a loading indicator, not a remove button', async function (assert) {
    const upload = { id: '1', file: new File(['x'], 'a.txt', { type: 'text/plain' }), status: 'uploading' as const };

    await render(<template><FileUploadItem @upload={{upload}} /></template>);

    assert.dom('.cds--file-loading').exists();
    assert.dom('.cds--file-close').doesNotExist();
  });

  test('status "success" shows a checkmark, not a remove/loading affordance', async function (assert) {
    const upload = { id: '1', file: new File(['x'], 'a.txt', { type: 'text/plain' }), status: 'success' as const };

    await render(<template><FileUploadItem @upload={{upload}} /></template>);

    await waitUntil(() => find('.cds--file-complete'));
    assert.dom('.cds--file-complete').exists();
    assert.dom('.cds--file-close').doesNotExist();
    assert.dom('.cds--file-loading').doesNotExist();
  });

  test('status "complete" (settled) renders no status affordance at all', async function (assert) {
    const upload = { id: '1', file: new File(['x'], 'a.txt', { type: 'text/plain' }), status: 'complete' as const };

    await render(<template><FileUploadItem @upload={{upload}} /></template>);

    assert.dom('.cds--file-loading').doesNotExist();
    assert.dom('.cds--file-close').doesNotExist();
  });

  test('@readOnly hides the status affordance even for an uploading status', async function (assert) {
    const upload = { id: '1', file: new File(['x'], 'a.txt', { type: 'text/plain' }), status: 'uploading' as const };

    await render(<template><FileUploadItem @readOnly={{true}} @upload={{upload}} /></template>);

    assert.dom('.cds--file-loading').doesNotExist();
  });

  test('an error message renders as an alert', async function (assert) {
    const upload = {
      id: '1',
      file: new File(['x'], 'a.txt', { type: 'text/plain' }),
      status: 'edit' as const,
      isError: true,
      errorMessage: 'Too large',
    };

    await render(<template><FileUploadItem @upload={{upload}} /></template>);

    assert.dom('.cds-aichat-file-upload-item__error').hasText('Too large');
  });

  test('a FileAttachment with no live File uses its stated name/type', async function (assert) {
    const attachment = { id: '1', name: 'archive.zip', mimeType: 'application/zip' };

    await render(<template><FileUploadItem @readOnly={{true}} @upload={{attachment}} /></template>);

    assert.dom('.cds-aichat-file-upload-item__name').hasText('archive.zip');
    await waitUntil(() => find('.cds-aichat-file-upload-item__icon svg'));
    assert.dom('.cds-aichat-file-upload-item__icon svg').exists();
  });

  test('an image file renders a preview via an object URL, without crashing on first render', async function (assert) {
    const upload = {
      id: '1',
      file: new File(['x'], 'photo.png', { type: 'image/png' }),
      status: 'edit' as const,
    };

    await render(<template><FileUploadItem @upload={{upload}} /></template>);

    assert.dom('.cds-aichat-file-upload-item__preview').exists();
    const src = find('.cds-aichat-file-upload-item__preview')?.getAttribute('src');
    assert.ok(src?.startsWith('blob:'), 'renders a blob: object URL for the preview src');
  });

  test('a video file renders a preview via an object URL, without crashing on first render', async function (assert) {
    const upload = {
      id: '1',
      file: new File(['x'], 'clip.mp4', { type: 'video/mp4' }),
      status: 'edit' as const,
    };

    await render(<template><FileUploadItem @upload={{upload}} /></template>);

    assert.dom('.cds-aichat-file-upload-item__video-preview-wrapper').exists();
    const src = find('.cds-aichat-file-upload-item__preview')?.getAttribute('src');
    assert.ok(src?.startsWith('blob:'), 'renders a blob: object URL for the preview src');
  });

  test('changing @upload to a different File (same instance) revokes the old object URL and mints a new one', async function (assert) {
    const originalRevoke = URL.revokeObjectURL;
    const revoked: string[] = [];
    URL.revokeObjectURL = (url: string) => {
      revoked.push(url);
      originalRevoke.call(URL, url);
    };

    try {
      const upload = cell({
        id: '1',
        file: new File(['a'], 'first.png', { type: 'image/png' }),
        status: 'edit' as const,
      });

      await render(<template><FileUploadItem @upload={{upload.current}} /></template>);
      const firstSrc = find('.cds-aichat-file-upload-item__preview')?.getAttribute('src');

      upload.current = { id: '1', file: new File(['b'], 'second.png', { type: 'image/png' }), status: 'edit' as const };
      await rerender();

      const secondSrc = find('.cds-aichat-file-upload-item__preview')?.getAttribute('src');

      assert.notStrictEqual(firstSrc, secondSrc, 'a new File identity produces a new object URL, on the same component instance');
      assert.deepEqual(revoked, [firstSrc], 'the previous object URL was revoked exactly once, and no more');
    } finally {
      URL.revokeObjectURL = originalRevoke;
    }
  });
});
