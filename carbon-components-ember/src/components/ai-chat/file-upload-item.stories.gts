import { hash } from '@ember/helper';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import FileUploadItem from './file-upload-item.gts';
import { FileStatusValue } from './-file-uploads/types.ts';

import type { Args as FileUploadItemArgs } from './file-upload-item.gts';

// `@carbon/ai-chat-components` ships no stories for
// `cds-aichat-file-upload-item`, so these are based on the docs-app page;
// the title nests it under `AI Chat/File uploads` the way upstream nests
// sub-components (e.g. `Components/Workspace shell/Header`). Upstream's
// `carbonTheme`-style theming isn't ported anywhere in these AI Chat
// stories: the Storybook toolbar's theme switcher applies Carbon's theme
// classes instead.
//
// Previews use in-memory `File`s (an SVG for the image preview, a few bytes
// tagged `video/mp4` for the video preview), so no static assets are needed;
// the video "preview" frame stays blank since the bytes aren't a real video.

const SVG_SOURCE =
  '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><rect width="36" height="36" fill="#0f62fe"/></svg>';

const notesFile = new File(['hello'], 'notes.txt', { type: 'text/plain' });
const photoFile = new File([SVG_SOURCE], 'photo.svg', {
  type: 'image/svg+xml',
});
const videoFile = new File(['not a real video'], 'clip.mp4', {
  type: 'video/mp4',
});
const reportFile = new File(['%PDF-1.4'], 'report.pdf', {
  type: 'application/pdf',
});

const EDIT = FileStatusValue.EDIT;

// Typed as the full union so stories can pass either a `FileUpload` or a
// `FileAttachment` (inferred from the literal, `@upload` would narrow to
// the former).
const defaultUpload = {
  id: '1',
  file: notesFile,
  status: FileStatusValue.EDIT,
} as FileUploadItemArgs['upload'];

const meta = preview.meta({
  title: 'AI Chat/File uploads/Item',
  component: FileUploadItem,
  parameters: {
    docs: {
      description: {
        component: [
          'A single file chip with an optional media preview or file-type icon.',
          '',
          'Used by `FileUploads` for staged uploads (a `FileUpload`, with live status and a remove button), and directly for a file already attached to a sent message via `@readOnly` (a `FileUpload` or a `FileAttachment` - the latter for a message restored from conversation history, where there is no live `File`).',
        ].join('\n'),
      },
    },
  },
  args: {
    upload: defaultUpload,
    onRemove: fn(),
  },
});

export const Default = meta.story();

Default.test(
  'reports the remove button through onRemove',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Remove file - notes.txt' }),
    );
    await expect(args.onRemove).toHaveBeenCalledWith({ fileId: '1' });
  },
);

export const Uploading = meta.story({
  args: {
    upload: { id: '1', file: notesFile, status: FileStatusValue.UPLOADING },
  },
});

export const Success = meta.story({
  args: {
    upload: { id: '1', file: notesFile, status: FileStatusValue.SUCCESS },
  },
  parameters: {
    docs: {
      description: {
        story:
          '`success` is the transient state shown the moment an upload succeeds (a brief checkmark).',
      },
    },
  },
});

export const Complete = meta.story({
  args: {
    upload: { id: '1', file: notesFile, status: FileStatusValue.COMPLETE },
  },
  parameters: {
    docs: {
      description: {
        story:
          '`complete` is the settled, persisted terminal state: no progress or success affordance at all.',
      },
    },
  },
});

export const WithError = meta.story({
  args: {
    upload: {
      id: '1',
      file: notesFile,
      status: FileStatusValue.EDIT,
      isError: true,
      errorMessage: 'File exceeds the 10MB limit',
    },
  },
});

WithError.test('announces the error message', async ({ canvas }) => {
  await expect(canvas.getByRole('alert')).toHaveTextContent(
    'File exceeds the 10MB limit',
  );
});

export const ImagePreview = meta.story({
  args: {
    upload: { id: '1', file: photoFile, status: FileStatusValue.EDIT },
  },
});

export const VideoPreview = meta.story({
  args: {
    upload: { id: '1', file: videoFile, status: FileStatusValue.EDIT },
  },
});

export const ReadOnly = meta.story({
  args: {
    readOnly: true,
    upload: { id: '1', file: reportFile, status: FileStatusValue.COMPLETE },
  },
  parameters: {
    docs: {
      description: {
        story:
          'A file on an already-sent message: no status and no remove button.',
      },
    },
  },
});

export const ReadOnlyAttachment = meta.story({
  args: {
    readOnly: true,
    upload: { id: '1', name: 'report.pdf', mimeType: 'application/pdf' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'A `FileAttachment` - a file restored from conversation history, known only by its name and type.',
      },
    },
  },
});

// docs-app's live demo: staged text file, staged image with preview, and a
// read-only attachment side by side.
export const Gallery = meta.story({
  parameters: {
    controls: { disable: true },
  },
  render: () => <template>
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <FileUploadItem @upload={{hash id="1" file=notesFile status=EDIT}} />
      <FileUploadItem @upload={{hash id="2" file=photoFile status=EDIT}} />
      <FileUploadItem
        @readOnly={{true}}
        @upload={{hash id="3" name="report.pdf" mimeType="application/pdf"}}
      />
    </div>
  </template>,
});
