import { trustHTML } from '@ember/template';
import type { TrustedHTML } from '@ember/template';
import { guidFor } from '@ember/object/internals';
import type { IconType } from '../icon.gts';

const cache = new Map<string, string>();

const escapeHTML = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

export default function renderSvgPart(
  svg: IconType | undefined,
  {
    class: classes,
    fill,
    size,
    title,
    ariaLabel,
  }: {
    class: (string | undefined)[];
    fill?: string;
    size: number | string | undefined;
    title?: string;
    ariaLabel?: string;
  },
): TrustedHTML {
  if (!svg) return trustHTML('');
  // Mirrors the root attributes @carbon/icons-react renders: a labelled
  // icon is an image, an unlabelled one is hidden from assistive technology.
  const a11y = ariaLabel
    ? `aria-label="${escapeHTML(ariaLabel)}" role="img"`
    : 'aria-hidden="true"';
  // Like @carbon/icons-react, no class unless one is passed.
  const className = classes.filter(Boolean).join(' ');
  const base = `<svg focusable="false"
             preserveAspectRatio="xMidYMid meet"
             xmlns="http://www.w3.org/2000/svg"
             fill="${fill}"
             width="${size || svg.attrs.width}"
             height="${size || svg.attrs.height}"
             viewBox="${svg.attrs.viewBox}"
             ${a11y}
             ${className ? `class="${className}"` : ''}>`;
  // A title element (even empty) matches @carbon/icons-react's behaviour:
  // every per-icon component always renders `{children}` inside the <svg>,
  // and callers pass `<title>{description}</title>` as children when they
  // want an accessible label.  Emit it first, before the cached path content,
  // exactly as React does.
  const titleEl =
    title !== undefined ? `<title>${escapeHTML(title)}</title>` : '';
  const cacheKey = `${guidFor(svg)}${size}`;
  let rest = cache.get(cacheKey);
  if (rest === undefined) {
    rest = svg.content
      .map((svgPart) => {
        const attrs = Object.entries(svgPart.attrs)
          .map(([name, value]) => `${name}="${value}"`)
          .join(' ');
        return `<${svgPart.elem} ${attrs} />`;
      })
      .join('');
    cache.set(cacheKey, rest);
  }
  // React appends `children` after the icon's own path elements, so the
  // <title> lands at the end - match that order so dom-parity index paths agree.
  const html = (base + rest + titleEl + '</svg>').trim();
  return trustHTML(html);
}
