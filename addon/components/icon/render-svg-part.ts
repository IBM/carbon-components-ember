import { helper as buildHelper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';
import { SafeString } from '@ember/template/-private/handlebars';

const cache = new Map();

export function renderSvgPart([svg], { class: classes, fill }: { class: (string|undefined)[]; fill?: string }): SafeString {
  if (!svg) return htmlSafe('');
  const base = `<svg class="${classes.join(' ')}"
             focusable="false"
             fill="${fill}"
             style="will-change: transform;"
             width="${svg.attrs.width}"
             height="${svg.attrs.height}"
             viewBox="${svg.attrs.viewBox}">`
  let rest = '';
  if (cache.has(svg)) {
    rest = cache.get(svg);
  } else {
    const part = svg.content.map((svgPart) => {
      const attrs = Object.keys(svgPart.attrs).map(a => `${a}="${svgPart.attrs[a]}"`).join(' ');
      return `<${svgPart.elem} ${attrs} />`;
    }).join();
    rest = part;
    cache.set(svg, rest);
  }
  const html = (base + rest + '</svg>').trim();
  return htmlSafe(html);
}

export const helper = buildHelper(renderSvgPart);
export default helper;
