/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ported near-verbatim from `@carbon/ai-chat-components`'
 * `code-snippet/src/codemirror/marker-utils.ts`. `foldGutter()`'s
 * `markerDOM` option needs a plain, synchronously-constructed `HTMLElement`
 * (CodeMirror builds/tears down the gutter marker itself, outside any
 * Glimmer render pass), so this stays raw DOM construction from the same
 * `@carbon/icons` + `@carbon/icon-helpers` metadata this addon's own
 * generated icon components are built from, rather than an Ember
 * component invocation.
 */
import { EditorView } from '@codemirror/view';
import RawChevronDown16 from '@carbon/icons/es/chevron--down/16';
import { getAttributes } from '@carbon/icon-helpers';

/**
 * This addon's own generated `types/carbon-icons.d.ts` (consumed by its
 * per-icon Ember components under `src/components/icons/`) declares
 * `content` as a single `{ elem, attrs }` object, not the array real
 * `@carbon/icons` metadata actually ships (most icons, including this one,
 * have one `<path>`, but the shape is still an array) - that ambient type
 * has never been exercised against `.content` before since the generated
 * icon components never read it. Cast to the real runtime shape instead of
 * fighting the (untyped) `@carbon/icon-helpers` package + the addon's own
 * simplified ambient declaration.
 */
interface IconDescriptor {
  attrs: Record<string, string | number>;
  content: Array<{ elem: string; attrs: Record<string, string | number> }>;
}

const ChevronDown16 = RawChevronDown16 as unknown as IconDescriptor;

export interface CarbonFoldMarkerOptions {
  /** Accessibility label for the collapse action (when block is expanded). */
  collapseLabel?: string;
  /** Accessibility label for the expand action (when block is collapsed). */
  expandLabel?: string;
}

/**
 * Returns a `markerDOM` function for `foldGutter()` that renders Carbon's
 * chevron icon as the fold indicator, with accessibility attributes and
 * keyboard support (paired with `carbonFoldMarkerKeyHandler()`).
 */
export function createCarbonFoldMarker(
  options: CarbonFoldMarkerOptions = {}
): (open: boolean) => HTMLElement {
  const {
    collapseLabel = 'Collapse code block',
    expandLabel = 'Expand code block',
  } = options;

  return (open: boolean) => {
    // Manually create SVG to avoid toSVG's attribute issues
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const attrs = getAttributes(ChevronDown16.attrs) as Record<
      string,
      string | number | boolean | undefined
    >;

    // Only set attributes that have valid values
    Object.entries(attrs).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== 'undefined' &&
        value !== null &&
        String(value) !== 'undefined'
      ) {
        svg.setAttribute(key, String(value));
      }
    });

    // Add the path element
    ChevronDown16.content.forEach((item) => {
      if (item.elem === 'path') {
        const path = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );
        Object.entries(item.attrs).forEach(([key, value]) => {
          path.setAttribute(key, String(value));
        });
        svg.appendChild(path);
      }
    });

    // Accessibility attributes - all styling is in code-snippet.scss.
    // No tabindex here (keyboard access goes through
    // `carbonFoldMarkerKeyHandler()`'s own event handler, not native
    // sequential focus) to avoid an aria-hidden-focus violation.
    svg.setAttribute('role', 'button');
    svg.setAttribute('aria-label', open ? collapseLabel : expandLabel);
    svg.setAttribute('aria-expanded', String(open));

    return svg as unknown as HTMLElement;
  };
}

/**
 * Keyboard handler enabling Enter/Space to toggle a fold marker created by
 * `createCarbonFoldMarker()` (Tab focuses it; CodeMirror's own gutter click
 * handling only listens for mouse events).
 */
export function carbonFoldMarkerKeyHandler() {
  return EditorView.domEventHandlers({
    keydown(event) {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'svg' &&
        target.getAttribute('role') === 'button' &&
        target.hasAttribute('aria-expanded') &&
        (event.key === 'Enter' || event.key === ' ')
      ) {
        event.preventDefault();
        // Trigger a mouse event to activate CodeMirror's fold handler
        const mouseEvent = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
        });
        target.dispatchEvent(mouseEvent);
        return true;
      }
      return false;
    },
  });
}
