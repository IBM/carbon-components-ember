import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import FileUploaderButton from './file-uploader-button.gts';

// Carbon React has no stories of its own for FileUploaderButton: it's a
// subcomponent of Components/FileUploader. No `render`: it takes no blocks.
//
// The literal-union defaults (`buttonKind`, `size`) are set on the story,
// not the meta: on the meta they widen to `string` and arg inference from
// the component's signature is lost.

const meta = preview.meta({
  title: 'Components/FileUploader/FileUploaderButton',
  component: FileUploaderButton,
  parameters: {
    docs: {
      description: {
        component:
          'A button that opens the native file picker for a hidden `<input type="file">`, and then shows the picked file name (or the number of files) as its label unless `@disableLabelChanges` is set. `FileUploader` renders one; it can also be used on its own as the minimal button-triggered (non-drag-and-drop) upload pattern.',
      },
    },
  },
  argTypes: {
    buttonKind: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'danger',
        'ghost',
        'danger--primary',
        'danger--ghost',
        'danger--tertiary',
        'tertiary',
      ],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    labelText: 'Add file',
    accept: ['.jpg', '.png'],
    multiple: false,
    disabled: false,
    disableLabelChanges: false,
    onChange: fn(),
    onButtonInsert: fn(),
  },
});

export const Default = meta.story({
  args: {
    buttonKind: 'primary',
    size: 'md',
  },
});

Default.test(
  'shows the picked file name',
  async ({ canvas, userEvent, args }) => {
    await expect(args.onButtonInsert).toHaveBeenCalledWith(
      canvas.getByRole('button', { name: 'Add file' }),
    );

    await userEvent.upload(
      canvas.getByLabelText('Add file'),
      new File(['a'], 'photo.png', { type: 'image/png' }),
    );
    await expect(
      canvas.getByRole('button', { name: 'photo.png' }),
    ).toBeVisible();
    await expect(args.onChange).toHaveBeenCalledOnce();
  },
);
