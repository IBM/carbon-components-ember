import { helper as buildHelper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

const cache = new Map();

export function renderSvgPartFunc(
  [svg]: [any],
  { class: classes, fill }: { class: (string | undefined)[]; fill?: string },
): ReturnType<typeof htmlSafe> {
  if (!svg) return htmlSafe('');
  const base = `<svg class="${classes.join(' ')}"
             focusable="false"
             fill="${fill}"
             style="will-change: transform;"
             width="${svg.attrs.width}"
             height="${svg.attrs.height}"
             viewBox="${svg.attrs.viewBox}">`;
  let rest = '';
  if (cache.has(svg)) {
    rest = cache.get(svg);
  } else {
    const part = svg.content
      .map((svgPart: any) => {
        const attrs = Object.keys(svgPart.attrs)
          .map((a) => `${a}="${svgPart.attrs[a]}"`)
          .join(' ');
        return `<${svgPart.elem} ${attrs} />`;
      })
      .join();
    rest = part;
    cache.set(svg, rest);
  }
  const html = (base + rest + '</svg>').trim();
  return htmlSafe(html);
}

export const renderSvgPart = buildHelper(renderSvgPartFunc);
export default renderSvgPart;
