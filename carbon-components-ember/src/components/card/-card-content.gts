/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface CardContentSignature {
  Element: HTMLDivElement;
  Args: {
    /** @internal Bound by `Card`. */
    horizontal?: boolean;
  };
  Blocks: {
    default: [];
  };
}

/**
 * A horizontal card's header, body and footer, beside its media. Carbon
 * React's `Card` wraps them itself, sorting its children. A vertical card
 * has no wrapper, so this renders only its block there.
 */
const CardContent: TOC<CardContentSignature> = <template>
  {{#if @horizontal}}
    <div class="cds--card__content" ...attributes>{{yield}}</div>
  {{else}}
    {{yield}}
  {{/if}}
</template>;

export default CardContent;
