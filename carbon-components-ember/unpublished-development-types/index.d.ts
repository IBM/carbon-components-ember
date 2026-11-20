declare module '@carbon/icons/es/index.js';

// @carbon/feature-flags ships no types.
declare module '@carbon/feature-flags' {
  interface FeatureFlagScope {
    flags: Map<string, boolean>;
    enabled(name: string): boolean;
    enable(name: string): void;
    disable(name: string): void;
    merge(flags: Record<string, boolean>): void;
    mergeWithScope(scope: FeatureFlagScope): void;
  }
  export const FeatureFlags: FeatureFlagScope;
  export function createScope(
    flags?: Record<string, boolean>,
  ): FeatureFlagScope;
}

// Each component imports its own stylesheet; the build compiles them into
// styles.css (see rollup.config.mjs).
declare module '*.scss';
