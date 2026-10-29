/**
 * Copyright IBM Corp. 2020, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Ported from Carbon core's SidePanel (what @carbon/react v12 exports), at
// carbon-design-system/carbon@087c138fbb1788d5dd54359f932eb542ee39accc:
// packages/react/src/components/SidePanel/SidePanel.tsx

import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';
import { waitForPromise } from '@ember/test-waiters';
import { modifier } from 'ember-modifier';
import AILabel from './ai-label.gts';
import ButtonBase from './-private/button-base.gts';
import ActionSet from './-private/action-set.gts';
import Button from './button.gts';
import Layer from './layer.gts';
import Resizer from './resizer.gts';
import Tooltip from './tooltip.gts';
import ArrowLeft from './icons/arrow-left.ts';
import Close from './icons/close.ts';
import { afterRender } from '../utils/after-render.ts';
import { mediaQuery } from '../utils/media-query.ts';
import { tabbables } from '../utils/tabbable.ts';
import { observeResize } from '../utils/resize-observer.ts';
import type { ActionSetAction } from './-private/action-set.gts';
import type { ButtonSignature } from './button.gts';
import type { PopoverAlignment } from './popover.gts';
import type { TOC } from '@ember/component/template-only';
import type { WithBoundArgs } from '@glint/template';

export type SidePanelAction = ActionSetAction;

export interface SidePanelToolbarButton {
  /** Names the button. With `leading` it's also the button's text. */
  label: string;
  kind?: ButtonSignature['Args']['kind'];
  /** Shows only the icon, with `label` in its tooltip. */
  hasIconOnly?: boolean;
  /** The button's icon. `icon` is an alias of `renderIcon`. */
  renderIcon?: ButtonSignature['Args']['renderIcon'];
  icon?: ButtonSignature['Args']['renderIcon'];
  tooltipPosition?: ButtonSignature['Args']['tooltipPosition'];
  tooltipAlignment?: ButtonSignature['Args']['tooltipAlignment'];
  /** Shows the label in the button, before the others. */
  leading?: boolean;
  disabled?: boolean;
  /** Classes added to the button. */
  className?: string;
  onClick?: (event: MouseEvent) => void;
}

type SidePanelSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface SidePanelSignature {
  Element: HTMLElement;
  Args: {
    /**
     * Sets the action toolbar buttons, shown in the header under the title.
     */
    actionToolbarButtons?: SidePanelToolbarButton[];
    /**
     * The primary actions in the footer, each an object that describes a
     * button: `label`, `kind`, `disabled`, `loading`, `onClick`, ... At most
     * four, one `primary` and one `ghost`.
     */
    actions?: SidePanelAction[];
    /**
     * Whether the title animates as the content scrolls. Defaults to `true`.
     */
    animateTitle?: boolean;
    /** Names the close button. Defaults to `Close`. */
    closeIconDescription?: string;
    /**
     * Where the close button's tooltip opens, relative to it. Defaults to
     * `left`.
     */
    closeIconTooltipAlignment?: PopoverAlignment;
    /**
     * Renders the condensed version, which makes the action buttons shorter.
     */
    condensedActions?: boolean;
    /**
     * The current step of a multi-step panel. From step 1 the header shows a
     * back button, which calls `@onNavigationBack`. Defaults to 0.
     */
    currentStep?: number;
    /** Hides the close button. */
    hideCloseButton?: boolean;
    /** Shows an overlay over the page, which locks its scrolling. */
    includeOverlay?: boolean;
    /** Text above the title. It needs a `@title`. */
    labelText?: string;
    /**
     * The element to return focus to once the panel closes.
     */
    launcherButtonRef?: HTMLElement | null;
    /** Names the back button. Defaults to `Back`. */
    navigationBackIconDescription?: string;
    /** Called when the back button is pressed. */
    onNavigationBack?: (event: MouseEvent) => void;
    /**
     * Called to close the panel: by its close button, by Escape and, with an
     * overlay, by a click on it. It should set `@open` to `false`.
     */
    onRequestClose?: (event: Event) => void;
    /**
     * Called once the panel has closed and left the DOM, after its exit
     * animation. Use it for any cleanup its removal needs.
     */
    onUnmount?: () => void;
    /** Whether the panel is shown. */
    open: boolean;
    /** Which side of the page the panel is on. Defaults to `right`. */
    placement?: 'left' | 'right';
    /** Keeps a click on the overlay from closing the panel. */
    preventCloseOnClickOutside?: boolean;
    /**
     * Makes the panel resizable: a handle on its edge resizes it by drag or
     * keyboard on screens wider than 768px. Not for a slide-in panel.
     */
    resizable?: boolean;
    /**
     * A CSS selector for the element holding the page's content, which a
     * `@slideIn` panel makes room for. Required with `@slideIn`.
     */
    selectorPageContent?: string;
    /**
     * A CSS selector for the element in the panel to focus when it opens.
     * Without one, the first element that takes focus gets it.
     */
    selectorPrimaryFocus?: string;
    /** The panel's width. Defaults to `md`. */
    size?: SidePanelSize;
    /**
     * Pushes the page's content aside (`@selectorPageContent`) instead of
     * covering it. The panel then isn't modal: it doesn't trap focus or
     * close on Escape.
     */
    slideIn?: boolean;
    /** The subtitle, under the title. Use the `subtitle` block for markup. */
    subtitle?: string;
    /** The title. It also names the panel. */
    title?: string;
  };
  Blocks: {
    /** The panel's content. */
    default: [];
    /**
     * **Experimental:** an AI label, or any other decorator, shown in the
     * header beside the close button. Yields an `AILabel` already set up for
     * it.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size'>];
    /** The subtitle, when it needs more than text. */
    subtitle: [];
  };
}

const SIDE_PANEL_SIZES: Record<SidePanelSize, string> = {
  xs: '16rem',
  sm: '20rem',
  md: '30rem',
  lg: '40rem',
  xl: '65rem',
  '2xl': '80rem',
};

// Carbon's moderate-02 motion duration.
const MODERATE_02 = '240ms';
const MODIFIED_SIZE = '--cds-side-panel-modified-size';
const PROGRESS = '--cds--side-panel--scroll-animation-progress';
const DISTANCE = '--cds--side-panel--scroll-animation-distance';
const RESIZABLE_MIN_WIDTH = 768;

function percentOfScreen(width: number) {
  return Math.round((width / window.innerWidth) * 100);
}

// Carbon React's IconButton: the button in a tooltip naming it.
const IconButton: TOC<{
  Element: ButtonSignature['Element'];
  Args: {
    align: PopoverAlignment;
    kind?: ButtonSignature['Args']['kind'];
    label: string;
    onClick: (event: MouseEvent) => void;
    size: ButtonSignature['Args']['size'];
  };
  Blocks: { default: [] };
}> = <template>
  <Tooltip
    class="cds--icon-tooltip"
    @align={{@align}}
    @label={{@label}}
    @closeOnActivation={{true}}
    @leaveDelayMs={{100}}
  >
    <ButtonBase
      @hasIconOnly={{true}}
      @kind={{@kind}}
      @size={{@size}}
      ...attributes
      {{on "click" @onClick}}
    >
      {{yield}}
    </ButtonBase>
  </Tooltip>
</template>;

/**
 * Side panels keep users in context of a page while performing tasks like
 * navigating, editing, viewing details, or configuring something new.
 *
 * ```gjs
 * <SidePanel
 *   @open={{this.open}}
 *   @onRequestClose={{this.close}}
 *   @title="Incident management"
 *   @actions={{this.actions}}
 * >
 *   Content
 * </SidePanel>
 * ```
 */
export default class SidePanel extends Component<SidePanelSignature> {
  #wide = mediaQuery(this, `(min-width: ${RESIZABLE_MIN_WIDTH + 1}px)`);

  #reducedMotion = mediaQuery(this, '(prefers-reduced-motion: reduce)');

  // Stays rendered while it closes, until its exit animation is done.
  @tracked keep = false;

  // The entrance animation is done.
  @tracked animationComplete = false;

  // The title and the label and subtitle above it shrink as the content
  // scrolls.
  @tracked doAnimateTitle = true;

  @tracked panelWidth = 0;

  panel?: HTMLElement;

  // The page content a slide-in panel made room by.
  pageContent?: HTMLElement;

  noActions: SidePanelAction[] = [];

  wasOpen = false;
  scrollAnimationDistance = 0;
  labelTextHeight = 0;
  previousStep?: number;
  previousSize?: SidePanelSize;

  // The width a resize starts from, and the keyboard resizes since it.
  baseWidth = 0;
  accumulatedDelta = 0;
  resizing = false;

  constructor(owner: Owner, args: SidePanelSignature['Args']) {
    super(owner, args);
    registerDestructor(this, () => this.resetPageContent());
  }

  get reducedMotion() {
    return this.#reducedMotion.matches;
  }

  get shouldRender() {
    return this.args.open || this.keep;
  }

  get size(): SidePanelSize {
    return this.args.size ?? 'md';
  }

  get placement() {
    return this.args.placement ?? 'right';
  }

  get animateTitle() {
    return this.args.animateTitle ?? true;
  }

  get currentStep() {
    return this.args.currentStep ?? 0;
  }

  get detailStep() {
    return this.currentStep > 0;
  }

  get complete() {
    return this.animationComplete || this.reducedMotion;
  }

  get hasSubtitle() {
    return Boolean(this.args.subtitle);
  }

  get hasToolbar() {
    return Boolean(this.args.actionToolbarButtons?.length);
  }

  get hasLabel() {
    return Boolean(this.args.title && this.args.labelText);
  }

  get collapsedTitle() {
    return this.doAnimateTitle && !this.reducedMotion;
  }

  get noAnimatedTitle() {
    return !this.doAnimateTitle && !this.animateTitle;
  }

  get closeSize(): ButtonSignature['Args']['size'] {
    return this.args.actions?.length && /l/.test(this.size) ? 'md' : 'sm';
  }

  // Resizing is for wide screens, as in Carbon React.
  get wide() {
    return this.#wide.matches;
  }

  get resizable() {
    return Boolean(this.args.resizable && this.wide);
  }

  get showResizer() {
    return this.resizable && !this.args.slideIn;
  }

  get percent() {
    return this.panelWidth ? percentOfScreen(this.panelWidth) : 0;
  }

  get minPercent() {
    const rem = parseFloat(SIDE_PANEL_SIZES.xs);
    const root = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    return percentOfScreen(rem * root);
  }

  get resizerLabel() {
    return `side panel is covering ${this.percent}% of screen`;
  }

  get toolbarButtons() {
    return (this.args.actionToolbarButtons ?? []).map((button) => ({
      button,
      kind: button.kind ?? 'ghost',
      renderIcon: button.renderIcon ?? button.icon,
      hasIconOnly: Boolean(button.hasIconOnly),
      position: button.hasIconOnly
        ? (button.tooltipPosition ?? 'bottom')
        : undefined,
      alignment: button.hasIconOnly
        ? (button.tooltipAlignment ?? 'start')
        : undefined,
    }));
  }

  // The title names the panel, over a caller's `aria-label`.
  nameByTitle = modifier(
    (panel: HTMLElement, [title]: [string | undefined]) => {
      if (!title) return;
      const previous = panel.getAttribute('aria-label');
      panel.setAttribute('aria-label', title);
      return () => {
        if (previous === null) panel.removeAttribute('aria-label');
        else panel.setAttribute('aria-label', previous);
      };
    },
  );

  // Keeps the panel rendered while it closes, until its exit animation is
  // done, then lets it go.
  trackPresence = modifier(
    (panel: HTMLElement, [open, placement]: [boolean, string]) => {
      this.panel = panel;
      if (open) {
        afterRender(this, () => {
          this.keep = true;
          // Without an entrance animation (no stylesheet, or none to play)
          // it has arrived already.
          const entering = panel
            .getAnimations()
            .some(
              (animation) =>
                animation instanceof CSSAnimation &&
                animation.animationName.startsWith('side-panel-entrance'),
            );
          if (!entering) this.animationComplete = true;
        });
        return;
      }
      afterRender(this, () => {
        this.animationComplete = false;
      });
      const name = this.reducedMotion
        ? 'side-panel-exit-reduced'
        : `side-panel-exit-${placement}`;
      const animations = panel
        .getAnimations({ subtree: true })
        .filter(
          (animation) =>
            animation instanceof CSSAnimation &&
            animation.animationName === name,
        );
      let cancelled = false;
      const finish = () =>
        afterRender(this, () => {
          if (cancelled) return;
          this.keep = false;
          this.args.onUnmount?.();
        });
      if (!animations.length) {
        finish();
      } else {
        waitForPromise(
          Promise.all(animations.map((animation) => animation.finished)),
        ).then(finish, () => {});
      }
      return () => {
        cancelled = true;
      };
    },
  );

  handleAnimationStart = (event: AnimationEvent) => {
    if (event.target === event.currentTarget) this.animationComplete = false;
  };

  handleAnimationEnd = (event: AnimationEvent) => {
    if (event.target === event.currentTarget && this.args.open) {
      this.animationComplete = true;
    }
  };

  closeOnEscape = modifier(
    (_panel: HTMLElement, [open, slideIn]: [boolean, boolean | undefined]) => {
      if (!open || slideIn) return;
      const handle = (event: KeyboardEvent) => {
        if (event.key === 'Escape') this.args.onRequestClose?.(event);
      };
      window.addEventListener('keydown', handle);
      return () => window.removeEventListener('keydown', handle);
    },
  );

  // Tab goes around the panel's elements, unless it slides in.
  handleKeyDown = (event: KeyboardEvent) => {
    if (this.args.slideIn || event.key !== 'Tab') return;
    const elements = tabbables(event.currentTarget as HTMLElement);
    const first = elements[0];
    const last = elements.at(-1);
    if (!first || !last) return;
    const active = document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  // Focus moves into the panel once it has arrived: to the
  // `@selectorPrimaryFocus` element, else the first one that takes focus.
  focusOnOpen = modifier(
    (
      panel: HTMLElement,
      [open, complete, selector, slideIn]: [
        boolean,
        boolean,
        string | undefined,
        boolean | undefined,
      ],
    ) => {
      if (!open || !complete) return;
      const primary = selector
        ? panel.querySelector<HTMLElement>(selector)
        : null;
      if (primary) {
        if (getComputedStyle(primary).display !== 'none') primary.focus();
      } else if (!slideIn) {
        tabbables(panel)[0]?.focus();
      }
    },
  );

  returnFocus = modifier((_panel: HTMLElement, [open]: [boolean]) => {
    const closed = this.wasOpen && !open;
    this.wasOpen = open;
    if (closed) {
      afterRender(this, () => this.args.launcherButtonRef?.focus());
    }
  });

  lockScroll = modifier((_overlay: HTMLElement, [open]: [boolean]) => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  });

  handleOverlayClick = (event: MouseEvent) => {
    if (!this.args.preventCloseOnClickOutside)
      this.args.onRequestClose?.(event);
  };

  // A slide-in panel makes room for itself in the page's content.
  syncSlideIn = modifier(
    (
      _panel: HTMLElement,
      [open, slideIn, selector, placement, size]: [
        boolean,
        boolean | undefined,
        string | undefined,
        'left' | 'right',
        SidePanelSize,
      ],
    ) => {
      if (!slideIn) return;
      const page = selector
        ? document.querySelector<HTMLElement>(selector)
        : null;
      if (!page) return;
      this.pageContent = page;
      const end = placement === 'right';
      const side = end ? 'marginInlineEnd' : 'marginInlineStart';
      page.style[end ? 'marginInlineStart' : 'marginInlineEnd'] = '';
      if (!open) {
        page.style[side] = '0';
        return;
      }
      page.style.inlineSize = 'auto';
      page.style.transition = this.reducedMotion
        ? ''
        : `${end ? 'margin-inline-end' : 'margin-inline-start'} ${MODERATE_02}`;
      page.style[side] = SIDE_PANEL_SIZES[size];
    },
  );

  resetPageContent() {
    const page = this.pageContent;
    if (!page) return;
    page.style.marginInlineStart = '0';
    page.style.marginInlineEnd = '0';
  }

  // A new size, or none of the user's, is the panel's own again.
  syncResizable = modifier(
    (panel: HTMLElement, [resizable, size]: [boolean, SidePanelSize]) => {
      void size;
      panel.style.removeProperty(MODIFIED_SIZE);
      if (!resizable) return;
      this.resizing = false;
      this.accumulatedDelta = 0;
      return observeResize(panel, () => {
        this.panelWidth = panel.clientWidth;
        if (!this.resizing) this.baseWidth = panel.clientWidth;
      });
    },
  );

  setWidth(width: number | string) {
    this.panel?.style.setProperty(
      MODIFIED_SIZE,
      typeof width === 'number' ? `${width}px` : width,
    );
  }

  handleResize = (event: MouseEvent | KeyboardEvent, delta: number) => {
    event.preventDefault();
    event.stopPropagation();
    this.resizing = true;
    const right = this.placement === 'right';
    if (event instanceof KeyboardEvent) {
      switch (event.key) {
        case 'Home':
          this.setWidth('75vw');
          break;
        case 'End':
          this.setWidth(SIDE_PANEL_SIZES.xs);
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          this.accumulatedDelta += delta;
          this.setWidth(
            this.baseWidth -
              (right ? this.accumulatedDelta : -this.accumulatedDelta),
          );
          break;
      }
      return;
    }
    if (this.panel) this.panel.style.transition = 'none';
    this.setWidth(this.baseWidth - (right ? delta : -delta));
  };

  handleResizeEnd = () => {
    this.accumulatedDelta = 0;
    this.panel?.style.removeProperty('transition');
    this.baseWidth = this.panel?.clientWidth ?? 0;
    this.panelWidth = this.baseWidth;
    this.resizing = false;
  };

  // Back to the size the panel's `@size` gives it.
  handleDoubleClick = () => {
    this.baseWidth = Math.min(
      parseFloat(SIDE_PANEL_SIZES[this.size]) * 16,
      window.innerWidth * 0.75,
    );
    this.panel?.style.removeProperty(MODIFIED_SIZE);
  };

  // The content scrolls back to the top between steps, and when the panel's
  // size changes.
  resetScroll = modifier(
    (panel: HTMLElement, [currentStep, size]: [number, SidePanelSize]) => {
      const changed =
        this.previousStep !== undefined &&
        (this.previousStep !== currentStep || this.previousSize !== size);
      this.previousStep = currentStep;
      this.previousSize = size;
      if (changed) {
        const content = panel.querySelector('.cds--side-panel__inner-content');
        if (content) content.scrollTop = 0;
      }
    },
  );

  // Decides whether the title can animate, now that the panel has arrived:
  // there must be something to collapse and enough content to scroll.
  syncTitleAnimation = modifier(
    (
      panel: HTMLElement,
      [open, animateTitle, complete, title, size, reduced]: [
        boolean,
        boolean,
        boolean,
        string | undefined,
        SidePanelSize,
        boolean,
      ],
    ) => {
      void size;
      const doAnimate = this.doAnimateTitle;
      const titleElement = panel.querySelector<HTMLElement>(
        '.cds--side-panel__title',
      );
      const label = panel.querySelector<HTMLElement>(
        '.cds--side-panel__label-text',
      );
      const subtitle = panel.querySelector<HTMLElement>(
        '.cds--side-panel__subtitle-text',
      );
      const content = panel.querySelector<HTMLElement>(
        '.cds--side-panel__inner-content',
      );
      if (open && animateTitle && label) {
        this.labelTextHeight = label.clientHeight;
      }
      let next: boolean;
      if (
        open &&
        animateTitle &&
        complete &&
        titleElement &&
        title &&
        !reduced
      ) {
        const distance =
          (label?.offsetHeight ?? 0) +
          (subtitle?.offsetHeight ?? 0) +
          (this.hasToolbar
            ? titleElement.offsetHeight - titleElement.clientHeight
            : 0);
        this.scrollAnimationDistance = distance;
        panel.style.setProperty(DISTANCE, String(distance));
        next = false;
        if (content && (label || subtitle || this.hasToolbar)) {
          const computed = getComputedStyle(content);
          const padding =
            parseFloat(computed.paddingTop) +
            parseFloat(computed.paddingBottom);
          next =
            content.scrollHeight - content.clientHeight >= distance + padding;
        }
      } else {
        next = open && !titleElement ? false : animateTitle;
      }
      if (!next) {
        panel.style.setProperty(PROGRESS, '0');
        label?.style.removeProperty('margin-top');
        subtitle?.style.removeProperty('margin-top');
      }
      if (next !== doAnimate) {
        afterRender(this, () => {
          this.doAnimateTitle = next;
        });
      }
    },
  );

  handleScroll = (event: Event) => {
    const content = event.currentTarget as HTMLElement;
    const panel = this.panel;
    const distance = this.scrollAnimationDistance;
    if (!this.doAnimateTitle || !panel || distance <= 0) return;
    const progress = Math.min(content.scrollTop, distance) / distance;
    panel.style.setProperty(PROGRESS, String(progress));
    const subtitle = panel.querySelector<HTMLElement>(
      '.cds--side-panel__subtitle-text',
    );
    const label = panel.querySelector<HTMLElement>(
      '.cds--side-panel__label-text',
    );
    subtitle?.style.setProperty(
      'margin-top',
      `${-subtitle.clientHeight * progress}px`,
    );
    label?.style.setProperty(
      'margin-top',
      `${-this.labelTextHeight * progress}px`,
    );
  };

  goBack = (event: MouseEvent) => {
    this.args.onNavigationBack?.(event);
  };

  requestClose = (event: MouseEvent) => {
    this.args.onRequestClose?.(event);
  };

  clickToolbarButton = (button: SidePanelToolbarButton, event: MouseEvent) => {
    button.onClick?.(event);
  };

  <template>
    {{#if this.shouldRender}}
      {{! eslint-disable-next-line ember/template-no-invalid-interactive -- the keydown only keeps Tab inside the panel }}
      <aside
        class="cds--side-panel cds--side-panel--{{this.size}}
          cds--side-panel--{{this.placement}}-placement
          {{if @slideIn 'cds--side-panel--slide-in'}}
          {{if this.resizable 'cds--side-panel--resizable'}}
          {{if (has-block 'decorator') 'cds--side-panel--has-decorator'}}
          {{if @condensedActions 'cds--side-panel--condensed-actions'}}
          {{if @includeOverlay 'cds--side-panel--has-overlay'}}
          {{if @open 'cds--side-panel--open' 'cds--side-panel--closing'}}
          {{if this.reducedMotion 'cds--side-panel--reduced-motion'}}"
        ...attributes
        {{this.nameByTitle @title}}
        {{this.trackPresence @open this.placement}}
        {{this.closeOnEscape @open @slideIn}}
        {{this.focusOnOpen @open this.complete @selectorPrimaryFocus @slideIn}}
        {{this.returnFocus @open}}
        {{this.syncSlideIn
          @open
          @slideIn
          @selectorPageContent
          this.placement
          this.size
        }}
        {{this.syncResizable this.showResizer this.size}}
        {{this.resetScroll this.currentStep this.size}}
        {{this.syncTitleAnimation
          @open
          this.animateTitle
          this.complete
          @title
          this.size
          this.reducedMotion
        }}
        {{on "animationstart" this.handleAnimationStart}}
        {{on "animationend" this.handleAnimationEnd}}
        {{on "keydown" this.handleKeyDown}}
      >
        {{#if this.showResizer}}
          <Resizer
            @orientation="vertical"
            @onResize={{this.handleResize}}
            @onResizeEnd={{this.handleResizeEnd}}
            @onDoubleClick={{this.handleDoubleClick}}
            class="cds--side-panel__resizer"
            aria-label={{this.resizerLabel}}
            aria-valuemin={{this.minPercent}}
            aria-valuemax="75"
            aria-valuenow={{this.percent}}
          />
        {{/if}}
        <div
          class="cds--side-panel__header
            {{if this.detailStep 'cds--side-panel__header--on-detail-step'}}
            {{unless
              this.animateTitle
              'cds--side-panel__header--no-title-animation'
            }}
            {{if this.reducedMotion 'cds--side-panel__header--reduced-motion'}}
            {{if @title 'cds--side-panel__header--has-title'}}"
        >
          {{#if this.detailStep}}
            <IconButton
              @kind="ghost"
              @size={{this.closeSize}}
              @align="bottom"
              @label={{if
                @navigationBackIconDescription
                @navigationBackIconDescription
                "Back"
              }}
              @onClick={{this.goBack}}
              class="cds--side-panel__navigation-back-button"
            >
              <ArrowLeft />
            </IconButton>
          {{/if}}
          {{#if this.hasLabel}}
            <p class="cds--side-panel__label-text">{{@labelText}}</p>
          {{/if}}
          {{#if @title}}
            <div
              class="cds--side-panel__title
                {{unless this.hasLabel 'cds--side-panel__title--no-label'}}"
            >
              <h2 class="cds--side-panel__title-text">{{@title}}</h2>
              {{#if this.collapsedTitle}}
                <h2
                  class="cds--side-panel__collapsed-title-text"
                  aria-hidden="true"
                >{{@title}}</h2>
              {{/if}}
            </div>
          {{/if}}
          {{#if (or (has-block "decorator") (not @hideCloseButton))}}
            <div class="cds--side-panel__decorator-and-close">
              {{#if (has-block "decorator")}}
                {{yield (component AILabel size="xs") to="decorator"}}
              {{/if}}
              {{#unless @hideCloseButton}}
                <IconButton
                  @size={{this.closeSize}}
                  @align={{if
                    @closeIconTooltipAlignment
                    @closeIconTooltipAlignment
                    "left"
                  }}
                  @label={{if
                    @closeIconDescription
                    @closeIconDescription
                    "Close"
                  }}
                  @onClick={{this.requestClose}}
                  class="cds--side-panel__close-button"
                >
                  <Close @size={{16}} @svgClass="cds--side-panel--btn__icon" />
                </IconButton>
              {{/unless}}
            </div>
          {{/if}}
          {{#if (or this.hasSubtitle (has-block "subtitle"))}}
            <p
              class="cds--side-panel__subtitle-text
                {{if
                  (and (not this.doAnimateTitle) (not this.hasToolbar))
                  'cds--side-panel__subtitle-text-no-animation-no-action-toolbar'
                }}"
            >
              {{#if (has-block "subtitle")}}
                {{yield to="subtitle"}}
              {{else}}
                {{@subtitle}}
              {{/if}}
            </p>
          {{/if}}
          {{#if this.hasToolbar}}
            <div class="cds--side-panel__action-toolbar">
              {{#each this.toolbarButtons as |item|}}
                <Button
                  @kind={{item.kind}}
                  @size="sm"
                  @renderIcon={{item.renderIcon}}
                  @iconDescription={{item.button.label}}
                  @hasIconOnly={{item.hasIconOnly}}
                  @tooltipPosition={{item.position}}
                  @tooltipAlignment={{item.alignment}}
                  @disabled={{item.button.disabled}}
                  class="cds--side-panel__action-toolbar-button
                    {{item.button.className}}
                    {{if
                      item.button.leading
                      'cds--side-panel__action-toolbar-leading-button'
                    }}"
                  {{on "click" (fn this.clickToolbarButton item.button)}}
                >{{#if
                    item.button.leading
                  }}{{item.button.label}}{{/if}}</Button>
              {{/each}}
            </div>
          {{/if}}
        </div>
        {{! The content scrolls, which animates the title. }}
        <div
          class="cds--side-panel__inner-content cds--side-panel--scrolls
            {{if
              this.noAnimatedTitle
              'cds--side-panel__inner-content--no-animated-title'
            }}"
          {{on "scroll" this.handleScroll}}
        >
          <Layer>{{yield}}</Layer>
        </div>
        <ActionSet
          @actions={{if @actions @actions this.noActions}}
          @size={{this.actionSetSize}}
          class="cds--side-panel__actions-container
            {{if
              @condensedActions
              'cds--side-panel__actions-container--condensed'
            }}"
        />
      </aside>
      {{#if @includeOverlay}}
        {{! eslint-disable-next-line ember/template-no-invalid-interactive -- the overlay is a click target to close the panel; Escape and the close button are the keyboard's }}
        <div
          class="cds--side-panel__overlay
            {{unless @open 'cds--side-panel__overlay--closing'}}"
          {{on "click" this.handleOverlayClick}}
          {{this.lockScroll @open}}
        ></div>
      {{/if}}
    {{/if}}
  </template>

  get actionSetSize() {
    return this.size === 'xs' ? 'sm' : this.size;
  }
}
