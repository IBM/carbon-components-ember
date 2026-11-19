/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { FileUploaderButtonSignature } from './file-uploader-button.gts';

/** The `cds--layout--size-*` size: `field` and `small` are the old names of `md` and `sm`. */
export function layoutSize(size: FileUploaderButtonSignature['Args']['size']) {
  if (size === 'field') return 'md';
  if (size === 'small') return 'sm';
  return size;
}
