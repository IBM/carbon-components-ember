/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type FeatureFlagsService from '../services/feature-flags.ts';

/**
 * Carbon React's `useAutoAlign`: the `autoAlign` argument, or the
 * `enable-v12-autoalign` flag when it isn't given.
 */
export function resolveAutoAlign(
  flags: FeatureFlagsService,
  autoAlign: boolean | undefined,
): boolean {
  return autoAlign ?? flags.enabled('enable-v12-autoalign');
}

/**
 * Whether Floating UI positions a popover, as Carbon React's
 * `enableFloatingStyles`: when it auto-aligns, or with the
 * `enable-v12-dynamic-floating-styles` flag.
 */
export function floats(
  flags: FeatureFlagsService,
  autoAlign: boolean | undefined,
): boolean {
  return (
    flags.enabled('enable-v12-dynamic-floating-styles') ||
    resolveAutoAlign(flags, autoAlign)
  );
}
