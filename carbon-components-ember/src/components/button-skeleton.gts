/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface ButtonSkeletonSignature {
  Element: HTMLDivElement | HTMLAnchorElement;
  Args: {
    /** Renders the placeholder as a link to this URL, as Carbon React's does. */
    href?: string;
    /** Defaults to `lg`. */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  };
}

/** A loading placeholder for a `Button`. */
const ButtonSkeleton: TOC<ButtonSkeletonSignature> = <template>
  {{#if @href}}
    {{! An empty placeholder where the link will be, as in Carbon React. }}
    {{! eslint-disable-next-line ember/template-no-invalid-link-text }}
    <a
      class="cds--skeleton cds--btn cds--btn--{{if @size @size 'lg'}}
        cds--layout--size-{{if @size @size 'lg'}}"
      href={{@href}}
      role="button"
      ...attributes
    ></a>
  {{else}}
    <div
      class="cds--skeleton cds--btn cds--btn--{{if @size @size 'lg'}}
        cds--layout--size-{{if @size @size 'lg'}}"
      ...attributes
    ></div>
  {{/if}}
</template>;

export default ButtonSkeleton;
