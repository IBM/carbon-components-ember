/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import Button from '../button.gts';
import type { ButtonSignature } from '../button.gts';
import Tooltip from '../tooltip.gts';
import RouterLink from '../-private/router-link.gts';
import type { TooltipSignature } from '../tooltip.gts';
import type { ToolbarAction } from './toolbar.gts';

export interface ToolbarActionButtonSignature {
  Element: TooltipSignature['Element'] | ButtonSignature['Element'];
  Args: {
    action: ToolbarAction;
  };
}

/**
 * A single toolbar action rendered as an icon-only ghost button (or, when
 * `href` or `route` is set, a matching-styled link), with a tooltip showing
 * its label.
 * Shared between `Toolbar`'s visible row and its offscreen measurement row -
 * see `toolbar.gts`.
 */
export default class ToolbarActionButton extends Component<ToolbarActionButtonSignature> {
  handleClick = () => {
    this.args.action.onClick?.();
  };

  handleLinkClick = (event: MouseEvent) => {
    if (this.args.action.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  <template>
    {{#if (or @action.href @action.route)}}
      <Tooltip @label={{@action.text}} @align="bottom" ...attributes>
        {{! Disabled, it's a link to nowhere, as upstream's. }}
        <RouterLink
          @href={{unless @action.disabled @action.href}}
          @route={{unless @action.disabled @action.route}}
          @models={{@action.models}}
          @query={{@action.query}}
          target={{or @action.target "_self"}}
          class="cds--btn cds--btn--icon-only cds--btn--ghost cds--layout--size-{{or
              @action.size
              'md'
            }}
            {{if @action.disabled 'cds--btn--disabled'}}"
          role={{if @action.disabled "link"}}
          aria-disabled={{if @action.disabled "true"}}
          data-testid={{@action.testId}}
          {{on "click" this.handleLinkClick}}
        >
          <@action.icon @size={{16}} />
        </RouterLink>
      </Tooltip>
    {{else}}
      <Button
        @kind="ghost"
        @hasIconOnly={{true}}
        @iconDescription={{@action.text}}
        @tooltipPosition="bottom"
        @size={{or @action.size "md"}}
        @disabled={{@action.disabled}}
        data-testid={{@action.testId}}
        ...attributes
        {{on "click" this.handleClick}}
      >
        <@action.icon @size={{16}} />
      </Button>
    {{/if}}
  </template>
}
