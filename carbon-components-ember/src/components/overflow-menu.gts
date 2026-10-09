import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type Icon from '../components/icon.gts';
import OverflowMenuItem from '../components/overflow-menu/item.gts';
import BasicDropdown from 'ember-basic-dropdown/components/basic-dropdown';
import calculatePosition from 'ember-basic-dropdown/utils/calculate-position';
import Tooltip from './-private/tooltip.gts';
import type { WithBoundArgs } from '@glint/template';
import { OverflowMenuVertical } from '../icons.ts';
import type { BasicDropdownTriggerSignature } from 'ember-basic-dropdown/components/basic-dropdown-trigger';
import type { CalculatePosition } from 'ember-basic-dropdown/utils/calculate-position';

export interface OverflowMenuSignature {
  Element: BasicDropdownTriggerSignature['Element'];
  Args: {
    icon?: typeof Icon;
    /**
     * The side of the trigger the menu opens on, when there's room for it
     * there; otherwise it opens on the other side.
     */
    direction: 'bottom' | 'top';
    /**
     * Aligns the menu's end edge with the trigger's, as Carbon React's
     * `flipped`.
     */
    flipped?: boolean;
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
     * specifier). Defaults to `'auto'` (`'right'` with `@flipped`) - only needed when
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

  // Where the menu was last placed, which can differ from @direction and
  // @flipped when it doesn't fit; Carbon draws the menu's join to the
  // trigger from these.
  @tracked placedAbove?: boolean;
  @tracked placedFlipped?: boolean;

  get horizontalPosition() {
    return (
      this.args.horizontalPosition ?? (this.args.flipped ? 'right' : 'auto')
    );
  }

  get menuDirection() {
    const above = this.placedAbove ?? this.args.direction === 'top';
    return above ? 'top' : 'bottom';
  }

  get isFlipped() {
    return this.placedFlipped ?? this.args.flipped;
  }

  calculatePosition: CalculatePosition = (
    trigger,
    content,
    target,
    options,
  ) => {
    // ember-basic-dropdown aligns physical edges; Carbon's flip is logical.
    const rtl = getComputedStyle(trigger).direction === 'rtl';
    const end = rtl ? 'left' : 'right';
    const position = calculatePosition(trigger, content, target, {
      ...options,
      horizontalPosition:
        this.args.flipped && !this.args.horizontalPosition
          ? end
          : options.horizontalPosition,
      // `auto` keeps the previous side while it fits: start on @direction's.
      previousVerticalPosition:
        options.previousVerticalPosition ??
        (this.args.direction === 'top' ? 'above' : undefined),
    });
    const above = position.verticalPosition === 'above';
    const flipped = position.horizontalPosition === end;
    if (this.placedAbove !== above) this.placedAbove = above;
    if (this.placedFlipped !== flipped) this.placedFlipped = flipped;
    return position;
  };

  <template>
    <BasicDropdown
      @horizontalPosition={{this.horizontalPosition}}
      @calculatePosition={{this.calculatePosition}}
      as |dd|
    >
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
          class="cds--overflow-menu-options cds--overflow-menu-options--open cds--overflow-menu-options--md
            {{if this.isFlipped 'cds--overflow-menu--flip'}}"
          tabindex="-1"
          data-floating-menu-direction={{this.menuDirection}}
        >
          {{yield
            (component OverflowMenuItem disabled=@disabled isDelete=@danger)
          }}
        </ul>
      </dd.Content>
    </BasicDropdown>
  </template>
}
