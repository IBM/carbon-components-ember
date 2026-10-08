import Component from '@glimmer/component';
import type Icon from '../components/icon.gts';
import OverflowMenuItem from '../components/overflow-menu/item.gts';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import Tooltip from './-private/tooltip.gts';
import type { WithBoundArgs } from '@glint/template';
import { OverflowMenuVertical } from '../icons.ts';
import type { BasicDropdownTriggerSignature } from 'ember-basic-dropdown/components/basic-dropdown-trigger';

export interface OverflowMenuSignature {
  Element: BasicDropdownTriggerSignature['Element'];
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
    default: [
      OverflowMenuItem: WithBoundArgs<
        typeof OverflowMenuItem,
        'disabled' | 'isDelete'
      >,
    ];
  };
}

export default class OverflowMenu extends Component<OverflowMenuSignature> {
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
              ...attributes
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
          ...attributes
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
          tabindex="-1"
          data-floating-menu-direction={{or @direction "bottom"}}
        >
          {{yield
            (component OverflowMenuItem disabled=@disabled isDelete=@danger)
          }}
        </ul>
      </dd.Content>
    </BasicDropdown>
  </template>
}
