/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';

// Fixed pseudo-random sequence matching the React implementation, so that
// paragraph line widths are deterministic (and consistent with snapshots)
// rather than shifting on every render.
const randoms = [0.973051493507435, 0.15334737213558558, 0.5671034553053769];

function getRandomInt(min: number, max: number, n: number) {
  const random = randoms[n % randoms.length] as number;
  return Math.floor(random * (max - min + 1)) + min;
}

export interface SkeletonTextSignature {
  Element: HTMLElement;
  Args: {
    /**
     * Generates skeleton text at a larger size.
     */
    heading?: boolean;
    /**
     * The number of lines shown if paragraph is true.
     */
    lineCount?: number;
    /**
     * Set this to true to generate multiple lines of text.
     */
    paragraph?: boolean;
    /**
     * Width (in px or %) of single line of text or max-width of paragraph lines.
     */
    width?: string;
  };
}

export default class SkeletonText extends Component<SkeletonTextSignature> {
  get paragraph() {
    return this.args.paragraph ?? false;
  }

  get width() {
    return this.args.width ?? '100%';
  }

  get lineCount() {
    return this.paragraph ? (this.args.lineCount ?? 3) : 1;
  }

  get isMultiLine() {
    return this.lineCount !== 1;
  }

  get skeletonTextClass() {
    return this.args.heading
      ? 'cds--skeleton__text cds--skeleton__heading'
      : 'cds--skeleton__text';
  }

  get lineStyles() {
    const width = this.width;
    const widthNum = parseInt(width, 10);
    const widthPx = width.includes('px');
    const widthPercent = width.includes('%');
    const paragraph = this.paragraph;

    const styles: ReturnType<typeof htmlSafe>[] = [];
    for (let i = 0; i < this.lineCount; i++) {
      let lineWidth = width;
      if (widthPercent && paragraph) {
        const randomPercentWidth = `${getRandomInt(0, 75, i)}px`;
        lineWidth = `calc(${width} - ${randomPercentWidth})`;
      } else if (widthPx && paragraph) {
        lineWidth = `${getRandomInt(Math.max(widthNum - 75, 0), widthNum, i)}px`;
      }
      styles.push(htmlSafe(`width: ${lineWidth};`));
    }
    return styles;
  }

  get singleLineStyle() {
    return this.lineStyles[0];
  }

  <template>
    {{#if this.isMultiLine}}
      <div ...attributes>
        {{#each this.lineStyles as |style|}}
          <p class={{this.skeletonTextClass}} style={{style}}></p>
        {{/each}}
      </div>
    {{else}}
      <p
        class={{this.skeletonTextClass}}
        style={{this.singleLineStyle}}
        ...attributes
      ></p>
    {{/if}}
  </template>
}
