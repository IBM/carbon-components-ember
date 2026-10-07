import type { NormalizedNode } from './normalize-dom.mjs';

/** Drops `classes` and the `part` attribute throughout the tree. */
export function stripClasses<T extends NormalizedNode | null>(tree: T): T;
