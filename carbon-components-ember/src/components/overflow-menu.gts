import Component from '@glimmer/component';
import type Icon from '../components/icon.gts';
import MenuItemComponent from '../components/overflow-menu/item.gts';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import defaultTo from '../helpers/default-to.ts';
import Tooltip from './-private/tooltip.gts';
import type { WithBoundArgs } from '@glint/template';
import { OverflowMenuVertical } from '../icons.ts';

export interface OverflowMenuComponentSignature {
  Args: {
    icon?: typeof Icon;
    direction: 'bottom' | 'top';
    tooltip?: string;
    /**
     * Names the trigger for assistive technology, as Carbon React's
     * `iconDescription`. Defaults to `@tooltip`, or "Options".
     */
    iconDescription?: string;
    disabled?: boolean;
    danger?: boolean;
    eventType?: 'click' | 'mousedown';
    /**
     * Passed straight through to the underlying `BasicDropdown` (whose own
     * declared type isn't cleanly importable - its published `.d.ts`
     * re-exports it from a sibling module via a broken `.ts`-extension
     * specifier). Defaults to `'auto'` (its own default) - only needed when
     * the trigger sits near the right edge of a container narrower than
     * the viewport, where `'auto'` would otherwise pick `'left'` (fits the
     * viewport) and let the menu overflow that container instead.
     */
    horizontalPosition?: 'auto' | 'auto-right' | 'right' | 'center' | 'left';
  };
  Blocks: {
    default: [WithBoundArgs<typeof MenuItemComponent, 'disabled' | 'isDelete'>];
  };
}

export default class OverflowMenuComponent extends Component<OverflowMenuComponentSignature> {
  get icon() {
    return this.args.icon || OverflowMenuVertical;
  }

  get iconDescription() {
    return this.args.iconDescription ?? this.args.tooltip ?? 'Options';
  }

  <template>
    <BasicDropdown @horizontalPosition={{@horizontalPosition}} as |dd|>
      {{#if @tooltip}}
        <Tooltip>
          <:trigger as |reference|>
            <dd.Trigger
              @stopPropagation={{false}}
              @eventType={{@eventType}}
              class="cds--overflow-menu
                {{if dd.isOpen 'cds--overflow-menu--open'}}"
              aria-label={{this.iconDescription}}
              {{reference}}
            >
              <this.icon @btnClass="cds--overflow-menu__icon" />
            </dd.Trigger>
          </:trigger>
          <:content>{{@tooltip}}</:content>
        </Tooltip>
      {{else}}
        <dd.Trigger
          @stopPropagation={{false}}
          @eventType={{@eventType}}
          class="cds--overflow-menu {{if dd.isOpen 'cds--overflow-menu--open'}}"
          aria-label={{this.iconDescription}}
        >
          <this.icon @btnClass="cds--overflow-menu__icon" />
        </dd.Trigger>
      {{/if}}
      <dd.Content>
        <ul
          {{on "click" dd.actions.close}}
          role="menu"
          aria-label={{this.iconDescription}}
          class="cds--overflow-menu-options cds--overflow-menu-options--open cds--overflow-menu-options--md"
          style="inset-block-start: 0"
          tabindex="-1"
          data-floating-menu-direction={{defaultTo @direction "buttom"}}
        >
          {{yield
            (component MenuItemComponent disabled=@disabled isDelete=@danger)
          }}
        </ul>
      </dd.Content>
    </BasicDropdown>
  </template>
}
