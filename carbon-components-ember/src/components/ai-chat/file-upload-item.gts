/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { registerDestructor } from '@ember/destroyable';
import type Owner from '@ember/owner';
import { and, eq, not, or } from 'ember-truth-helpers';
import FileUploaderStatusIcon from '../file-uploader/-status-icon.gts';
import { PlayFilledAlt } from '../../icons.ts';
import { pickFileTypeIcon } from './-file-uploads/file-type-icon.ts';
import { FileStatusValue, type FileAttachment, type FileRemoveEventDetail, type FileUpload } from './-file-uploads/types.ts';

export type Args = {
  upload: FileUpload | FileAttachment | null;
  /** Renders the chip without status or a remove button, for a file on an already-sent message. */
  readOnly?: boolean;
  removeFileLabel?: string;
  uploadingFileLabel?: string;
  /** Text shown when the file's name is not known. */
  fallbackLabel?: string;
  onRemove?: (detail: FileRemoveEventDetail) => void;
};

export interface FileUploadItemSignature {
  Element: HTMLSpanElement;
  Args: Args;
}

function isUpload(value: FileUpload | FileAttachment): value is FileUpload {
  return typeof (value as FileUpload).status === 'string';
}

/**
 * A single file chip with an optional media preview or file-type icon.
 *
 * Serves both places a file appears: in the input area (driven by
 * `@upload` as a `FileUpload`, showing live status and a remove button)
 * and on a sent message (`@readOnly`, driven by either a `FileUpload` or a
 * `FileAttachment` - the latter for a message restored from conversation
 * history, where there is no live `File`).
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-file-upload-item`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/file-uploads).
 * Upstream wraps `@carbon/web-components`' `cds-file-uploader-item` and
 * patches two of its shadow-root-internal styles via injected `<style>`
 * elements, because it exposes no `part=` for either. This port instead
 * reuses this addon's own (private) `FileUploaderStatusIcon` directly and
 * writes its own markup, so those two patches - and the whole "inject a
 * style into a child's shadow root" mechanism - simply don't apply.
 */
export default class FileUploadItem extends Component<FileUploadItemSignature> {
  @tracked failedPreviewURL: string | null = null;
  @tracked objectURL: string | null = null;
  private objectURLFile: File | null = null;

  constructor(owner: Owner, args: FileUploadItemSignature['Args']) {
    super(owner, args);
    registerDestructor(this, () => {
      if (this.objectURL) URL.revokeObjectURL(this.objectURL);
    });
  }

  get resolved(): { name?: string; mimeType?: string; file?: File; url?: string } | null {
    const value = this.args.upload;
    if (!value) return null;
    const attachment = value as FileAttachment;
    const file = (value as FileUpload).file instanceof File ? (value as FileUpload).file : undefined;
    if (file) {
      return { name: attachment.name ?? file.name, mimeType: attachment.mimeType ?? file.type, file };
    }
    return { name: attachment.name, mimeType: attachment.mimeType, url: attachment.url };
  }

  get uploadStatus() {
    const value = this.args.upload;
    return value && isUpload(value) ? value.status : undefined;
  }

  /** The status icon's state. `complete` (the settled, no-longer-transient state) intentionally renders no icon at all. */
  get iconStatus(): 'uploading' | 'edit' | 'complete' | undefined {
    if (this.args.readOnly) return undefined;
    switch (this.uploadStatus) {
      case FileStatusValue.UPLOADING:
        return 'uploading';
      case FileStatusValue.EDIT:
        return 'edit';
      case FileStatusValue.SUCCESS:
        return 'complete';
      default:
        return undefined;
    }
  }

  get uploadError() {
    const value = this.args.upload;
    if (!value || !isUpload(value)) return { isError: false, message: '' };
    return { isError: Boolean(value.isError), message: value.errorMessage ?? '' };
  }

  get displayName() {
    return this.resolved?.name || this.args.fallbackLabel || 'Attachment';
  }

  get hasImagePreview() {
    const resolved = this.resolved;
    if (!resolved) return false;
    const type = resolved.mimeType ?? '';
    if (resolved.file) return type.startsWith('image/');
    return this.canPreviewURL(resolved.url) && type.startsWith('image/');
  }

  get hasVideoPreview() {
    const resolved = this.resolved;
    return Boolean(resolved?.file && (resolved.mimeType ?? '').startsWith('video/'));
  }

  get previewURL(): string | null {
    const resolved = this.resolved;
    if (!resolved) return null;
    if (resolved.file) return this.getOrCreateObjectURL(resolved.file);
    return this.canPreviewURL(resolved.url) ? resolved.url : null;
  }

  get fileTypeIcon() {
    return pickFileTypeIcon(this.resolved?.name, this.resolved?.mimeType);
  }

  canPreviewURL(url: string | undefined): url is string {
    return Boolean(url) && url !== this.failedPreviewURL;
  }

  getOrCreateObjectURL(file: File): string | null {
    if (this.objectURLFile !== file) {
      if (this.objectURL) URL.revokeObjectURL(this.objectURL);
      this.objectURLFile = file;
      this.objectURL = URL.createObjectURL(file);
    }
    return this.objectURL;
  }

  @action
  handleImageError() {
    this.failedPreviewURL = this.resolved?.url ?? null;
  }

  @action
  openVideo() {
    if (this.previewURL) window.open(this.previewURL, '_blank', 'noopener');
  }

  @action
  handleRemove() {
    const upload = this.args.upload;
    if (!upload) return;
    this.args.onRemove?.({ fileId: upload.id });
  }

  <template>
    <span class='cds-aichat-file-upload-item {{if @readOnly "cds-aichat-file-upload-item--read-only"}}' ...attributes>
      {{#if this.hasImagePreview}}
        <span class='cds-aichat-file-upload-item__preview-wrapper'>
          {{! template-lint-disable require-valid-alt-text }}
          <img
            class='cds-aichat-file-upload-item__preview'
            src={{this.previewURL}}
            width='36'
            height='36'
            alt=''
            aria-hidden='true'
            {{on 'error' this.handleImageError}}
          />
        </span>
      {{else if this.hasVideoPreview}}
        <button
          type='button'
          class='cds-aichat-file-upload-item__preview-wrapper cds-aichat-file-upload-item__video-preview-wrapper'
          aria-label='Play video'
          {{on 'click' this.openVideo}}
        >
          <video
            class='cds-aichat-file-upload-item__preview'
            src={{this.previewURL}}
            width='36'
            height='36'
            preload='metadata'
            muted
            playsinline
            aria-hidden='true'
          ></video>
          <span class='cds-aichat-file-upload-item__play-badge' aria-hidden='true'>
            <PlayFilledAlt @size='16' />
          </span>
        </button>
      {{else if this.fileTypeIcon}}
        <span class='cds-aichat-file-upload-item__icon' aria-hidden='true'>
          <this.fileTypeIcon @size={{20}} />
        </span>
      {{/if}}

      <span
        class='cds-aichat-file-upload-item__name {{if (and @readOnly (not this.hasImagePreview) (not this.hasVideoPreview) (not this.fileTypeIcon)) "cds-aichat-file-upload-item__name--no-icon"}}'
        title={{this.displayName}}
      >{{this.displayName}}</span>

      {{#if (and (not @readOnly) this.iconStatus)}}
        <span class='cds-aichat-file-upload-item__status'>
          <FileUploaderStatusIcon
            @status={{this.iconStatus}}
            @name={{this.displayName}}
            @iconDescription={{if (eq this.iconStatus 'uploading') (or @uploadingFileLabel 'Uploading') (or @removeFileLabel 'Remove file')}}
            @onActivate={{this.handleRemove}}
          />
        </span>
      {{/if}}

      {{#if (and (not @readOnly) this.uploadError.isError this.uploadError.message)}}
        <span class='cds-aichat-file-upload-item__error' role='alert'>{{this.uploadError.message}}</span>
      {{/if}}
    </span>
  </template>
}
