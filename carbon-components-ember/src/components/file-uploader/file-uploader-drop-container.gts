/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import captureElement from './-capture-element.ts';

export type FileUploaderAddedFile = File & { invalidFileType?: boolean };

export interface FileUploaderDropContainerSignature {
  Element: HTMLDivElement;
  Args: {
    /** Specify the types of files that this input should be able to receive */
    accept?: string[];
    /** Specify whether file input is disabled */
    disabled?: boolean;
    /** Provide a unique id for the underlying `<input>` node */
    id?: string;
    /** Provide the label text to be read by screen readers when interacting with this control */
    labelText?: string;
    /** Maximum file size allowed in bytes. Files larger than this are marked invalid */
    maxFileSize?: number;
    /** Specify if the component should accept multiple files to upload */
    multiple?: boolean;
    /** Provide a name for the underlying `<input>` node */
    name?: string;
    /** Called after files are added, either by drop or by the file picker */
    onAddFiles?: (
      event: Event,
      data: { addedFiles: FileUploaderAddedFile[] },
    ) => void;
    /** Called each time the drop area is clicked */
    onClick?: (event: MouseEvent) => void;
    /** Provide a custom regex pattern used to extract a file's extension */
    pattern?: string;
  };
}

/**
 * A drag-and-drop target (plus a hidden file-picker fallback) for adding
 * files. Files are validated against `@maxFileSize` and `@accept`, but not
 * removed - invalid files are still included in `addedFiles`, marked with
 * `invalidFileType`, so the caller can render an error state for them (see
 * `FileUploaderItem`'s `@invalid`/`@errorSubject`/`@errorBody`). This
 * mirrors React's `FileUploaderDropContainer`, which does the same for the
 * same reason: it has no UI of its own to show a per-file error.
 */
export default class FileUploaderDropContainer extends Component<FileUploaderDropContainerSignature> {
  @tracked isActive = false;

  guid = guidFor(this);
  inputElement?: HTMLInputElement;

  get inputId() {
    return this.args.id ?? `file-uploader-drop-container-${this.guid}`;
  }

  get labelText() {
    return this.args.labelText ?? 'Add file';
  }

  get acceptAttr() {
    return this.args.accept?.join(',');
  }

  get dropareaClasses() {
    const classes = ['cds--file__drop-container', 'cds--file-browse-btn'];
    if (this.isActive) classes.push('cds--file__drop-container--drag-over');
    if (this.args.disabled) classes.push('cds--file-browse-btn--disabled');
    return classes.join(' ');
  }

  @action
  setInputElement(element: HTMLElement) {
    this.inputElement = element as HTMLInputElement;
  }

  validateFiles(files: File[]): FileUploaderAddedFile[] {
    const accept = this.args.accept ?? [];
    const acceptedTypes = new Set(accept);
    const pattern = this.args.pattern ?? '.[0-9a-z]+$';
    const maxFileSize = this.args.maxFileSize;
    const extensionRegExp = new RegExp(pattern, 'i');
    const result: FileUploaderAddedFile[] = [];

    for (const file of files as FileUploaderAddedFile[]) {
      if (maxFileSize && file.size > maxFileSize) {
        file.invalidFileType = true;
        result.push(file);
        continue;
      }
      if (!accept.length) {
        result.push(file);
        continue;
      }
      const extension = file.name.match(extensionRegExp)?.[0];
      if (extension === undefined) {
        continue;
      }
      if (
        acceptedTypes.has(file.type) ||
        acceptedTypes.has(extension.toLowerCase())
      ) {
        result.push(file);
        continue;
      }
      file.invalidFileType = true;
      result.push(file);
    }
    return result;
  }

  getAddedFiles(files: File[]): FileUploaderAddedFile[] {
    if (!files.length) return [];
    const filesToValidate = this.args.multiple ? files : [files[0] as File];
    return this.validateFiles(filesToValidate);
  }

  @action
  handleDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (this.args.disabled) return;
    this.isActive = true;
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  }

  @action
  handleDragLeave(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (this.args.disabled) return;
    this.isActive = false;
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }

  @action
  handleDrop(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (this.args.disabled) return;
    this.isActive = false;

    const items = event.dataTransfer?.items
      ? Array.from(event.dataTransfer.items)
      : [];
    const files = items.length
      ? items.reduce<File[]>((acc, item) => {
          if (item.kind !== 'file') return acc;
          const entry = (
            item as DataTransferItem & {
              webkitGetAsEntry?: () => { isDirectory?: boolean } | null;
            }
          ).webkitGetAsEntry?.();
          if (entry?.isDirectory) return acc;
          const file = item.getAsFile();
          if (file) acc.push(file);
          return acc;
        }, [])
      : Array.from(event.dataTransfer?.files ?? []);

    const addedFiles = this.getAddedFiles(files);

    if (this.inputElement) {
      try {
        const dataTransfer = new DataTransfer();
        addedFiles.forEach((file) => dataTransfer.items.add(file));
        this.inputElement.files = dataTransfer.files;
      } catch {
        // Some environments reject programmatic file input assignments.
      }
    }

    this.args.onAddFiles?.(event, { addedFiles });
  }

  @action
  handleInputChange(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    this.args.onAddFiles?.(event, { addedFiles: this.getAddedFiles(files) });
  }

  @action
  resetInputValue(event: Event) {
    (event.target as HTMLInputElement).value = '';
  }

  @action
  handleButtonClick(event: MouseEvent) {
    this.args.onClick?.(event);
    if (!this.args.disabled) {
      this.inputElement?.click();
    }
  }

  <template>
    <div
      class='cds--file'
      {{on 'dragover' this.handleDragOver}}
      {{on 'dragleave' this.handleDragLeave}}
      {{on 'drop' this.handleDrop}}
      ...attributes
    >
      <button
        type='button'
        class={{this.dropareaClasses}}
        {{on 'click' this.handleButtonClick}}
      >{{this.labelText}}</button>
      <label for={{this.inputId}} class='cds--visually-hidden'>{{this.labelText}}</label>
      <input
        type='file'
        id={{this.inputId}}
        class='cds--file-input'
        tabindex='-1'
        disabled={{@disabled}}
        accept={{this.acceptAttr}}
        name={{@name}}
        multiple={{@multiple}}
        {{captureElement onInsert=this.setInputElement}}
        {{on 'change' this.handleInputChange}}
        {{on 'click' this.resetInputValue}}
      />
    </div>
  </template>
}
