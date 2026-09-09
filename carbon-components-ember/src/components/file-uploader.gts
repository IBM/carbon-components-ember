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
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import FileUploaderButton from './file-uploader/file-uploader-button.gts';
import FileUploaderStatusIcon from './file-uploader/-status-icon.gts';
import type { FileUploaderAddedFile } from './file-uploader/file-uploader-drop-container.gts';

export interface FileUploaderFileItem {
  name: string;
  uuid: string;
  file: File;
}

export interface FileUploaderChangeData {
  addedFiles: FileUploaderFileItem[];
  removedFiles: FileUploaderFileItem[];
  currentFiles: FileUploaderFileItem[];
  action: 'add' | 'remove' | 'clear';
}

export interface FileUploaderSignature {
  Element: HTMLDivElement;
  Args: {
    /** Specify the types of files that this input should be able to receive */
    accept?: string[];
    /** Specify the type of the underlying `FileUploaderButton` */
    buttonKind?:
      | 'primary'
      | 'secondary'
      | 'danger'
      | 'ghost'
      | 'danger--primary'
      | 'danger--ghost'
      | 'danger--tertiary'
      | 'tertiary';
    /** Provide the label text read by screen readers for the upload button */
    buttonLabel?: string;
    /** Specify whether file input is disabled */
    disabled?: boolean;
    /** Specify the status applied to every selected file */
    filenameStatus: 'edit' | 'complete' | 'uploading';
    /** Provide a description for the status icon, read by screen readers */
    iconDescription?: string;
    /** Specify the description text of this FileUploader */
    labelDescription?: string;
    /** Specify the title text of this FileUploader */
    labelTitle?: string;
    /** Maximum file size allowed in bytes. Files larger than this are marked invalid */
    maxFileSize?: number;
    /** Specify if the component should accept multiple files to upload */
    multiple?: boolean;
    /** Provide a name for the underlying `<input>` node */
    name?: string;
    /** Called after files are added, before they're marked invalid/filtered */
    onAddFiles?: (
      event: Event,
      data: { addedFiles: FileUploaderAddedFile[] },
    ) => void;
    /** Called each time the selected-file list changes */
    onChange?: (event: Event, data: FileUploaderChangeData) => void;
    /** Called each time a selected file's status icon is activated */
    onClick?: (event: Event) => void;
    /** Called when a selected file is removed (only reachable when `@filenameStatus` is `'edit'`) */
    onDelete?: (
      event: Event,
      data: { deletedFile: FileUploaderFileItem; remainingFiles: FileUploaderFileItem[] },
    ) => void;
    /** Specify the size of the FileUploaderButton, from a list of available sizes */
    size?: 'sm' | 'small' | 'md' | 'field' | 'lg';
  };
  Blocks: {
    /** Yields a `clearFiles`-style action that resets the selected-file list, e.g. after a successful upload */
    default: [clearFiles: () => void];
  };
}

/**
 * The simple, button-triggered (no drag-and-drop) file upload pattern: a
 * label, an upload button, and a list of selected files that all share
 * `@filenameStatus`. For a real upload flow where files progress through
 * their own uploading -> complete/edit states independently, compose
 * `FileUploaderDropContainer` and `FileUploaderItem` directly instead (see
 * the docs for the full pattern) - that's what Carbon React's own docs
 * recommend `FileUploader` be replaced with for anything beyond the basic
 * case.
 */
export default class FileUploader extends Component<FileUploaderSignature> {
  @tracked fileItems: FileUploaderFileItem[] = [];

  guid = guidFor(this);
  buttonElement?: HTMLButtonElement;

  get helperTextId() {
    return `file-uploader-helper-${this.guid}`;
  }

  get selectedFileClasses() {
    const size = this.args.size ?? 'md';
    const classes = ['cds--file__selected-file'];
    if (size === 'field' || size === 'md') classes.push('cds--file__selected-file--md');
    if (size === 'small' || size === 'sm') classes.push('cds--file__selected-file--sm');
    return classes.join(' ');
  }

  @action
  setButtonElement(element: HTMLButtonElement) {
    this.buttonElement = element;
  }

  /** Resets the selected-file list, e.g. after a successful upload. Yielded to callers as `clearFiles`. */
  @action
  clear() {
    const previousItems = this.fileItems;
    if (!previousItems.length) return;

    this.fileItems = [];
    this.args.onChange?.(new Event('change'), {
      addedFiles: [],
      removedFiles: previousItems,
      currentFiles: [],
      action: 'clear',
    });
  }

  @action
  handleFilesAdded(event: Event) {
    const incoming = Array.from((event.target as HTMLInputElement).files ?? []);
    const files: FileUploaderAddedFile[] = this.args.multiple
      ? incoming
      : incoming.slice(0, 1);

    for (const file of files) {
      if (this.args.maxFileSize && file.size > this.args.maxFileSize) {
        file.invalidFileType = true;
      }
    }

    this.args.onAddFiles?.(event, { addedFiles: files });

    const validFiles = files.filter((file) => !file.invalidFileType);
    if (!validFiles.length) return;

    const newItems: FileUploaderFileItem[] = validFiles.map((file) => ({
      name: file.name,
      uuid: `${this.guid}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
    }));

    let updated: FileUploaderFileItem[];
    if (this.args.multiple) {
      const existingNames = new Set(this.fileItems.map((item) => item.name));
      updated = [
        ...this.fileItems,
        ...newItems.filter((item) => !existingNames.has(item.name)),
      ];
    } else {
      updated = newItems;
    }

    this.fileItems = updated;
    this.args.onChange?.(event, {
      addedFiles: newItems,
      removedFiles: [],
      currentFiles: updated,
      action: 'add',
    });
  }

  @action
  handleItemActivate(index: number, event: Event) {
    if (this.args.filenameStatus !== 'edit') return;
    const deletedFile = this.fileItems[index];
    if (!deletedFile) return;

    const remaining = this.fileItems.filter((_, i) => i !== index);
    this.fileItems = remaining;

    this.args.onDelete?.(event, { deletedFile, remainingFiles: remaining });
    this.args.onChange?.(event, {
      addedFiles: [],
      removedFiles: [deletedFile],
      currentFiles: remaining,
      action: 'remove',
    });
    this.args.onClick?.(event);
    this.buttonElement?.focus();
  }

  <template>
    <div class='cds--form-item' ...attributes>
      {{#if @labelTitle}}
        <h3
          class='cds--file--label
            {{if @disabled "cds--label-description--disabled"}}'
        >{{@labelTitle}}</h3>
      {{/if}}
      <p
        class='cds--label-description
          {{if @disabled "cds--label-description--disabled"}}'
        id={{this.helperTextId}}
      >{{@labelDescription}}</p>
      <FileUploaderButton
        @disabled={{@disabled}}
        @labelText={{@buttonLabel}}
        @multiple={{@multiple}}
        @buttonKind={{@buttonKind}}
        @disableLabelChanges={{true}}
        @accept={{@accept}}
        @name={{@name}}
        @size={{@size}}
        @onChange={{this.handleFilesAdded}}
        @onButtonInsert={{this.setButtonElement}}
        aria-describedby={{this.helperTextId}}
      />
      <div class='cds--file-container'>
        {{#each this.fileItems key='uuid' as |item index|}}
          <span class={{this.selectedFileClasses}}>
            <p
              class='cds--file-filename'
              id='{{this.guid}}-file-{{item.uuid}}'
            >{{item.name}}</p>
            <span class='cds--file__state-container'>
              <FileUploaderStatusIcon
                @status={{@filenameStatus}}
                @name={{item.name}}
                @disabled={{@disabled}}
                @iconDescription={{@iconDescription}}
                @onActivate={{fn this.handleItemActivate index}}
              />
            </span>
          </span>
        {{/each}}
      </div>
      {{yield (fn this.clear)}}
    </div>
  </template>
}
