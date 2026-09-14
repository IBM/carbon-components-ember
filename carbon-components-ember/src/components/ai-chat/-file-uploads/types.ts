/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Possible status values for a file upload. `SUCCESS` and `COMPLETE` both
 * mean the upload finished without error, but they are not interchangeable:
 * `SUCCESS` is the transient state shown the moment an upload succeeds (a
 * brief checkmark), while `COMPLETE` is the settled, persisted terminal
 * state (no progress or success affordance shown at all).
 */
export enum FileStatusValue {
  COMPLETE = 'complete',
  EDIT = 'edit',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
}

/** A file staged in the input area, with the live `File` and its upload status. */
export interface FileUpload {
  id: string;
  file: File;
  status: FileStatusValue;
  isError?: boolean;
  errorMessage?: string;
}

/**
 * A file attached to a message that has already been sent. The counterpart
 * to {@link FileUpload}: an attachment always states its name/type outright
 * and may have no `File` at all, since a message restored from
 * conversation history cannot serialize one.
 */
export interface FileAttachment {
  id: string;
  name?: string;
  mimeType?: string;
  file?: File;
  url?: string;
}

export interface FileRemoveEventDetail {
  fileId: string;
}
