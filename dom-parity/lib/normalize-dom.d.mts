export interface NormalizedText {
  type: 'text';
  text: string;
}

export interface NormalizedElement {
  type: 'element';
  tag: string;
  classes: string[];
  /** Boolean attributes are `true`; ids are canonicalized. */
  attributes: Record<string, string | true>;
  style: Record<string, string>;
  children: NormalizedNode[];
}

export type NormalizedNode = NormalizedText | NormalizedElement;

/**
 * Normalizes `root`'s subtree for comparison, canonicalizing the ids found
 * under `scope`. Returns `null` when `root` is an empty text node.
 */
export function normalizeElement(
  root: Node,
  scope?: Node,
): NormalizedNode | null;
