/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { createScope, FeatureFlags } from '@carbon/feature-flags';

/** The flags `@carbon/feature-flags` defines. */
export const FEATURE_FLAGS = [
  'enable-css-custom-properties',
  'enable-css-grid',
  'enable-v11-release',
  'enable-v12-release',
  'enable-experimental-tile-contrast',
  'enable-tile-contrast',
  'enable-v12-tile-default-icons',
  'enable-v12-tile-radio-icons',
  'enable-v12-overflowmenu',
  'enable-treeview-controllable',
  'enable-v12-structured-list-visible-icons',
  'enable-experimental-focus-wrap-without-sentinels',
  'enable-focus-wrap-without-sentinels',
  'enable-dialog-element',
  'enable-v12-autoalign',
  'enable-v12-dynamic-floating-styles',
  'enable-v12-toggle-reduced-label-spacing',
  'enable-enhanced-file-uploader',
  'enable-presence',
] as const;

export type FeatureFlagName = (typeof FEATURE_FLAGS)[number];

// The global scope's flags as they are when the service is created.
function fromGlobalScope() {
  const scope = createScope();
  scope.mergeWithScope(FeatureFlags);
  return scope;
}

/**
 * Carbon's feature flags, which Carbon React sets with `<FeatureFlags>` and
 * reads with `useFeatureFlag()`. They apply to the whole app, and start from
 * `@carbon/feature-flags`' global scope as it is when the service is first
 * used. `enable-v12-release` turns on every v12 flag, as in Carbon React.
 */
export default class FeatureFlagsService extends Service {
  #scope = fromGlobalScope();
  // Changes write #changes without reading it, so one made during a render
  // doesn't count as a read.
  #version = 0;
  #changes = tracked(0);

  /** Whether a flag is on, as Carbon React's `useFeatureFlag()` says. */
  enabled(name: FeatureFlagName): boolean {
    void this.#changes.value;
    return this.#scope.enabled(name);
  }

  enable(name: FeatureFlagName): void {
    this.#scope.enable(name);
    this.#changes.value = ++this.#version;
  }

  disable(name: FeatureFlagName): void {
    this.#scope.disable(name);
    this.#changes.value = ++this.#version;
  }

  /** Sets several flags at once: `merge({ 'enable-v12-release': true })`. */
  merge(flags: Partial<Record<FeatureFlagName, boolean>>): void {
    this.#scope.merge(flags);
    this.#changes.value = ++this.#version;
  }
}
