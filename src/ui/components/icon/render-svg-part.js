import { helper as buildHelper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

export function renderSvgPart([svg]) {
  const attrs = Object.keys(svg.attrs).map(a => `${a}="${svg.attrs[a]}"`).join(' ');
  return htmlSafe(`<${svg.elem} ${attrs}>`);
}

export const helper = buildHelper(renderSvgPart);
export default helper;
