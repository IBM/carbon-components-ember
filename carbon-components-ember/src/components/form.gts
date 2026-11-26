/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface FormSignature {
  Element: HTMLFormElement;
  Blocks: {
    /**
     * Provide children to be rendered inside of the `<form>` element
     */
    default: [];
  };
}

const Form: TOC<FormSignature> = <template>
  <form class="cds--form" ...attributes>
    {{~yield~}}
  </form>
</template>;

export default Form;
