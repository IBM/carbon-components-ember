/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TagSignature } from '../tag.gts';

/**
 * The classes Carbon React's Tag puts on every tag, its interactive ones
 * included, after the ones the caller passes.
 */
export function tagClasses(
  {
    type,
    size,
    disabled,
  }: {
    type?: TagSignature['Args']['type'];
    size?: TagSignature['Args']['size'];
    disabled?: boolean;
  },
  ...classes: string[]
): string {
  return [
    'cds--tag',
    ...classes,
    type && `cds--tag--${type}`,
    disabled && 'cds--tag--disabled',
    size && `cds--tag--${size}`,
    size && `cds--layout--size-${size}`,
  ]
    .filter(Boolean)
    .join(' ');
}
