import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import FileUploaderDropContainer from './file-uploader-drop-container.gts';

// Mirrors the `FileUploaderDropContainer` story of Carbon React's
// Components/FileUploader. Parity gap: no `size` arg. No `render`: it takes
// no blocks.

const meta = preview.meta({
  title: 'Components/FileUploader/FileUploaderDropContainer',
  component: FileUploaderDropContainer,
  parameters: {
    docs: {
      description: {
        component:
          'A drop target for files, with a hidden file picker as the click/keyboard fallback. It calls `@onAddFiles` with the added files (each marked `invalidFileType` when it doesn’t match `@accept` or exceeds `@maxFileSize`), but doesn’t list them: render a `FileUploaderItem` per file next to it, so each file’s status can progress on its own. See the drag-and-drop example applications on the `FileUploader` page.',
      },
    },
  },
  args: {
    accept: ['image/jpeg', 'image/png'],
    disabled: false,
    labelText: 'Drag and drop files here or click to upload',
    maxFileSize: 1024 * 1024,
    multiple: true,
    name: '',
    onAddFiles: fn(),
    onClick: fn(),
  },
});

export const Default = meta.story();

Default.test('reports added files', async ({ canvas, userEvent, args }) => {
  const file = new File(['hello'], 'photo.png', { type: 'image/png' });
  await userEvent.upload(
    canvas.getByLabelText('Drag and drop files here or click to upload'),
    file,
  );
  await expect(args.onAddFiles).toHaveBeenCalledWith(expect.anything(), {
    addedFiles: [file],
  });
});
