import { helper as buildHelper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';
import { guidFor } from '@ember/object/internals';

const cache = new Map();

export function renderSvgPartFunc(
  [svg]: [any],
  {
    class: classes,
    fill,
    size,
    title,
  }: {
    class: (string | undefined)[];
    fill?: string;
    size: number | string | undefined;
    title?: string;
  },
): ReturnType<typeof htmlSafe> {
  if (!svg) return htmlSafe('');
  if (typeof svg !== 'object') return svg as ReturnType<typeof htmlSafe>;
  // Mirrors the root attributes @carbon/icons-react renders for an
  // unlabelled icon (this helper has no way to label one, so it's always
  // decorative and hidden from the accessibility tree).
  const base = `<svg focusable="false"
             preserveAspectRatio="xMidYMid meet"
             xmlns="http://www.w3.org/2000/svg"
             fill="${fill}"
             width="${size || svg.attrs.width}"
             height="${size || svg.attrs.height}"
             viewBox="${svg.attrs.viewBox}"
             aria-hidden="true"
             class="${classes.join(' ')}">`;
  // A title element (even empty) matches @carbon/icons-react's behaviour:
  // every per-icon component always renders `{children}` inside the <svg>,
  // and callers pass `<title>{description}</title>` as children when they
  // want an accessible label.  Emit it first, before the cached path content,
  // exactly as React does.
  const titleEl = title !== undefined ? `<title>${title}</title>` : '';
  let rest = '';
  if (cache.has(guidFor(svg) + size)) {
    rest = cache.get(guidFor(svg) + size);
  } else {
    const part = svg.content
      .map((svgPart: any) => {
        const attrs = Object.keys(svgPart.attrs)
          .map((a) => `${a}="${svgPart.attrs[a]}"`)
          .join(' ');
        return `<${svgPart.elem} ${attrs} />`;
      })
      .join('');
    rest = part;
    cache.set(guidFor(svg) + size, rest);
  }
  // React appends `children` after the icon's own path elements, so the
  // <title> lands at the end - match that order so dom-parity index paths agree.
  const html = (base + rest + titleEl + '</svg>').trim();
  return htmlSafe(html);
}

export const renderSvgPart = buildHelper(renderSvgPartFunc);
export default renderSvgPart;
