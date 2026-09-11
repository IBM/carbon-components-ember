import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import FileUploads from 'carbon-components-ember/components/ai-chat/file-uploads';

module('Integration | Component | ai-chat/FileUploads', (hooks) => {
  setupRenderingTest(hooks);

  test('renders one FileUploadItem per upload, nothing when empty', async function (assert) {
    const uploads = [
      { id: '1', file: new File(['a'], 'a.txt', { type: 'text/plain' }), status: 'edit' as const },
      { id: '2', file: new File(['b'], 'b.txt', { type: 'text/plain' }), status: 'edit' as const },
    ];

    await render(<template><FileUploads @uploads={{uploads}} /></template>);

    assert.dom('.cds-aichat-file-upload-item').exists({ count: 2 });
  });

  test('an empty @uploads renders no container, but keeps its live regions mounted', async function (assert) {
    const uploads: never[] = [];

    await render(<template><FileUploads @uploads={{uploads}} /></template>);

    assert.dom('.cds-aichat-file-uploads__gradient-wrapper').doesNotExist();
    assert.dom('.cds-aichat-file-uploads__live-region').exists({ count: 2 });
  });

  test('seeding the initial uploads does not produce an "added" announcement', async function (assert) {
    const uploads = [{ id: '1', file: new File(['a'], 'a.txt', { type: 'text/plain' }), status: 'edit' as const }];

    await render(<template><FileUploads @uploads={{uploads}} /></template>);

    const regions = document.querySelectorAll('.cds-aichat-file-uploads__live-region');
    assert.strictEqual(regions[0]?.textContent, '');
    assert.strictEqual(regions[1]?.textContent, '');
  });

  test('a newly-added file after initial render is announced', async function (assert) {
    class Demo extends Component {
      @tracked uploads = [{ id: '1', file: new File(['a'], 'a.txt', { type: 'text/plain' }), status: 'edit' as const }];

      addOne = () => {
        this.uploads = [
          ...this.uploads,
          { id: '2', file: new File(['b'], 'b.txt', { type: 'text/plain' }), status: 'edit' as const },
        ];
      };

      <template>
        <FileUploads @uploads={{this.uploads}} />
        <button type='button' class='add-one' {{on 'click' this.addOne}}>add</button>
      </template>
    }

    await render(<template><Demo /></template>);
    await click('.add-one');
    await settled();

    const text = [...document.querySelectorAll('.cds-aichat-file-uploads__live-region')]
      .map((el) => el.textContent)
      .join('');
    assert.true(text.includes('added'), `expected an "added" announcement, got: "${text}"`);
  });

  test('@onRemove is called and a removal is announced', async function (assert) {
    const calls: string[] = [];
    const onRemove = (detail: { fileId: string }) => calls.push(detail.fileId);
    const uploads = [{ id: '1', file: new File(['a'], 'a.txt', { type: 'text/plain' }), status: 'edit' as const }];

    await render(<template><FileUploads @uploads={{uploads}} @onRemove={{onRemove}} /></template>);

    await click('.cds--file-close');

    assert.deepEqual(calls, ['1']);
    const text = [...document.querySelectorAll('.cds-aichat-file-uploads__live-region')]
      .map((el) => el.textContent)
      .join('');
    assert.true(text.includes('removed'), `expected a "removed" announcement, got: "${text}"`);
  });
});
