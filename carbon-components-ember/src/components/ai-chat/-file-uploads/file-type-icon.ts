/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ComponentLike } from '@glint/template';
import { Csv, Doc, Html, Json, Pdf, Ppt, Txt, Xls, Zip } from '../../../icons.ts';

type FileTypeIconComponent = ComponentLike<{ Args: { size?: number } }>;

interface FileTypeIconEntry {
  icon: FileTypeIconComponent;
  mimes: string[];
  extensions: string[];
}

/**
 * The file types the chip has an icon for. Order matters: the first entry
 * matching either the MIME type or the extension wins, so a file whose two
 * disagree resolves to whichever appears first here.
 */
const FILE_TYPE_ICONS: FileTypeIconEntry[] = [
  { icon: Pdf, mimes: ['application/pdf'], extensions: ['pdf'] },
  { icon: Txt, mimes: ['text/plain'], extensions: ['txt'] },
  {
    icon: Xls,
    mimes: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    extensions: ['xls', 'xlsx'],
  },
  { icon: Zip, mimes: ['application/zip', 'application/x-zip-compressed'], extensions: ['zip'] },
  {
    icon: Ppt,
    mimes: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
    extensions: ['ppt', 'pptx'],
  },
  { icon: Csv, mimes: ['text/csv'], extensions: ['csv'] },
  {
    icon: Doc,
    mimes: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    extensions: ['doc', 'docx'],
  },
  { icon: Html, mimes: ['text/html'], extensions: ['html', 'htm'] },
  { icon: Json, mimes: ['application/json'], extensions: ['json'] },
];

/**
 * Picks the file-type icon for a file from its name and MIME type,
 * returning `null` when neither matches a known type. Both arguments are
 * optional so this also serves an attachment restored from conversation
 * history, where only one of the two may be known.
 */
export function pickFileTypeIcon(name?: string, mimeType?: string): FileTypeIconComponent | null {
  const extension = name?.split('.').pop()?.toLowerCase() ?? '';
  const mime = mimeType?.toLowerCase() ?? '';
  const match = FILE_TYPE_ICONS.find((entry) => entry.mimes.includes(mime) || entry.extensions.includes(extension));
  return match?.icon ?? null;
}
