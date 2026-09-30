import { helper as buildHelper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';
import { guidFor } from '@ember/object/internals';

const cache = new Map();

export function renderSvgPartFunc(
  [svg]: [any],
  { class: classes, fill, size }: { class: (string | undefined)[]; fill?: string; size: number|string|undefined },
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
  let rest = '';
  if (cache.has(guidFor(svg)+size)) {
    rest = cache.get(guidFor(svg)+size);
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
    cache.set(guidFor(svg)+size, rest);
  }
  const html = (base + rest + '</svg>').trim();
  return htmlSafe(html);
}

export const renderSvgPart = buildHelper(renderSvgPartFunc);
export default renderSvgPart;
