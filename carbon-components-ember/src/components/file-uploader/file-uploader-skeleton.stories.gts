import preview from '#storybook/preview.ts';
import FileUploaderSkeleton from './file-uploader-skeleton.gts';

// Carbon React has no stories of its own for FileUploaderSkeleton: it's the
// `Skeleton` story of Components/FileUploader. It takes no arguments.

const meta = preview.meta({
  title: 'Components/FileUploader/FileUploaderSkeleton',
  component: FileUploaderSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder for a `FileUploader`: the title, the description and the button. It takes no arguments; any attributes are applied to its root `<div>`.',
      },
    },
  },
  render: () => <template>
    <div style="width: 500px">
      <FileUploaderSkeleton />
    </div>
  </template>,
});

export const Default = meta.story();
