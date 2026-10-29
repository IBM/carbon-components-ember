/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import AspectRatio from '../aspect-ratio.gts';
import type { AspectRatioSignature } from '../aspect-ratio.gts';
import { mediaQuery, minWidth } from '../../utils/media-query.ts';

export interface PageHeaderHeroImageSignature {
  Element: AspectRatioSignature['Element'];
  Args: {
    /** How the image fills the space. Defaults to `cover`. */
    objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  };
  Blocks: {
    /** The image, such as a `<picture>`. */
    default: [];
  };
}

/** An image beside a PageHeader's content, 2x1 from the `lg` breakpoint and 3x2 below. */
export default class PageHeaderHeroImage extends Component<PageHeaderHeroImageSignature> {
  #lg = mediaQuery(this, minWidth('lg'));

  get ratio() {
    return this.#lg.matches ? '2x1' : '3x2';
  }

  get objectFit() {
    return this.args.objectFit ?? 'cover';
  }

  <template>
    <AspectRatio
      class="c4p--page-header__hero-image c4p--page-header__hero-image--object-fit-{{this.objectFit}}"
      @ratio={{this.ratio}}
      ...attributes
    >{{yield}}</AspectRatio>
  </template>
}
