import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import FileUploaderItem from './file-uploader-item.gts';

// Mirrors the `FileUploaderItem` story of Carbon React's
// Components/FileUploader. Parity gap: no `filesize` arg. No `render`: it
// takes no blocks.
//
// The literal-union defaults (`size`, `status`) are set on the story, not
// the meta: on the meta they widen to `string` and arg inference from the
// component's signature is lost.

const meta = preview.meta({
  title: 'Components/FileUploader/FileUploaderItem',
  component: FileUploaderItem,
  parameters: {
    docs: {
      description: {
        component:
          'One selected file in a `FileUploader`: its name plus a status icon that follows `@status` (`uploading`, `complete`, or `edit`, which shows a delete button that calls `@onDelete` with the item’s `@uuid`). `@invalid` shows `@errorSubject`/`@errorBody` below it. Render one per file next to a `FileUploaderDropContainer` to build a drag-and-drop upload flow.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['edit', 'complete', 'uploading'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    disabled: false,
    errorBody: '1 MB max file size. Select a new file and try again.',
    errorSubject: 'File size exceeds limit',
    iconDescription: 'Delete file',
    invalid: false,
    name: 'THIS IS A VERY LONG FILENAME WHICH WILL BE TRUNCATED',
    uuid: 'storybook-file',
    onDelete: fn(),
  },
});

export const Default = meta.story({
  args: {
    size: 'md',
    status: 'edit',
  },
});

Default.test(
  'reports its uuid when deleted',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Delete file - THIS IS A VERY LONG FILENAME WHICH WILL BE TRUNCATED',
      }),
    );
    await expect(args.onDelete).toHaveBeenCalledWith(expect.anything(), {
      uuid: 'storybook-file',
    });
  },
);
