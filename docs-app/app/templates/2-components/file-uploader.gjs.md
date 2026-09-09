# FileUploader
<ThemeSwitcher />

`FileUploader` lets a user upload one or more files via a button that opens
the native file picker, showing every selected file with the same
`@filenameStatus`. It's the simple case; for a real upload flow - where
files progress through their own `uploading` -> `complete`/`edit` states
independently, and users can drag and drop files onto the page - compose
`FileUploaderDropContainer` and `FileUploaderItem` directly, shown further
down.

`FileUploader` yields a `clearFiles` action that resets the selected-file
list, e.g. once a caller has finished uploading every file - it's the only
supported way to reset the picker without destroying/recreating the
component.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Button, FileUploader } from 'carbon-components-ember/components';
import { array } from '@ember/helper';
<template>
  <ThemeSupport />
  <FileUploader
    @labelTitle='Upload files'
    @labelDescription='Max file size is 1 MB. Only .jpg and .png files are supported.'
    @buttonLabel='Add file'
    @accept={{array '.jpg' '.png'}}
    @multiple={{true}}
    @filenameStatus='edit'
  as |clearFiles|>
    <Button @ghost={{true}} @size='sm' @onClick={{clearFiles}}>Clear files</Button>
  </FileUploader>
</template>
```

## Drag and drop

`FileUploaderDropContainer` renders the drop target (with a hidden file
picker fallback) and calls `@onAddFiles` with whatever files were added,
without rendering the selected-file list itself - that's left to the
caller so each file's status can progress independently, most commonly by
rendering a `FileUploaderItem` per file. This example simulates a real
upload: each file starts `uploading`, becomes `complete`, and then `edit`
(so it can be removed) once its simulated upload finishes.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { FileUploaderDropContainer, FileUploaderItem } from 'carbon-components-ember/components';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject({ files: [] });

let nextId = 0;

const simulateUpload = (uuid) => {
  setTimeout(() => {
    context.files = context.files.map((file) =>
      file.uuid === uuid ? { ...file, status: 'complete', iconDescription: 'Upload complete' } : file,
    );
  }, 1000);
  setTimeout(() => {
    context.files = context.files.map((file) =>
      file.uuid === uuid ? { ...file, status: 'edit', iconDescription: 'Delete file' } : file,
    );
  }, 2000);
};

const handleAddFiles = (event, { addedFiles }) => {
  const newFiles = addedFiles.map((file) => ({
    uuid: `docs-file-uploader-${++nextId}`,
    name: file.name,
    status: 'uploading',
    iconDescription: 'Uploading',
    invalid: file.invalidFileType,
    errorSubject: file.invalidFileType ? 'Invalid file type' : undefined,
    errorBody: file.invalidFileType ? `"${file.name}" is not a supported file type.` : undefined,
  }));
  context.files = [...context.files, ...newFiles];
  newFiles.filter((file) => !file.invalid).forEach((file) => simulateUpload(file.uuid));
};

const handleDelete = (event, { uuid }) => {
  context.files = context.files.filter((file) => file.uuid !== uuid);
};

<template>
  <ThemeSupport />
  <div style='width: 400px'>
    <p class='cds--label-description' style='margin-bottom: 0.5rem'>
      Max file size is 1 MB. Supported file types are .jpg and .png.
    </p>
    <FileUploaderDropContainer
      @labelText='Drag and drop files here or click to upload'
      @accept={{array '.jpg' '.png'}}
      @multiple={{true}}
      @onAddFiles={{handleAddFiles}}
    />
    <div class='cds--file-container cds--file-container--drop'>
      {{#each context.files key='uuid' as |file|}}
        <FileUploaderItem
          @uuid={{file.uuid}}
          @name={{file.name}}
          @status={{file.status}}
          @iconDescription={{file.iconDescription}}
          @invalid={{file.invalid}}
          @errorSubject={{file.errorSubject}}
          @errorBody={{file.errorBody}}
          @onDelete={{handleDelete}}
        />
      {{/each}}
    </div>
  </div>
</template>
```

## Skeleton

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { FileUploaderSkeleton } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <div style='width: 400px'>
    <FileUploaderSkeleton />
  </div>
</template>
```

## API Reference

<details>
<summary><h3>FileUploader</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/file-uploader' 
    @name='default' 
  />
</template>
```
</details>

<details>
<summary><h3>FileUploaderButton</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/file-uploader/file-uploader-button' 
    @name='default' 
  />
</template>
```
</details>

<details>
<summary><h3>FileUploaderDropContainer</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/file-uploader/file-uploader-drop-container' 
    @name='default' 
  />
</template>
```
</details>

<details>
<summary><h3>FileUploaderItem</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/file-uploader/file-uploader-item' 
    @name='default' 
  />
</template>
```
</details>

<details>
<summary><h3>FileUploaderSkeleton</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/file-uploader/file-uploader-skeleton' 
    @name='default' 
  />
</template>
```
</details>
