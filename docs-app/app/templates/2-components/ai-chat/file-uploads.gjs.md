<ThemeSwitcher />

# FileUploads

`FileUploads` displays a list of staged file uploads with status indicators
(uploading / done / error), and announces upload-state changes to screen
readers. See also [`FileUploadItem`](./file-upload-item.md), which renders a
single chip and is also used for a file already attached to a sent message.

```gjs live preview
import { FileUploads } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject({
  uploads: [
    { id: '1', file: new File(['hello'], 'notes.txt', { type: 'text/plain' }), status: 'uploading' },
    { id: '2', file: new File(['a,b,c'], 'data.csv', { type: 'text/csv' }), status: 'edit' },
    {
      id: '3',
      file: new File(
        ['<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><rect width="36" height="36" fill="#0f62fe"/></svg>'],
        'photo.svg',
        { type: 'image/svg+xml' },
      ),
      status: 'edit',
    },
    {
      id: '4',
      file: new File(['{}'], 'broken.json', { type: 'application/json' }),
      status: 'edit',
      isError: true,
      errorMessage: 'File exceeds the 10MB limit',
    },
  ],
});

const remove = (detail) => {
  context.uploads = context.uploads.filter((upload) => upload.id !== detail.fileId);
};

<template>
  <ThemeSupport />
  <div style='max-inline-size: 20rem;'>
    <FileUploads @uploads={{context.uploads}} @onRemove={{remove}} />
  </div>
</template>
```

## API Reference

<details>
<summary><h3>FileUploads</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/file-uploads'
    @name='default'
  />
</template>
```
</details>
