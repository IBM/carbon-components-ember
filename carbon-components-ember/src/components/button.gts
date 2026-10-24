import Component from '@glimmer/component';
import type { ComponentLike } from '@glint/template';
import ButtonBase from './-private/button-base.gts';
import type { RouteArgs } from './-private/router-link.gts';
import Tooltip from './tooltip.gts';
import type { TooltipAlignment } from './tooltip.gts';

export interface ButtonSignature {
  Element: HTMLButtonElement | HTMLAnchorElement;
  Args: RouteArgs & {
    /**
     * The element to render in place of the `<button>` (or, with `@href`,
     * the `<a>`). It overrides `@route`.
     */
    as?: keyof HTMLElementTagNameMap;
    /**
     * **Experimental:** Keeps an icon-only button's tooltip within the
     * viewport.
     */
    autoAlign?: boolean;
    /**
     * Describes what a danger button does, for assistive technology: a
     * visually hidden span the button points to with `aria-describedby`.
     * For the `danger`, `danger--tertiary` and `danger--ghost` kinds.
     */
    dangerDescription?: string;
    /**
     * Disables the button. With `@href` or `@route`, it renders a disabled
     * `<button>` instead of the link.
     */
    disabled?: boolean;
    /** Renders a link to this URL, styled as a button. */
    href?: string;
    /**
     * Shows only the icon, in a tooltip that names the button with
     * `@iconDescription`.
     */
    hasIconOnly?: boolean;
    /** Names an icon-only button, in its tooltip. */
    iconDescription?: string;
    /** Uses Carbon's expressive button style. */
    isExpressive?: boolean;
    /** Marks an icon-only ghost button as selected, with `aria-pressed`. */
    isSelected?: boolean;
    /** The button's style. Defaults to `primary`. */
    kind?:
      | 'primary'
      | 'secondary'
      | 'tertiary'
      | 'ghost'
      | 'danger'
      | 'danger--primary'
      | 'danger--tertiary'
      | 'danger--ghost';
    /**
     * An icon component, shown at 16px after the label, or alone with
     * `@hasIconOnly`.
     */
    renderIcon?: ComponentLike<{
      Args: { size?: number | string; svgClass?: string };
    }>;
    /** The button's size. Without one, Carbon's default, `lg`, applies. */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    /**
     * How an icon-only button's tooltip lines up with it, along
     * `@tooltipPosition`. Defaults to `center`.
     */
    tooltipAlignment?: 'start' | 'center' | 'end';
    /** Gives an icon-only button's tooltip a drop shadow. */
    tooltipDropShadow?: boolean;
    /**
     * Renders an icon-only button's tooltip in the high-contrast theme.
     * Defaults to `true`.
     */
    tooltipHighContrast?: boolean;
    /** Which side of an icon-only button its tooltip is on. Defaults to `top`. */
    tooltipPosition?: 'top' | 'right' | 'bottom' | 'left';
  };
  Blocks: {
    /**
     * The button's label, or an icon-only button's icon when there's no
     * `@renderIcon`.
     */
    default: [];
  };
}

/**
 * Carbon's button. Clicks are a plain `{{on "click"}}` and `type` a plain
 * attribute (`type="submit"`), as on a native `<button>`.
 */
export default class Button extends Component<ButtonSignature> {
  get tooltipAlign(): TooltipAlignment {
    const position = this.args.tooltipPosition ?? 'top';
    const alignment = this.args.tooltipAlignment ?? 'center';
    if (position === 'left' || position === 'right') return position;
    return alignment === 'center' ? position : `${position}-${alignment}`;
  }

  <template>
    {{#if @hasIconOnly}}
      {{! Carbon React's IconButton: the button in a tooltip naming it. }}
      <Tooltip
        class="cds--icon-tooltip {{if @disabled 'cds--icon-tooltip--disabled'}}"
        @align={{this.tooltipAlign}}
        @autoAlign={{@autoAlign}}
        @label={{@iconDescription}}
        @highContrast={{@tooltipHighContrast}}
        @dropShadow={{@tooltipDropShadow}}
        @closeOnActivation={{true}}
        @leaveDelayMs={{100}}
      >
        <ButtonBase
          @as={{@as}}
          @dangerDescription={{@dangerDescription}}
          @disabled={{@disabled}}
          @hasIconOnly={{true}}
          @href={{@href}}
          @route={{@route}}
          @models={{@models}}
          @query={{@query}}
          @isExpressive={{@isExpressive}}
          @isSelected={{@isSelected}}
          @kind={{@kind}}
          @size={{@size}}
          ...attributes
        >
          {{#if @renderIcon}}
            <@renderIcon @size={{16}} />
          {{else}}
            {{yield}}
          {{/if}}
        </ButtonBase>
      </Tooltip>
    {{else}}
      <ButtonBase
        @as={{@as}}
        @dangerDescription={{@dangerDescription}}
        @disabled={{@disabled}}
        @href={{@href}}
        @route={{@route}}
        @models={{@models}}
        @query={{@query}}
        @iconDescription={{@iconDescription}}
        @isExpressive={{@isExpressive}}
        @kind={{@kind}}
        @renderIcon={{@renderIcon}}
        @size={{@size}}
        ...attributes
      >
        {{yield}}
      </ButtonBase>
    {{/if}}
  </template>
}
