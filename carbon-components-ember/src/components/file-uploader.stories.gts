import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { runTask } from 'ember-lifeline';
import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import FileUploader from './file-uploader.gts';
import FileUploaderButton from './file-uploader/file-uploader-button.gts';
import FileUploaderDropContainer from './file-uploader/file-uploader-drop-container.gts';
import FileUploaderItem from './file-uploader/file-uploader-item.gts';
import FileUploaderSkeleton from './file-uploader/file-uploader-skeleton.gts';
import FormItem from './form-item.gts';

import type { FileUploaderSignature } from './file-uploader.gts';
import type { FileUploaderAddedFile } from './file-uploader/file-uploader-drop-container.gts';

// Mirrors Carbon React's `Components/FileUploader` stories: `Default`,
// `FileUploaderItem`, `FileUploaderDropContainer`, the two drag-and-drop
// example applications and `Skeleton`. The docs-app's "clear files" example
// is `WithClearFiles`.
//
// Parity gaps:
// - `FileUploaderDropContainer` has no `size` arg (React sizes the drop
//   area `sm`/`md`/`lg`), and no `innerRef`, so the example apps can't hand
//   focus back to the drop area after deleting a file the way React's do.
// - `FileUploaderItem` has no `filesize` arg.
// - `FileUploader`'s `onDelete` isn't reachable from React-style
//   `iconDescription`-only usage: files are only removable when
//   `@filenameStatus` is `edit` (same as React).

type Size = 'sm' | 'md' | 'lg';
type Status = 'uploading' | 'edit' | 'complete';

// One meta covers the uploader and its sub-components (as React's does), so
// the story args are the union of what each story's component takes.
type StoryArgs = Omit<
  FileUploaderSignature['Args'],
  'onDelete' | 'filenameStatus' | 'size'
> & {
  filenameStatus?: Status;
  size?: Size;
  onDelete?: (...args: unknown[]) => void;
  // FileUploaderItem
  status?: Status;
  uuid?: string;
  invalid?: boolean;
  errorBody?: string;
  errorSubject?: string;
  // FileUploaderDropContainer
  labelText?: string;
};

// The callback args are spies set once on the meta; the per-story arg sets
// below only hold data.
type DataArgs = Omit<
  StoryArgs,
  'onAddFiles' | 'onChange' | 'onClick' | 'onDelete'
>;

interface UploadedFile {
  uuid: string;
  name: string;
  filesize: number;
  status: Status;
  iconDescription: string;
  invalid?: boolean;
  invalidFileType?: boolean;
  errorSubject?: string;
  errorBody?: string;
}

let nextId = 0;

/**
 * Carbon React's `ExampleDropContainerApp` / `ExampleDropContainerAppSingle`:
 * a drop container plus one `FileUploaderItem` per file, each simulating its
 * own upload (`uploading` -> `complete` -> `edit`).
 */
class ExampleDropContainerApp extends Component<{ Args: StoryArgs }> {
  @tracked files: UploadedFile[] = [];

  update(uuid: string, changes: Partial<UploadedFile>) {
    this.files = this.files.map((file) =>
      file.uuid === uuid ? { ...file, ...changes } : file,
    );
  }

  uploadFile(file: UploadedFile) {
    if (file.filesize > 512000) {
      this.update(file.uuid, {
        status: 'edit',
        iconDescription: 'Delete file',
        invalid: true,
        errorSubject: 'File size exceeds limit',
        errorBody: '1 MB max file size. Select a new file and try again.',
      });
      return;
    }
    if (file.invalidFileType) {
      this.update(file.uuid, {
        status: 'edit',
        iconDescription: 'Delete file',
        invalid: true,
        errorSubject: 'Invalid file type',
        errorBody: `"${file.name}" does not have a valid file type.`,
      });
      return;
    }
    // Fixed (rather than React's random) delays keep the tests predictable;
    // `runTask` cancels them if the story is torn down first.
    runTask(
      this,
      () =>
        this.update(file.uuid, {
          status: 'complete',
          iconDescription: 'Upload complete',
        }),
      500,
    );
    runTask(
      this,
      () =>
        this.update(file.uuid, {
          status: 'edit',
          iconDescription: 'Delete file',
        }),
      1500,
    );
  }

  onAddFiles = (
    event: Event,
    { addedFiles }: { addedFiles: FileUploaderAddedFile[] },
  ) => {
    event.stopPropagation();
    this.args.onAddFiles?.(event, { addedFiles });
    const newFiles: UploadedFile[] = addedFiles.map((file) => ({
      uuid: `example-file-${++nextId}`,
      name: file.name,
      filesize: file.size,
      status: 'uploading',
      iconDescription: 'Uploading',
      invalidFileType: file.invalidFileType,
    }));
    if (this.args.multiple) {
      this.files = [...this.files, ...newFiles];
      newFiles.forEach((file) => this.uploadFile(file));
    } else if (newFiles[0]) {
      this.files = [newFiles[0]];
      this.uploadFile(newFiles[0]);
    }
  };

  onDelete = (event: Event, { uuid }: { uuid: string }) => {
    this.args.onDelete?.(event, { uuid });
    this.files = this.files.filter((file) => file.uuid !== uuid);
  };

  <template>
    <FormItem>
      <p
        class="cds--file--label {{if @disabled 'cds--file--label--disabled'}}"
      >Upload files</p>
      <p
        class="cds--label-description
          {{if @disabled 'cds--label-description--disabled'}}"
      >Max file size is 1 MB. Supported file types are .jpg and .png.</p>
      <FileUploaderDropContainer
        @accept={{@accept}}
        @disabled={{@disabled}}
        @labelText={{@labelText}}
        @maxFileSize={{@maxFileSize}}
        @multiple={{@multiple}}
        @name={{@name}}
        @onClick={{@onClick}}
        @onAddFiles={{this.onAddFiles}}
      />
      <div class="cds--file-container cds--file-container--drop">
        {{#each this.files key="uuid" as |file|}}
          <FileUploaderItem
            @disabled={{@disabled}}
            @uuid={{file.uuid}}
            @name={{file.name}}
            @size={{@size}}
            @status={{file.status}}
            @iconDescription={{file.iconDescription}}
            @invalid={{file.invalid}}
            @errorSubject={{file.errorSubject}}
            @errorBody={{file.errorBody}}
            @onDelete={{this.onDelete}}
          />
        {{/each}}
      </div>
    </FormItem>
  </template>
}

const fileUploaderArgs: DataArgs = {
  accept: ['.jpg', '.png'],
  buttonKind: 'primary',
  buttonLabel: 'Add file',
  disabled: false,
  filenameStatus: 'edit',
  iconDescription: 'Delete file',
  labelDescription: 'Max file size is 1 MB. Only .jpg files are supported.',
  labelTitle: 'Upload files',
  maxFileSize: 1024 * 1024,
  multiple: true,
  name: '',
  size: 'md',
};

const fileUploaderItemArgs: DataArgs = {
  disabled: false,
  errorBody: '1 MB max file size. Select a new file and try again.',
  errorSubject: 'File size exceeds limit',
  iconDescription: 'Delete file',
  invalid: false,
  name: 'THIS IS A VERY LONG FILENAME WHICH WILL BE TRUNCATED',
  size: 'md',
  status: 'edit',
  uuid: 'storybook-file',
};

const dropContainerArgs: DataArgs = {
  accept: ['image/jpeg', 'image/png'],
  disabled: false,
  labelText: 'Drag and drop files here or click to upload',
  maxFileSize: 1024 * 1024,
  multiple: true,
  name: '',
  size: 'md',
};

const fileUploaderControls = [
  'accept',
  'buttonKind',
  'buttonLabel',
  'disabled',
  'filenameStatus',
  'iconDescription',
  'labelDescription',
  'labelTitle',
  'maxFileSize',
  'multiple',
  'name',
  'size',
];
const fileUploaderItemControls = Object.keys(fileUploaderItemArgs);
const dropContainerControls = Object.keys(dropContainerArgs).filter(
  (key) => key !== 'size',
);

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/FileUploader',
  component: FileUploader,
  subcomponents: {
    FileUploaderButton,
    FileUploaderSkeleton,
    FileUploaderItem,
    FileUploaderDropContainer,
  },
  parameters: {
    docs: {
      description: {
        component: `\`FileUploader\` lets a user upload one or more files via a button that opens the native file picker, showing every selected file with the same \`@filenameStatus\`. It's the simple case; for a real upload flow — where files progress through their own \`uploading\` → \`complete\`/\`edit\` states independently, and users can drag and drop files onto the page — compose \`FileUploaderDropContainer\` and \`FileUploaderItem\` directly (see the drag-and-drop example applications).

\`FileUploader\` yields a \`clearFiles\` action that resets the selected-file list, e.g. once a caller has finished uploading every file — it's the only supported way to reset the picker without destroying/recreating the component.`,
      },
    },
  },
  args: {
    ...fileUploaderArgs,
    onAddFiles: fn(),
    onChange: fn(),
    onClick: fn(),
    onDelete: fn(),
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
        'tertiary',
      ],
    },
    filenameStatus: {
      control: 'select',
      options: ['edit', 'complete', 'uploading'],
    },
    status: {
      control: 'inline-radio',
      options: ['edit', 'complete', 'uploading'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => <template>
    <div class="cds--file__container">
      <FileUploader
        @accept={{args.accept}}
        @buttonKind={{args.buttonKind}}
        @buttonLabel={{args.buttonLabel}}
        @disabled={{args.disabled}}
        @filenameStatus={{if args.filenameStatus args.filenameStatus "edit"}}
        @iconDescription={{args.iconDescription}}
        @labelDescription={{args.labelDescription}}
        @labelTitle={{args.labelTitle}}
        @maxFileSize={{args.maxFileSize}}
        @multiple={{args.multiple}}
        @name={{args.name}}
        @size={{args.size}}
        @onAddFiles={{args.onAddFiles}}
        @onChange={{args.onChange}}
        @onClick={{args.onClick}}
        @onDelete={{args.onDelete}}
      />
    </div>
  </template>,
});

export const Default = meta.story({
  parameters: { controls: { include: fileUploaderControls } },
});

Default.test(
  'lists picked files and removes them again',
  async ({ canvas, userEvent, args }) => {
    await userEvent.upload(
      canvas.getByLabelText('Add file'),
      new File(['a'], 'photo.png', { type: 'image/png' }),
    );
    await expect(canvas.getByText('photo.png')).toBeVisible();
    await expect(args.onChange).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ action: 'add' }),
    );

    await userEvent.click(
      canvas.getByRole('button', { name: 'Delete file - photo.png' }),
    );
    await expect(canvas.queryByText('photo.png')).toBeNull();
    await expect(args.onDelete).toHaveBeenCalledOnce();
    await expect(args.onChange).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ action: 'remove', currentFiles: [] }),
    );
  },
);

export const WithClearFiles = meta.story({
  args: {
    labelDescription:
      'Max file size is 1 MB. Only .jpg and .png files are supported.',
  },
  parameters: {
    controls: { include: fileUploaderControls },
    docs: {
      description: {
        story:
          'The yielded `clearFiles` action resets the selected-file list, e.g. once every file has been uploaded.',
      },
    },
  },
  render: (args) => <template>
    <FileUploader
      @accept={{args.accept}}
      @buttonKind={{args.buttonKind}}
      @buttonLabel={{args.buttonLabel}}
      @disabled={{args.disabled}}
      @filenameStatus={{if args.filenameStatus args.filenameStatus "edit"}}
      @iconDescription={{args.iconDescription}}
      @labelDescription={{args.labelDescription}}
      @labelTitle={{args.labelTitle}}
      @maxFileSize={{args.maxFileSize}}
      @multiple={{args.multiple}}
      @name={{args.name}}
      @size={{args.size}}
      @onAddFiles={{args.onAddFiles}}
      @onChange={{args.onChange}}
      @onClick={{args.onClick}}
      @onDelete={{args.onDelete}}
      as |clearFiles|
    >
      <Button @ghost={{true}} @size="sm" @onClick={{clearFiles}}>
        Clear files
      </Button>
    </FileUploader>
  </template>,
});

WithClearFiles.test(
  'clears every selected file',
  async ({ canvas, userEvent, args }) => {
    await userEvent.upload(canvas.getByLabelText('Add file'), [
      new File(['a'], 'one.png', { type: 'image/png' }),
      new File(['b'], 'two.jpg', { type: 'image/jpeg' }),
    ]);
    await expect(canvas.getByText('one.png')).toBeVisible();
    await expect(canvas.getByText('two.jpg')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Clear files' }));
    await expect(canvas.queryByText('one.png')).toBeNull();
    await expect(canvas.queryByText('two.jpg')).toBeNull();
    await expect(args.onChange).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ action: 'clear' }),
    );
  },
);

export const FileUploaderItemStory = meta.story({
  name: 'File Uploader Item',
  args: { ...fileUploaderItemArgs },
  parameters: { controls: { include: fileUploaderItemControls } },
  render: (args) => <template>
    <FileUploaderItem
      @disabled={{args.disabled}}
      @errorBody={{args.errorBody}}
      @errorSubject={{args.errorSubject}}
      @iconDescription={{args.iconDescription}}
      @invalid={{args.invalid}}
      @name={{args.name}}
      @size={{args.size}}
      @status={{args.status}}
      @uuid={{args.uuid}}
      @onDelete={{args.onDelete}}
    />
  </template>,
});

FileUploaderItemStory.test(
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

export const FileUploaderItemInvalid = FileUploaderItemStory.extend({
  name: 'File Uploader Item (invalid)',
  args: { invalid: true },
});

FileUploaderItemInvalid.test('shows the error', async ({ canvas }) => {
  await expect(canvas.getByText('File size exceeds limit')).toBeVisible();
  await expect(
    canvas.getByText('1 MB max file size. Select a new file and try again.'),
  ).toBeVisible();
});

export const FileUploaderDropContainerStory = meta.story({
  name: 'File Uploader Drop Container',
  args: { ...dropContainerArgs },
  parameters: { controls: { include: dropContainerControls } },
  render: (args) => <template>
    <FileUploaderDropContainer
      @accept={{args.accept}}
      @disabled={{args.disabled}}
      @labelText={{args.labelText}}
      @maxFileSize={{args.maxFileSize}}
      @multiple={{args.multiple}}
      @name={{args.name}}
      @onAddFiles={{args.onAddFiles}}
      @onClick={{args.onClick}}
    />
  </template>,
});

FileUploaderDropContainerStory.test(
  'reports added files',
  async ({ canvas, userEvent, args }) => {
    const file = new File(['hello'], 'photo.png', { type: 'image/png' });
    await userEvent.upload(
      canvas.getByLabelText('Drag and drop files here or click to upload'),
      file,
    );
    await expect(args.onAddFiles).toHaveBeenCalledWith(expect.anything(), {
      addedFiles: [file],
    });
  },
);

export const DragAndDropUploadContainerExampleApplication = meta.story({
  args: { ...dropContainerArgs },
  parameters: {
    controls: { include: dropContainerControls },
    docs: {
      description: {
        story:
          '`FileUploaderDropContainer` renders the drop target (with a hidden file picker fallback) and calls `@onAddFiles` with whatever files were added, without rendering the selected-file list itself — that’s left to the caller so each file’s status can progress independently, most commonly by rendering a `FileUploaderItem` per file. This example simulates a real upload: each file starts `uploading`, becomes `complete`, and then `edit` (so it can be removed) once its simulated upload finishes.',
      },
    },
  },
  render: (args) => <template>
    <div style="width: 400px">
      <ExampleDropContainerApp
        @accept={{args.accept}}
        @disabled={{args.disabled}}
        @labelText={{args.labelText}}
        @maxFileSize={{args.maxFileSize}}
        @multiple={{args.multiple}}
        @name={{args.name}}
        @size={{args.size}}
        @onAddFiles={{args.onAddFiles}}
        @onClick={{args.onClick}}
        @onDelete={{args.onDelete}}
      />
    </div>
  </template>,
});

DragAndDropUploadContainerExampleApplication.test(
  'uploads each added file and lets it be removed',
  async ({ canvas, userEvent, args }) => {
    const input = canvas.getByLabelText(
      'Drag and drop files here or click to upload',
    );
    await userEvent.upload(input, [
      new File(['a'], 'first.png', { type: 'image/png' }),
      new File(['b'], 'second.jpg', { type: 'image/jpeg' }),
    ]);
    await expect(args.onAddFiles).toHaveBeenCalledOnce();
    await expect(canvas.getByText('first.png')).toBeVisible();
    await expect(canvas.getByText('second.jpg')).toBeVisible();

    const remove = await waitFor(
      () => canvas.getByRole('button', { name: 'Delete file - first.png' }),
      { timeout: 4000 },
    );
    await userEvent.click(remove);
    await expect(args.onDelete).toHaveBeenCalledOnce();
    await expect(canvas.queryByText('first.png')).toBeNull();
    await expect(canvas.getByText('second.jpg')).toBeVisible();
  },
);

export const DragAndDropUploadSingleContainerExampleApplication =
  DragAndDropUploadContainerExampleApplication.extend({
    args: {
      labelText: 'Drag and drop a file here or click to upload',
      multiple: false,
    },
  });

DragAndDropUploadSingleContainerExampleApplication.test(
  'replaces the previous file',
  async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText(
      'Drag and drop a file here or click to upload',
    );
    await userEvent.upload(
      input,
      new File(['a'], 'first.png', { type: 'image/png' }),
    );
    await expect(canvas.getByText('first.png')).toBeVisible();
    await userEvent.upload(
      input,
      new File(['b'], 'second.png', { type: 'image/png' }),
    );
    await expect(canvas.getByText('second.png')).toBeVisible();
    await expect(canvas.queryByText('first.png')).toBeNull();
  },
);

export const Skeleton = meta.story({
  parameters: { controls: { disable: true } },
  render: () => <template>
    <div style="width: 500px">
      <FileUploaderSkeleton />
    </div>
  </template>,
});
