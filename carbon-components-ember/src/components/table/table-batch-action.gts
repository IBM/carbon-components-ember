/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import Button from '../button.gts';
import AddFilled from '../icons/add-filled.ts';
import type { ButtonSignature } from '../button.gts';

export interface TableBatchActionSignature {
  Element: ButtonSignature['Element'];
  Args: ButtonSignature['Args'];
  Blocks: {
    /** The action's label. */
    default: [];
  };
}

/**
 * An action in a `TableBatchActions`, as Carbon React's `TableBatchAction`: a
 * button with an add icon unless you give it another `@renderIcon`.
 */
export default class TableBatchAction extends Component<TableBatchActionSignature> {
  get iconDescription() {
    return this.args.iconDescription ?? 'Add';
  }

  <template>
    <Button
      @as={{@as}}
      @autoAlign={{@autoAlign}}
      @dangerDescription={{@dangerDescription}}
      @disabled={{@disabled}}
      @externalRoute={{@externalRoute}}
      @hasIconOnly={{@hasIconOnly}}
      @href={{@href}}
      @iconDescription={{this.iconDescription}}
      @isExpressive={{@isExpressive}}
      @isSelected={{@isSelected}}
      @kind={{@kind}}
      @models={{@models}}
      @query={{@query}}
      @renderIcon={{if @renderIcon @renderIcon AddFilled}}
      @route={{@route}}
      @size={{@size}}
      @tooltipAlignment={{@tooltipAlignment}}
      @tooltipDropShadow={{@tooltipDropShadow}}
      @tooltipHighContrast={{@tooltipHighContrast}}
      @tooltipPosition={{@tooltipPosition}}
      ...attributes
    >{{yield}}</Button>
  </template>
}
