import type { NormalizedNode } from './normalize-dom.mjs';

export interface Difference {
  path: string;
  kind: string;
  detail: unknown;
}

/** An entry in known-differences.json. */
export interface KnownDifference {
  path: string;
  reason: string;
  variant?: string;
}

/** Returns a flat array of the differences between the two trees. */
export function diffNormalized(
  reactTree: NormalizedNode | null,
  emberTree: NormalizedNode | null,
): Difference[];

/** Drops the differences the allowlist documents for this variant. */
export function applyKnownDifferences(
  differences: Difference[],
  knownDifferences: KnownDifference[],
  variant: string,
): Difference[];
