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

<template>
  <ThemeSupport />
  <div style='display: flex; gap: 0.5rem; flex-wrap: wrap;'>
    <FileUploadItem @upload={{hash id='1' file=notesFile status='edit'}} />
    <FileUploadItem @readOnly={{true}} @upload={{hash id='2' name='report.pdf' mimeType='application/pdf'}} />
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
