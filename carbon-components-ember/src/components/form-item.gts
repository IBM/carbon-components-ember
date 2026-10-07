import type { TOC } from '@ember/component/template-only';
/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface FormItemSignature {
  Element: HTMLDivElement;
  Blocks: {
    /**
     * Specify the content of the form item
     */
    default: [];
  };
}

const FormItem: TOC<FormItemSignature> = <template>
  <div class="cds--form-item" ...attributes>
    {{yield}}
  </div>
</template>;

export default FormItem;
