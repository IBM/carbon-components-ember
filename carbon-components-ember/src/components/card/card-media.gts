/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import style from 'ember-style-modifier';
import AspectRatio from '../aspect-ratio.gts';
import type { AspectRatioSignature } from '../aspect-ratio.gts';

export interface CardMediaSignature {
  Element: AspectRatioSignature['Element'];
  Args: {
    /** The element to render. Defaults to `div`. */
    as?: AspectRatioSignature['Args']['as'];
    /** The media's width to height ratio. Defaults to `1x1`. */
    ratio?: AspectRatioSignature['Args']['ratio'];
    /** The media's width in a horizontal card. Defaults to `33.33%`. */
    mediaWidth?: string;
    /** @internal Bound by `Card`. */
    horizontal?: boolean;
  };
  Blocks: {
    default: [];
  };
}

const mediaStyles = (mediaWidth?: string) => ({
  '--cds--card--media-width': mediaWidth ?? '33.33%',
});

/**
 * An image or video filling the width of a `Card` at a fixed ratio, or, in
 * a horizontal card, its full height beside the content.
 */
const CardMedia: TOC<CardMediaSignature> = <template>
  {{#if @horizontal}}
    <div
      class="cds--card__media cds--card__media--horizontal"
      ...attributes
      {{style (mediaStyles @mediaWidth)}}
    >{{yield}}</div>
  {{else}}
    <AspectRatio
      @as={{@as}}
      @ratio={{@ratio}}
      class="cds--card__media"
      ...attributes
    >{{yield}}</AspectRatio>
  {{/if}}
</template>;

export default CardMedia;
