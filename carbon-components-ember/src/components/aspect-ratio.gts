/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { concat } from '@ember/helper';

export interface AspectRatioSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * Specify the ratio to be used by the aspect ratio
     * container. This will determine what aspect ratio your content
     * will be displayed in.
     * @default '1x1'
     */
    ratio?:
      | '1x1'
      | '2x3'
      | '3x2'
      | '3x4'
      | '4x3'
      | '1x2'
      | '2x1'
      | '9x16'
      | '16x9';
  };
  Blocks: {
    default: [];
  };
}

/**
 * The AspectRatio component provides a `ratio` argument that will be used to
 * specify the aspect ratio that the children you provide will be displayed in.
 * This is often useful alongside our grid components, or for media assets like
 * images or videos.
 *
 * @example
 * ```gts
 * <AspectRatio @ratio="16x9">
 *   <img src="..." alt="..." />
 * </AspectRatio>
 * ```
 */
export default class AspectRatio extends Component<AspectRatioSignature> {
  get ratio() {
    return this.args.ratio ?? '1x1';
  }

  <template>
    <div
      class={{concat
        "cds--aspect-ratio cds--aspect-ratio--"
        this.ratio
      }}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}
