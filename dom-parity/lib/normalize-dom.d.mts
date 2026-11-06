/** Where a run of text, or the text beside the root, has whitespace. */
export type Whitespace = 'leading' | 'trailing' | 'both';

export interface NormalizedText {
  type: 'text';
  text: string;
  /** `only` when the text is whitespace and an element's whole content. */
  whitespace?: Whitespace | 'only';
}

export interface NormalizedElement {
  type: 'element';
  tag: string;
  classes: string[];
  /** Boolean attributes are `true`; ids are canonicalized. */
  attributes: Record<string, string | true>;
  style: Record<string, string>;
  children: NormalizedNode[];
  /** Set on the root only. */
  whitespaceAround?: Whitespace;
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
