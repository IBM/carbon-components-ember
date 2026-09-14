<ThemeSwitcher />

# FileUploadItem

A single file chip with an optional media preview or file-type icon. Used
by [`FileUploads`](./file-uploads.md) for staged uploads, and directly for a
file already attached to a sent message via `@readOnly`.

```gjs live preview
import { hash } from '@ember/helper';
import { FileUploadItem } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const notesFile = new File(['hello'], 'notes.txt', { type: 'text/plain' });
const photoFile = new File(
  ['<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><rect width="36" height="36" fill="#0f62fe"/></svg>'],
  'photo.svg',
  { type: 'image/svg+xml' },
);

<template>
  <ThemeSupport />
  <div style='display: flex; gap: 0.5rem; flex-wrap: wrap;'>
    <FileUploadItem @upload={{hash id='1' file=notesFile status='edit'}} />
    <FileUploadItem @upload={{hash id='2' file=photoFile status='edit'}} />
    <FileUploadItem @readOnly={{true}} @upload={{hash id='3' name='report.pdf' mimeType='application/pdf'}} />
  </div>
</template>
```

## API Reference

<details>
<summary><h3>FileUploadItem</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/file-upload-item'
    @name='default'
  />
</template>
```
</details>
