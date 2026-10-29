/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Text from '../text.gts';
import type { TOC } from '@ember/component/template-only';

export interface PageHeaderContentTextSignature {
  Element: HTMLDivElement;
  Args: {
    /** A subtitle above the text. */
    subtitle?: string;
    /** The subtitle's element. Defaults to `h2`. */
    subtitleAs?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  };
  Blocks: {
    /** The text. */
    default: [];
  };
}

/** The text under a PageHeader's title. */
const PageHeaderContentText: TOC<PageHeaderContentTextSignature> = <template>
  <div class="c4p--page-header__content__body" ...attributes>
    {{#if @subtitle}}
      <Text
        @as={{or @subtitleAs "h2"}}
        class="c4p--page-header__content__subtitle"
      >{{@subtitle}}</Text>
    {{/if}}
    {{yield}}
  </div>
</template>;

export default PageHeaderContentText;
