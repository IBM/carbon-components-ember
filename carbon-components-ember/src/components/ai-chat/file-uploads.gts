/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import FileUploadItem from './file-upload-item.gts';
import { FileStatusValue, type FileRemoveEventDetail, type FileUpload } from './-file-uploads/types.ts';

export type Args = {
  uploads?: FileUpload[];
  removeFileLabel?: string;
  uploadingFileLabel?: string;
  /** Announced when a file is removed. */
  fileRemovedLabel?: string;
  /** Announced when a file finishes uploading successfully. */
  uploadSuccessLabel?: string;
  /** Announced when a file fails to upload. */
  uploadFailureLabel?: string;
  /** Announcement made when one or more files are added in the same frame. Receives the batch count. */
  getFilesAddedText?: (args: { count: number }) => string;
  /** Announcement made when one or more files begin uploading in the same frame. Receives the batch count. */
  getFilesUploadingText?: (args: { count: number }) => string;
  onRemove?: (detail: FileRemoveEventDetail) => void;
};

export interface FileUploadsSignature {
  Element: HTMLDivElement;
  Args: Args;
}

interface UploadSnapshot {
  status: FileStatusValue;
  isError: boolean;
}

/**
 * Displays a list of staged file uploads with status indicators, and
 * announces upload-state changes (added / uploading / success / failure /
 * removed) to screen readers via a pair of alternating `aria-live` regions
 * (alternating - rather than writing the same region twice - is what makes
 * two back-to-back identical announcements both actually fire; a
 * single region only announces on a text *change*).
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-file-uploads`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/file-uploads).
 * Doesn't collide with any Carbon React component name, so it stays
 * unprefixed. `FileUploadItem`'s file-type icon and status affordance
 * were kept close to their basename (`FileUploadItem`) despite this
 * addon's existing, differently-named `FileUploaderItem` (Carbon React's
 * `FileUploader` sub-component) - the two don't collide via `find | sort |
 * uniq -d` and serve entirely different components, so no override was
 * needed per Pitfall 4's check.
 */
export default class FileUploads extends Component<FileUploadsSignature> {
  @tracked hasOverflow = false;
  @tracked regionA = '';
  @tracked regionB = '';

  // Plain (untracked) bookkeeping, deliberately not @tracked: several
  // transitions can be announced synchronously within one
  // `announceTransitions()` call (e.g. two files erroring in the same
  // frame), each calling `announce()` in turn. Reading a @tracked value
  // that a *previous* call in the same computation already wrote trips
  // Ember's backtracking-rerender assertion - this value is never read by
  // the template, so there's no reactivity to lose by keeping it plain.
  private activeRegion: 0 | 1 = 0;

  private snapshots = new Map<string, UploadSnapshot>();
  private hasSeededSnapshots = false;

  get uploads() {
    return this.args.uploads ?? [];
  }

  announce(text: string) {
    if (this.activeRegion === 0) {
      this.regionA = text;
      this.regionB = '';
    } else {
      this.regionB = text;
      this.regionA = '';
    }
    this.activeRegion = this.activeRegion === 0 ? 1 : 0;
  }

  snapshotOf(uploads: FileUpload[]): Map<string, UploadSnapshot> {
    return new Map(uploads.map((upload) => [upload.id, { status: upload.status, isError: Boolean(upload.isError) }]));
  }

  watchOverflow = modifier((element: HTMLElement) => {
    const check = () => {
      this.hasOverflow = element.scrollWidth > element.clientWidth;
    };
    const observer = new ResizeObserver(check);
    observer.observe(element);
    return () => observer.disconnect();
  });

  // Fires on install (seeds `snapshots` from the already-rendered set, so
  // it doesn't produce a burst of "added" announcements on first paint -
  // matching upstream's own `firstUpdated` seeding) and again whenever
  // `@uploads`' identity changes (a consumer is expected to pass a new
  // array reference on each real change, same as every other tracked-array
  // arg in this addon).
  watchUploadsAction = modifier((_element: Element, positional: [FileUpload[]]) => {
    const uploads = positional[0];
    if (!this.hasSeededSnapshots) {
      this.snapshots = this.snapshotOf(uploads);
      this.hasSeededSnapshots = true;
      return;
    }
    this.announceTransitions();
  });

  announceTransitions() {
    const previous = this.snapshots;
    let addedCount = 0;
    let uploadingCount = 0;

    for (const upload of this.uploads) {
      const before = previous.get(upload.id);
      const isError = Boolean(upload.isError);

      if (!before) {
        if (upload.status === FileStatusValue.UPLOADING) {
          uploadingCount += 1;
        } else if (isError) {
          this.announce(this.args.uploadFailureLabel ?? 'There was an error uploading the file.');
        } else {
          addedCount += 1;
        }
      } else if (!before.isError && isError) {
        this.announce(this.args.uploadFailureLabel ?? 'There was an error uploading the file.');
      } else if (before.status === FileStatusValue.UPLOADING && upload.status !== FileStatusValue.UPLOADING && !isError) {
        this.announce(this.args.uploadSuccessLabel ?? 'The file was uploaded successfully.');
      } else if (before.status !== FileStatusValue.UPLOADING && upload.status === FileStatusValue.UPLOADING) {
        uploadingCount += 1;
      }
    }

    if (addedCount > 0) {
      const text = this.args.getFilesAddedText
        ? this.args.getFilesAddedText({ count: addedCount })
        : addedCount === 1 ? 'File added.' : `${addedCount} files added.`;
      this.announce(text);
    }
    if (uploadingCount > 0) {
      const text = this.args.getFilesUploadingText
        ? this.args.getFilesUploadingText({ count: uploadingCount })
        : uploadingCount === 1 ? 'Uploading file.' : `Uploading ${uploadingCount} files.`;
      this.announce(text);
    }

    this.snapshots = this.snapshotOf(this.uploads);
  }

  @action
  handleRemove(detail: FileRemoveEventDetail) {
    this.announce(this.args.fileRemovedLabel ?? 'File removed.');
    this.args.onRemove?.(detail);
  }

  // The outer element - and this modifier - stay mounted for the whole
  // component lifetime, even while @uploads is empty, so the live regions
  // survive a file list going empty, and no "added" announcement is
  // missed by only starting to watch once the list first becomes
  // non-empty.
  <template>
    <div ...attributes {{this.watchUploadsAction this.uploads}}>
      <div class='cds-aichat-file-uploads__live-region' aria-live='polite'>{{this.regionA}}</div>
      <div class='cds-aichat-file-uploads__live-region' aria-live='polite'>{{this.regionB}}</div>

      {{#if this.uploads.length}}
        <div class='cds-aichat-file-uploads__gradient-wrapper {{if this.hasOverflow "cds-aichat-file-uploads__gradient-wrapper--overflow"}}'>
          <div class='cds-aichat-file-uploads__container' {{this.watchOverflow}}>
            {{#each this.uploads key='id' as |upload|}}
              <FileUploadItem
                @upload={{upload}}
                @removeFileLabel={{@removeFileLabel}}
                @uploadingFileLabel={{@uploadingFileLabel}}
                @onRemove={{this.handleRemove}}
              />
            {{/each}}
          </div>
        </div>
      {{/if}}
    </div>
  </template>
}
