/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { or } from 'ember-truth-helpers';
import Button from '../button.gts';
import Tooltip from '../tooltip.gts';
import type { ToolbarAction } from './toolbar.gts';

export interface ToolbarActionButtonSignature {
  Element: HTMLElement;
  Args: {
    action: ToolbarAction;
  };
}

/**
 * A single toolbar action rendered as an icon-only ghost button (or, when
 * `href` is set, a matching-styled link), wrapped in a `Tooltip` showing its
 * label. Shared between `Toolbar`'s visible row and its offscreen
 * measurement row - see `toolbar.gts`.
 */
export default class ToolbarActionButton extends Component<ToolbarActionButtonSignature> {
  <template>
    <Tooltip @label={{@action.text}} @align='bottom' ...attributes>
      {{#if @action.href}}
        <a
          href={{@action.href}}
          target={{if @action.href (or @action.target '_self')}}
          class='cds--btn cds--btn--icon-only cds--btn--ghost cds--layout--size-{{or @action.size "md"}}
            {{if @action.disabled "cds--btn--disabled"}}'
          data-testid={{@action.testId}}
        >
          <@action.icon @size={{16}} />
        </a>
      {{else}}
        <Button
          @ghost={{true}}
          @iconOnly={{true}}
          @size={{or @action.size 'md'}}
          @disabled={{@action.disabled}}
          @onClick={{@action.onClick}}
          data-testid={{@action.testId}}
        >
          <@action.icon @size={{16}} />
        </Button>
      {{/if}}
    </Tooltip>
  </template>
}
