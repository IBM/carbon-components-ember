/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import type { WithBoundArgs } from '@glint/template';
import type OverflowMenuItem from '../overflow-menu/overflow-menu-item.gts';
import type { OverflowMenuItemSignature } from '../overflow-menu/overflow-menu-item.gts';

export interface TableToolbarActionSignature {
  Element: OverflowMenuItemSignature['Element'];
  Args: Pick<
    OverflowMenuItemSignature['Args'],
    'disabled' | 'hasDivider' | 'href' | 'isDelete'
  > & {
    /**
     * The menu's item this renders. Set by the `TableToolbarAction` that
     * `TableToolbarMenu` yields.
     */
    item: WithBoundArgs<typeof OverflowMenuItem, 'menu'>;
  };
  Blocks: {
    /** The action's text. */
    default: [];
  };
}

/**
 * An action in a `TableToolbarMenu`, as Carbon React's `TableToolbarAction`.
 * Handle a click with `{{on "click"}}`.
 */
const TableToolbarAction: TOC<TableToolbarActionSignature> = <template>
  <@item
    @disabled={{@disabled}}
    @hasDivider={{@hasDivider}}
    @href={{@href}}
    @isDelete={{@isDelete}}
    ...attributes
  >
    <div class="cds--overflow-menu-options__option-content">{{yield}}</div>
  </@item>
</template>;

export default TableToolbarAction;
