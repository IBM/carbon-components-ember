/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { modifier as eModifier } from 'ember-modifier';
import { runTask } from 'ember-lifeline';
import type { ComponentLike } from '@glint/template';
import and from 'ember-truth-helpers/helpers/and';
import gt from 'ember-truth-helpers/helpers/gt';
import not from 'ember-truth-helpers/helpers/not';
import ArrowLeft from './icons/arrow-left.ts';
import Close from './icons/close.ts';
import Tooltip from './tooltip.gts';
import type { TooltipAlignment } from './tooltip.gts';
import or from '../helpers/or.ts';

export type SidePanelSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const SIDE_PANEL_SIZES: Record<SidePanelSize, string> = {
  xs: '16rem',
  sm: '20rem',
  md: '30rem',
  lg: '40rem',
  xl: '65rem',
  '2xl': '80rem',
};

const ACTION_BUTTON_ORDER: Record<string, number> = {
  ghost: 1,
  'danger--ghost': 2,
  tertiary: 3,
  danger: 5,
  primary: 6,
};

export type SidePanelActionKind =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'danger--ghost'
  | 'ghost';

export type SidePanelAction = {
  label: string;
  kind?: SidePanelActionKind;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: (event: MouseEvent) => void;
};

export type SidePanelActionToolbarButton = {
  label: string;
  kind?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  hasIconOnly?: boolean;
  /** Alias for `renderIcon`, matching Carbon React's `icon` field. `renderIcon` wins when both are given. */
  icon?: ComponentLike<{ Args: { size?: string } }>;
  renderIcon?: ComponentLike<{ Args: { size?: string } }>;
  leading?: boolean;
  disabled?: boolean;
  className?: string;
  tooltipPosition?: TooltipAlignment;
  onClick?: (event: MouseEvent) => void;
};

function focusableWithin(root: HTMLElement, selector?: string): HTMLElement | null {
  if (selector) {
    const el = root.querySelector<HTMLElement>(selector);
    if (el && getComputedStyle(el).display !== 'none') {
      return el;
    }
  }
  return root.querySelector<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
}

// Detects the open -> closed transition so the panel keeps rendering (and
// playing Carbon's CSS exit animation) after `@open` flips to false, then
// notifies the component once that animation finishes.
const trackPresence = eModifier<{
  Element: HTMLElement;
  Args: {
    Named: {
      open: boolean;
      onClose: () => void;
      onClosed: () => void;
    };
  };
}>((element, _positional, { open, onClose, onClosed }) => {
  if (!open) {
    onClose();
  }

  const handleAnimationEnd = (event: AnimationEvent) => {
    if (event.target === element && !open) {
      onClosed();
    }
  };
  element.addEventListener('animationend', handleAnimationEnd);

  return () => element.removeEventListener('animationend', handleAnimationEnd);
});

const focusOnOpen = eModifier<{
  Element: HTMLElement;
  Args: { Named: { open: boolean; slideIn?: boolean; selector?: string } };
}>((element, _positional, { open, slideIn, selector }) => {
  if (!open || slideIn) {
    return undefined;
  }
  const raf = requestAnimationFrame(() => {
    focusableWithin(element, selector)?.focus();
  });
  return () => cancelAnimationFrame(raf);
});

const closeOnEscape = eModifier<{
  Element: HTMLElement;
  Args: { Named: { open: boolean; slideIn?: boolean; onClose: () => void } };
}>((_element, _positional, { open, slideIn, onClose }) => {
  if (!open || slideIn) {
    return undefined;
  }
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
});

// Drives the title-collapse effect purely through the CSS custom property
// Carbon's own stylesheet already keys off (`--cds--side-panel--scroll-
// animation-progress`) -- no need to replicate React's per-element margin
// bookkeeping.
const animateTitleOnScroll = eModifier<{
  Element: HTMLElement;
  Args: { Named: { enabled: boolean } };
}>((element, _positional, { enabled }) => {
  const panel = element.closest<HTMLElement>('.cds--side-panel');
  if (!enabled || !panel) {
    return undefined;
  }

  const labelEl = panel.querySelector<HTMLElement>('.cds--side-panel__label-text');
  const subtitleEl = panel.querySelector<HTMLElement>('.cds--side-panel__subtitle-text');
  const distance = (labelEl?.offsetHeight ?? 0) + (subtitleEl?.offsetHeight ?? 0);
  panel.style.setProperty('--cds--side-panel--scroll-animation-distance', String(distance));

  const handleScroll = () => {
    const progress = distance > 0 ? Math.min(element.scrollTop, distance) / distance : 0;
    panel.style.setProperty('--cds--side-panel--scroll-animation-progress', String(progress));
  };
  handleScroll();
  element.addEventListener('scroll', handleScroll);
  return () => {
    element.removeEventListener('scroll', handleScroll);
    panel.style.removeProperty('--cds--side-panel--scroll-animation-progress');
  };
});

// Drag-to-resize (plus Home/End/Arrow keys and double-click-to-reset),
// mirroring Carbon React's `Resizer` behaviour without depending on a
// separate, not-yet-implemented `Resizer` component.
const resizeSidePanel = eModifier<{
  Element: HTMLElement;
  Args: { Named: { size: SidePanelSize; placement: 'left' | 'right' } };
}>((element, _positional, { size, placement }) => {
  const panel = element.closest<HTMLElement>('.cds--side-panel');
  const parent = panel?.parentElement;
  if (!panel || !parent) {
    return undefined;
  }

  let startX = 0;
  let startWidth = 0;

  const setWidth = (width: number | string) => {
    parent.style.setProperty(
      '--cds-side-panel-modified-size',
      typeof width === 'number' ? `${width}px` : width,
    );
  };

  const onPointerMove = (event: PointerEvent) => {
    const delta = event.clientX - startX;
    setWidth(startWidth - (placement === 'right' ? delta : -delta));
  };

  const onPointerUp = () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    panel.style.removeProperty('transition');
  };

  const onPointerDown = (event: PointerEvent) => {
    event.preventDefault();
    startX = event.clientX;
    startWidth = panel.clientWidth;
    panel.style.transition = 'none';
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const width = panel.clientWidth;
    if (event.key === 'Home') {
      setWidth('75vw');
    } else if (event.key === 'End') {
      setWidth(SIDE_PANEL_SIZES.xs);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const delta = event.key === 'ArrowLeft' ? -8 : 8;
      setWidth(width - (placement === 'right' ? delta : -delta));
    }
  };

  const onDoubleClick = () => parent.style.removeProperty('--cds-side-panel-modified-size');

  element.addEventListener('pointerdown', onPointerDown);
  element.addEventListener('keydown', onKeyDown);
  element.addEventListener('dblclick', onDoubleClick);

  return () => {
    element.removeEventListener('pointerdown', onPointerDown);
    element.removeEventListener('keydown', onKeyDown);
    element.removeEventListener('dblclick', onDoubleClick);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };
});

export type Args = {
  /** The primary action buttons rendered in the panel's footer. */
  actions?: SidePanelAction[];
  /** Buttons rendered in the header's action toolbar. */
  actionToolbarButtons?: SidePanelActionToolbarButton[];
  /** Determines if the title will animate on scroll. Defaults to `true`. */
  animateTitle?: boolean;
  /** Sets an optional class to be added to the side panel's outermost element. */
  className?: string;
  /** Sets the close button icon description. Defaults to `"Close"`. */
  closeIconDescription?: string;
  /** Sets the close button tooltip alignment. Defaults to `"left"`. */
  closeIconTooltipAlignment?: TooltipAlignment;
  /** Renders the condensed version of the actions container. */
  condensedActions?: boolean;
  /** Sets the current step of the side panel (`0` is the main page). */
  currentStep?: number;
  /** Provide a component (e.g. an `AILabel`) to be rendered inside the panel's header. */
  decorator?: ComponentLike<{ Args: { size?: string } }>;
  /** Show/hide the "X" close button. */
  hideCloseButton?: boolean;
  /** Unique identifier applied to the outermost element. */
  id?: string;
  /** Renders the side panel with an overlay behind it. */
  includeOverlay?: boolean;
  /** Sets the label text which will display above the title text. Requires `@title`. */
  labelText?: string;
  /**
   * The element that opened the side panel. Its `focus()` is called once
   * the panel closes, returning focus to it. (Ember has no ref objects, so
   * this takes the element directly rather than React's `RefObject`.)
   */
  launcherButtonRef?: HTMLElement;
  /** Sets the icon description for the navigation back icon button. Defaults to `"Back"`. */
  navigationBackIconDescription?: string;
  /** Called when the back button (shown when `@currentStep` > 0) is activated. */
  onNavigationBack?: () => void;
  /** Called when the panel should close (close button, overlay click, or Escape). */
  onRequestClose?: () => void;
  /** Called once the panel's closing animation has finished. */
  onUnmount?: () => void;
  /** Determines whether the side panel is open. */
  open: boolean;
  /** Determines if the side panel is on the right or left. Defaults to `"right"`. */
  placement?: 'left' | 'right';
  /** Prevent closing on click outside of the panel. */
  preventCloseOnClickOutside?: boolean;
  /** Allow the panel to be resized by dragging its edge. */
  resizable?: boolean;
  /**
   * CSS selector for the element that contains the page content that
   * should shrink when the panel is a `@slideIn`. Required when `@slideIn`
   * is `true`.
   */
  selectorPageContent?: string;
  /** CSS selector for the element that should receive focus when the panel opens. */
  selectorPrimaryFocus?: string;
  /** Sets the size of the side panel. */
  size: SidePanelSize;
  /** Renders the panel inline, shrinking `@selectorPageContent` instead of overlaying it. */
  slideIn?: boolean;
  /** Sets the subtitle text. Pass rich content via the `subtitle` block instead. */
  subtitle?: string;
  /** Sets the title text. */
  title?: string;
};

export interface SidePanelSignature {
  Element: HTMLElement;
  Args: Args;
  Blocks: {
    default: [];
    subtitle: [];
  };
}

/**
 * Side panels keep users in-context of a page while performing tasks like
 * navigating, editing, viewing details, or configuring something new.
 */
export default class SidePanel extends Component<SidePanelSignature> {
  @tracked closing = false;

  guid = guidFor(this);

  get shouldRender() {
    return this.args.open || this.closing;
  }

  get placement(): 'left' | 'right' {
    return this.args.placement ?? 'right';
  }

  get animateTitleEnabled() {
    return (this.args.animateTitle ?? true) && !!this.args.title;
  }

  get closeIconDescription() {
    return this.args.closeIconDescription ?? 'Close';
  }

  get closeIconTooltipAlignment(): TooltipAlignment {
    return this.args.closeIconTooltipAlignment ?? 'left';
  }

  get navigationBackIconDescription() {
    return this.args.navigationBackIconDescription ?? 'Back';
  }

  get currentStep() {
    return this.args.currentStep ?? 0;
  }

  get closeButtonSize() {
    const hasActions = !!this.args.actions?.length;
    return hasActions && /l/.test(this.args.size) ? 'md' : 'sm';
  }

  get showResizer() {
    return (
      !!this.args.resizable &&
      !this.args.slideIn &&
      typeof window !== 'undefined' &&
      window.innerWidth > 768
    );
  }

  get panelClasses() {
    return [
      'cds--side-panel',
      `cds--side-panel--${this.args.size}`,
      this.args.open ? 'cds--side-panel--open' : 'cds--side-panel--closing',
      this.placement === 'right' ? 'cds--side-panel--right-placement' : 'cds--side-panel--left-placement',
      this.args.slideIn ? 'cds--side-panel--slide-in' : '',
      this.args.resizable ? 'cds--side-panel--resizable' : '',
      this.args.decorator ? 'cds--side-panel--has-decorator' : '',
      this.args.condensedActions ? 'cds--side-panel--condensed-actions' : '',
      this.args.includeOverlay ? 'cds--side-panel--has-overlay' : '',
      this.args.className ?? '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  get headerClasses() {
    return [
      'cds--side-panel__header',
      this.currentStep > 0 ? 'cds--side-panel__header--on-detail-step' : '',
      this.animateTitleEnabled ? '' : 'cds--side-panel__header--no-title-animation',
      this.args.title ? 'cds--side-panel__header--has-title' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  get titleClasses() {
    return `cds--side-panel__title${this.args.labelText ? '' : ' cds--side-panel__title--no-label'}`;
  }

  get actionsSize(): Exclude<SidePanelSize, 'xs'> | 'sm' {
    return this.args.size === 'xs' ? 'sm' : this.args.size;
  }

  get actionsStacking() {
    const count = this.args.actions?.length ?? 0;
    return this.actionsSize === 'sm' || (this.actionsSize === 'md' && count > 2);
  }

  get sortedActions(): SidePanelAction[] {
    const stacking = this.actionsStacking;
    return [...(this.args.actions ?? [])].sort((a, b) => {
      const orderA = ACTION_BUTTON_ORDER[a.kind ?? 'primary'] ?? 4;
      const orderB = ACTION_BUTTON_ORDER[b.kind ?? 'primary'] ?? 4;
      return (orderA - orderB) * (stacking ? -1 : 1);
    });
  }

  get actionsContainerClasses() {
    const count = this.sortedActions.length;
    const stacking = this.actionsStacking;
    return [
      'cds--side-panel__actions-container',
      this.args.condensedActions ? 'cds--side-panel__actions-container--condensed' : '',
      'cds--action-set',
      'cds--btn-set',
      `cds--action-set--${this.actionsSize}`,
      stacking ? 'cds--action-set--stacking cds--btn-set--stacked' : '',
      !stacking && count === 1 ? 'cds--action-set--row-single' : '',
      !stacking && count === 2 ? 'cds--action-set--row-double' : '',
      !stacking && count === 3 ? 'cds--action-set--row-triple' : '',
      !stacking && count >= 4 ? 'cds--action-set--row-quadruple' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  @action
  actionButtonClasses(sidePanelAction: SidePanelAction) {
    const kind = sidePanelAction.kind ?? 'primary';
    return [
      'cds--btn',
      `cds--btn--${kind}`,
      `cds--layout--size-${this.actionsSize}`,
      'cds--action-set__action-button',
      kind === 'ghost' || kind === 'danger--ghost' ? 'cds--action-set__action-button--ghost' : '',
      sidePanelAction.className ?? '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  @action
  toolbarButtonClasses(button: SidePanelActionToolbarButton) {
    return [
      'cds--btn',
      `cds--btn--${button.kind ?? 'ghost'}`,
      'cds--btn--sm',
      'cds--side-panel__action-toolbar-button',
      button.leading ? 'cds--side-panel__action-toolbar-leading-button' : '',
      button.className ?? '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  @action
  requestClose() {
    this.args.onRequestClose?.();
  }

  @action
  navigateBack() {
    this.args.onNavigationBack?.();
  }

  @action
  handleActionClick(sidePanelAction: SidePanelAction, event: MouseEvent) {
    sidePanelAction.onClick?.(event);
  }

  @action
  handleToolbarButtonClick(button: SidePanelActionToolbarButton, event: MouseEvent) {
    button.onClick?.(event);
  }

  @action
  handleOverlayClick() {
    if (!this.args.preventCloseOnClickOutside) {
      this.requestClose();
    }
  }

  @action
  startClosing() {
    runTask(this, () => {
      if (this.isDestroyed) return;
      this.closing = true;
    });
    this.args.launcherButtonRef?.focus();
  }

  @action
  finishClosing() {
    runTask(this, () => {
      if (this.isDestroyed) return;
      this.closing = false;
      this.args.onUnmount?.();
    });
  }

  <template>
    {{#if this.shouldRender}}
      <aside
        id={{@id}}
        class={{this.panelClasses}}
        aria-label={{if @title @title}}
        {{trackPresence open=@open onClose=this.startClosing onClosed=this.finishClosing}}
        {{focusOnOpen open=@open slideIn=@slideIn selector=@selectorPrimaryFocus}}
        {{closeOnEscape open=@open slideIn=@slideIn onClose=this.requestClose}}
        ...attributes
      >
        {{#if this.showResizer}}
          <div
            class='cds--side-panel__resizer cds--resizer cds--resizer--vertical'
            role='slider'
            tabindex='0'
            aria-label='Resize side panel'
            aria-valuemin='16'
            aria-valuemax='75'
            {{resizeSidePanel size=@size placement=this.placement}}
          ></div>
        {{/if}}

        <div class={{this.headerClasses}}>
          {{#if (gt this.currentStep 0)}}
            <Tooltip @label={{this.navigationBackIconDescription}} @align='bottom'>
              <button
                type='button'
                class='cds--btn cds--btn--ghost cds--btn--sm cds--side-panel__navigation-back-button'
                aria-label={{this.navigationBackIconDescription}}
                {{on 'click' this.navigateBack}}
              >
                <ArrowLeft @size='16' @svgClass='cds--side-panel--btn__icon' />
              </button>
            </Tooltip>
          {{/if}}

          {{#if (and @title @labelText)}}
            <p class='cds--side-panel__label-text'>{{@labelText}}</p>
          {{/if}}

          {{#if @title}}
            <div class={{this.titleClasses}}>
              <h2 class='cds--side-panel__title-text'>{{@title}}</h2>
              {{#if this.animateTitleEnabled}}
                <h2 class='cds--side-panel__collapsed-title-text' aria-hidden='true'>{{@title}}</h2>
              {{/if}}
            </div>
          {{/if}}

          {{#if (or @decorator (not @hideCloseButton))}}
            <div class='cds--side-panel__decorator-and-close'>
              {{#if @decorator}}
                <@decorator @size='xs' />
              {{/if}}
              {{#unless @hideCloseButton}}
                <Tooltip @label={{this.closeIconDescription}} @align={{this.closeIconTooltipAlignment}}>
                  <button
                    type='button'
                    class='cds--btn cds--btn--ghost cds--btn--{{this.closeButtonSize}} cds--side-panel__close-button'
                    aria-label={{this.closeIconDescription}}
                    {{on 'click' this.requestClose}}
                  >
                    <Close @size='16' @svgClass='cds--side-panel--btn__icon' />
                  </button>
                </Tooltip>
              {{/unless}}
            </div>
          {{/if}}

          {{#if (has-block 'subtitle')}}
            <p class='cds--side-panel__subtitle-text'>{{yield to='subtitle'}}</p>
          {{else if @subtitle}}
            <p class='cds--side-panel__subtitle-text'>{{@subtitle}}</p>
          {{/if}}

          {{#if @actionToolbarButtons.length}}
            <div class='cds--side-panel__action-toolbar'>
              {{#each @actionToolbarButtons as |toolbarButton|}}
                {{#let (or toolbarButton.renderIcon toolbarButton.icon) as |ToolbarButtonIcon|}}
                  {{#if toolbarButton.hasIconOnly}}
                    <Tooltip @label={{toolbarButton.label}} @align={{if toolbarButton.tooltipPosition toolbarButton.tooltipPosition 'bottom'}}>
                      <button
                        type='button'
                        class={{this.toolbarButtonClasses toolbarButton}}
                        aria-label={{toolbarButton.label}}
                        disabled={{toolbarButton.disabled}}
                        {{on 'click' (fn this.handleToolbarButtonClick toolbarButton)}}
                      >
                        {{#if ToolbarButtonIcon}}<ToolbarButtonIcon @size='16' />{{/if}}
                      </button>
                    </Tooltip>
                  {{else}}
                    <button
                      type='button'
                      class={{this.toolbarButtonClasses toolbarButton}}
                      disabled={{toolbarButton.disabled}}
                      {{on 'click' (fn this.handleToolbarButtonClick toolbarButton)}}
                    >
                      {{#if ToolbarButtonIcon}}<ToolbarButtonIcon @size='16' />{{/if}}
                      {{#if toolbarButton.leading}}{{toolbarButton.label}}{{/if}}
                    </button>
                  {{/if}}
                {{/let}}
              {{/each}}
            </div>
          {{/if}}
        </div>

        <div
          class='cds--side-panel__inner-content cds--side-panel--scrolls {{unless this.animateTitleEnabled "cds--side-panel__inner-content--no-animated-title"}}'
          {{animateTitleOnScroll enabled=this.animateTitleEnabled}}
        >
          {{yield}}
        </div>

        {{#if @actions.length}}
          <div class={{this.actionsContainerClasses}} role='presentation'>
            {{#each this.sortedActions as |sidePanelAction|}}
              <button
                type='button'
                class={{this.actionButtonClasses sidePanelAction}}
                disabled={{or sidePanelAction.disabled sidePanelAction.loading}}
                {{on 'click' (fn this.handleActionClick sidePanelAction)}}
              >
                {{sidePanelAction.label}}
              </button>
            {{/each}}
          </div>
        {{/if}}
      </aside>

      {{#if @includeOverlay}}
        <div
          class='cds--side-panel__overlay {{unless @open "cds--side-panel__overlay--closing"}}'
          {{on 'click' this.handleOverlayClick}}
        ></div>
      {{/if}}
    {{/if}}
  </template>
}
