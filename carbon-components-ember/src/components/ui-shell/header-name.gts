/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Link from './-link.gts';
import type { LinkSignature } from './-link.gts';
import type { TOC } from '@ember/component/template-only';

export interface HeaderNameSignature {
  Element: LinkSignature['Element'];
  Args: LinkSignature['Args'] & {
    /** Shown in bold before the name. Defaults to `IBM`; `""` leaves it out. */
    prefix?: string;
  };
  Blocks: {
    /** The product's name. */
    default: [];
  };
}

/** The product's name in the `Header`, linking to its home page. */
const HeaderName: TOC<HeaderNameSignature> = <template>
  {{#let (if (eq @prefix undefined) "IBM" @prefix) as |prefix|}}
    <Link
      @as={{@as}}
      @href={{@href}}
      @route={{@route}}
      @externalRoute={{@externalRoute}}
      @models={{@models}}
      @query={{@query}}
      ...attributes
      class="cds--header__name"
    >
      {{~#if prefix~}}
        <span class="cds--header__name--prefix">{{prefix}}</span>&nbsp;
      {{~/if~}}
      <span>{{yield}}</span>
    </Link>
  {{/let}}
</template>;

export default HeaderName;
