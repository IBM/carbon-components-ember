import { trackedObject } from '@ember/reactive/collections';
import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import FileUploads from './file-uploads.gts';
import { FileStatusValue } from './-file-uploads/types.ts';

import type { Args as FileUploadsArgs } from './file-uploads.gts';
import type {
  FileRemoveEventDetail,
  FileUpload,
} from './-file-uploads/types.ts';

// `@carbon/ai-chat-components` ships no stories for `cds-aichat-file-uploads`,
// so these are based on the docs-app page; the title follows upstream's
// `Components/<Name>` naming (`AI Chat/File uploads`). Upstream's
// `carbonTheme`-style theming isn't ported anywhere in these AI Chat
// stories: the Storybook toolbar's theme switcher applies Carbon's theme
// classes instead.
//
// The image preview uses an in-memory SVG `File` (rendered through an object
// URL), so no static asset is needed.

const SVG_SOURCE =
  '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><rect width="36" height="36" fill="#0f62fe"/></svg>';

function sampleUploads(): FileUpload[] {
  return [
    {
      id: '1',
      file: new File(['hello'], 'notes.txt', { type: 'text/plain' }),
      status: FileStatusValue.UPLOADING,
    },
    {
      id: '2',
      file: new File(['a,b,c'], 'data.csv', { type: 'text/csv' }),
      status: FileStatusValue.EDIT,
    },
    {
      id: '3',
      file: new File([SVG_SOURCE], 'photo.svg', { type: 'image/svg+xml' }),
      status: FileStatusValue.EDIT,
    },
    {
      id: '4',
      file: new File(['{}'], 'broken.json', { type: 'application/json' }),
      status: FileStatusValue.EDIT,
      isError: true,
      errorMessage: 'File exceeds the 10MB limit',
    },
  ];
}

type StoryArgs = FileUploadsArgs & {
  onRemove: (detail: FileRemoveEventDetail) => void;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/File uploads',
  component: FileUploads,
  parameters: {
    docs: {
      description: {
        component: [
          '`FileUploads` displays a list of staged file uploads with status indicators (uploading / done / error), and announces upload-state changes to screen readers.',
          '',
          'See also `FileUploadItem` (`AI Chat/File uploads/Item`), which renders a single chip and is also used for a file already attached to a sent message.',
          '',
          '`@uploads` is controlled: removing a file calls `@onRemove` with `{ fileId }`, and the host passes a new array without it.',
        ].join('\n'),
      },
    },
  },
  args: {
    onRemove: fn(),
  },
  // Uploads are host-owned: keep them in story-local tracked state, drop a
  // file when it's removed, and report every removal to `onRemove`.
  render: (args: StoryArgs) => {
    const state = trackedObject({ uploads: args.uploads ?? sampleUploads() });
    const remove = (detail: FileRemoveEventDetail) => {
      state.uploads = state.uploads.filter(
        (upload) => upload.id !== detail.fileId,
      );
      args.onRemove(detail);
    };

    return <template>
      <div style="max-inline-size: 20rem;">
        <FileUploads
          @uploads={{state.uploads}}
          @removeFileLabel={{args.removeFileLabel}}
          @uploadingFileLabel={{args.uploadingFileLabel}}
          @fileRemovedLabel={{args.fileRemovedLabel}}
          @uploadSuccessLabel={{args.uploadSuccessLabel}}
          @uploadFailureLabel={{args.uploadFailureLabel}}
          @onRemove={{remove}}
        />
      </div>
    </template>;
  },
});

// docs-app's live demo: one uploading, two staged (one with an image
// preview) and one failed file.
export const Default = meta.story();

Default.test(
  'removes a file and announces it',
  async ({ canvas, canvasElement, userEvent, args }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Remove file - data.csv' }),
    );
    await expect(args.onRemove).toHaveBeenCalledWith({ fileId: '2' });
    await waitFor(() =>
      expect(canvas.queryByText('data.csv')).not.toBeInTheDocument(),
    );
    const regions = [
      ...canvasElement.querySelectorAll('[aria-live="polite"]'),
    ].map((region) => region.textContent);
    await expect(regions).toContain('File removed.');
  },
);

export const CustomLabels = meta.story({
  args: {
    removeFileLabel: 'Delete attachment',
    uploadingFileLabel: 'Attachment uploading',
    fileRemovedLabel: 'Attachment deleted.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The remove/uploading labels and every screen-reader announcement can be localized.',
      },
    },
  },
});

CustomLabels.test(
  'uses the custom labels',
  async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Delete attachment - data.csv' }),
    );
    const regions = [
      ...canvasElement.querySelectorAll('[aria-live="polite"]'),
    ].map((region) => region.textContent);
    await expect(regions).toContain('Attachment deleted.');
  },
);

export const Empty = meta.story({
  args: {
    uploads: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          'With no uploads only the (empty) live regions render, so announcements survive the list going empty.',
      },
    },
  },
});
