import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { concat } from '@ember/helper';
import { registerDestructor } from '@ember/destroyable';
import type { WithBoundArgs } from '@glint/template';
import type Owner from '@ember/owner';
import type Icon from './icon.gts';
import didResize from 'ember-resize-modifier/modifiers/did-resize';
import { modifier as eModifier } from 'ember-modifier';
import { runTask } from 'ember-lifeline';

export interface TabPaneSignature {
  Args: {
    tab: Tabs;
    title: string;
    disabled?: boolean;
    isDefault?: boolean;
    /** Icon rendered alongside the tab label, e.g. from `carbon-components-ember/icons`. */
    renderIcon?: typeof Icon;
    /** Subtitle rendered under the label. Only shown when the parent `Tabs` is `@contained`. */
    secondaryLabel?: string;
  };
  Blocks: {
    default: [];
  };
}

class TabPane extends Component<TabPaneSignature> {
  get index() {
    return this.args.tab.tabs.findIndex((t) => t === this);
  }

  get isSelected(): boolean {
    return this.args.tab.selectedTab === this;
  }

  get isFocusable(): boolean {
    return this.args.tab.focusableTab === this;
  }

  constructor(owner: Owner, args: TabPaneSignature['Args']) {
    super(owner, args);
    runTask(this, () => {
      if (this.isDestroyed) {
        return;
      }
      this.args.tab.registerTab(this);
      registerDestructor(this, () => {
        this.args.tab.unregisterTab(this);
      });
    });
  }
  <template>
    {{! Always rendered (matching @carbon/react which always mounts every
        TabPanel); hidden when not selected so that aria-controls on the
        tab buttons always points at an existing element. }}
    <div
      class="cds--tab-content"
      aria-labelledby="{{@tab.guid}}-tab-{{this.index}}"
      id="{{@tab.guid}}-tabpanel-{{this.index}}"
      tabindex={{if this.isSelected "0"}}
      role="tabpanel"
      hidden={{unless this.isSelected true}}
    >
      {{yield}}
    </div>
  </template>
}

export interface TabsSignature {
  Args: {
    selectedTab?: string;
    tabSelected?: (tab: string) => void;
    loading?: boolean;
    contained?: boolean;
    disabled?: boolean;
    /**
     * Size of the tabs. `sm` and `md` apply to line tabs; `lg` only takes
     * effect when `@contained` is also set (a no-op on line tabs otherwise).
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * When `@contained`, stretches tabs to fill the available width in equal
     * shares.
     */
    fullWidth?: boolean;
    /**
     * `automatic` (default) selects a tab as soon as it receives keyboard
     * focus. `manual` only moves focus with the arrow keys; Enter/Space
     * selects the focused tab.
     */
    activation?: 'automatic' | 'manual';
    /** Renders a close button on every tab. Requires `@onTabCloseRequest`. */
    dismissable?: boolean;
    onTabCloseRequest?: (tab: string) => void;
    ariaLabel?: string;
  };
  Blocks: {
    default: [TabPane: WithBoundArgs<typeof TabPane, 'tab'>];
  };
}

// Carbon's `lg` breakpoint — same `rem` value upstream uses in `Tabs.js`
// (`breakpoints.lg.width` from `@carbon/layout`, which is `66rem`).
const LG_BREAKPOINT = '(min-width: 66rem)';

export default class Tabs extends Component<TabsSignature> {
  @tracked resized: number = 1;
  @tracked scrolled: number = 1;
  @tracked currentTab?: TabPane;
  @tracked focusedTab?: TabPane;
  @tracked tabsDivElement?: HTMLDivElement;
  @tracked tabs: TabPane[] = [];
  @tracked isLg: boolean =
    typeof window !== 'undefined'
      ? window.matchMedia(LG_BREAKPOINT).matches
      : true;

  constructor(owner: Owner, args: TabsSignature['Args']) {
    super(owner, args);
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia(LG_BREAKPOINT);
      const onChange = (e: MediaQueryListEvent) => {
        this.isLg = e.matches;
      };
      mql.addEventListener('change', onChange);
      registerDestructor(this, () =>
        mql.removeEventListener('change', onChange),
      );
    }
  }

  get guid() {
    return guidFor(this);
  }

  registerTab(tab: TabPane) {
    this.tabs = [...this.tabs, tab];
    if (tab.args.isDefault && !this.currentTab) {
      this.tabSelected(tab);
    }
  }

  unregisterTab(tab: TabPane) {
    this.tabs = this.tabs.filter((t) => t !== tab);
  }

  get selectedTab(): TabPane | undefined {
    if (this.args.selectedTab) {
      return this.tabs.find((t) => t.args.title === this.args.selectedTab);
    }
    // Uncontrolled: fall back to the first enabled tab when no explicit
    // default has been set yet (matching @carbon/react which always selects
    // index 0 unless overridden via defaultSelectedIndex).
    return this.currentTab ?? this.enabledTabs[0];
  }

  get focusableTab(): TabPane | undefined {
    return this.focusedTab ?? this.selectedTab ?? this.enabledTabs[0];
  }

  isTabDisabled = (tab: TabPane) => {
    return !!(this.args.disabled || tab.args.disabled);
  };

  get enabledTabs() {
    return this.tabs.filter((t) => !this.isTabDisabled(t));
  }

  get activation() {
    return this.args.activation ?? 'automatic';
  }

  get hasSecondaryLabelTabs() {
    return (
      !!this.args.contained &&
      this.tabs.some((t) => t.args.secondaryLabel !== undefined)
    );
  }

  get showSizeClass() {
    return (
      !!this.args.size &&
      !this.hasSecondaryLabelTabs &&
      (!!this.args.contained ||
        this.args.size === 'sm' ||
        this.args.size === 'md')
    );
  }

  get showFullWidthClass() {
    return (
      !!this.args.fullWidth &&
      !!this.args.contained &&
      this.tabs.length < 9 &&
      this.isLg
    );
  }

  tabSelected = (tab: TabPane) => {
    if (this.isTabDisabled(tab)) return;
    this.currentTab = tab;
    this.focusedTab = tab;
    this.args.tabSelected?.(tab.args.title);
  };

  closeTab = (tab: TabPane, event?: Event) => {
    event?.stopPropagation();
    // The close button is always rendered (visually hidden when not
    // dismissable, matching @carbon/react's DOM), so guard here too.
    if (!this.args.dismissable || this.isTabDisabled(tab)) return;
    this.args.onTabCloseRequest?.(tab.args.title);
  };

  get scrollButtonCheckConditions() {
    return this.resized && this.tabs.length && this.scrolled;
  }

  get showScrollLeft() {
    return (
      this.scrollButtonCheckConditions && this.tabsDivElement?.scrollLeft !== 0
    );
  }

  get showScrollRight() {
    if (!this.tabsDivElement) return false;
    const maxScrollLeft =
      this.tabsDivElement?.scrollWidth - this.tabsDivElement?.clientWidth - 0.5;
    return (
      this.scrollButtonCheckConditions &&
      this.tabsDivElement.scrollLeft < maxScrollLeft
    );
  }

  registerTabsDiv = eModifier<{ Element: HTMLDivElement }>((element) => {
    this.tabsDivElement = element;
    return () => {
      this.tabsDivElement = undefined;
    };
  });

  focusTabElement(tab?: TabPane) {
    if (!tab) return;
    const index = this.tabs.indexOf(tab);
    const element = document.getElementById(`${this.guid}-tab-${index}`);
    element?.focus();
  }

  scrollRight = () => {
    this.tabsDivElement?.scrollBy({
      left: 100,
    });
  };

  scrollLeft = () => {
    this.tabsDivElement?.scrollBy({
      left: -100,
    });
  };

  onResize = () => {
    this.resized++;
  };

  onScroll = () => {
    this.scrolled++;
  };

  moveFocus = (direction: 1 | -1) => {
    const enabled = this.enabledTabs;
    if (!enabled.length) return;
    const current = this.focusableTab;
    const currentIndex = current ? enabled.indexOf(current) : -1;
    const nextIndex =
      currentIndex === -1
        ? 0
        : (currentIndex + direction + enabled.length) % enabled.length;
    this.focusTab(enabled[nextIndex]);
  };

  focusEdge = (edge: 'first' | 'last') => {
    const enabled = this.enabledTabs;
    if (!enabled.length) return;
    this.focusTab(edge === 'first' ? enabled[0] : enabled[enabled.length - 1]);
  };

  focusTab(tab?: TabPane) {
    if (!tab) return;
    this.focusedTab = tab;
    if (this.activation === 'automatic') {
      this.tabSelected(tab);
    }
    this.focusTabElement(tab);
  }

  handleTabKeydown = (tab: TabPane, event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        this.moveFocus(1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.moveFocus(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.focusEdge('first');
        break;
      case 'End':
        event.preventDefault();
        this.focusEdge('last');
        break;
      case 'Enter':
      case ' ':
        if (this.activation === 'manual') {
          event.preventDefault();
          this.tabSelected(tab);
        }
        break;
      case 'Delete':
        if (this.args.dismissable) {
          event.preventDefault();
          this.closeTab(tab);
        }
        break;
      default:
        break;
    }
  };

  <template>
    {{#if @loading}}
      <div>
        <div
          class="cds--tabs cds--skeleton
            {{if @contained 'cds--tabs--contained'}}"
        >
          <ul class="cds--tabs__nav">
            <li class="cds--tabs__nav-item">
              <div class="cds--tabs__nav-link">
                <span></span>
              </div>
            </li>
            <li class="cds--tabs__nav-item">
              <div class="cds--tabs__nav-link">
                <span></span>
              </div>
            </li>
            <li class="cds--tabs__nav-item">
              <div class="cds--tabs__nav-link">
                <span></span>
              </div>
            </li>
            <li class="cds--tabs__nav-item">
              <div class="cds--tabs__nav-link">
                <span></span>
              </div>
            </li>
            <li class="cds--tabs__nav-item">
              <div class="cds--tabs__nav-link">
                <span></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    {{else}}
      <div
        class="cds--tabs
          {{if @contained 'cds--tabs--contained'}}
          {{if this.showFullWidthClass 'cds--tabs--full-width'}}
          {{if @dismissable 'cds--tabs--dismissable'}}
          {{if this.showSizeClass (concat 'cds--layout--size-' @size)}}
          {{if this.hasSecondaryLabelTabs 'cds--tabs--tall'}}"
      >
        <button
          {{on "click" this.scrollLeft}}
          aria-hidden="true"
          tabindex="-1"
          aria-label="Scroll left"
          class="cds--tab--overflow-nav-button cds--tab--overflow-nav-button--previous
            {{unless
              this.showScrollLeft
              'cds--tab--overflow-nav-button--hidden'
            }}"
          type="button"
        >
          <svg
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M5 8 10 3 10.7 3.7 6.4 8 10.7 12.3 10 13z"></path>
          </svg>
        </button>
        <div
          aria-label="{{if @ariaLabel @ariaLabel 'List of tabs'}}"
          role="tablist"
          class="cds--tab--list"
          {{this.registerTabsDiv}}
          {{didResize this.onResize}}
          {{on "scroll" this.onScroll}}
        >
          {{#each this.tabs as |tab index|}}
            <button
              aria-controls="{{this.guid}}-tabpanel-{{index}}"
              aria-selected="{{if tab.isSelected 'true' 'false'}}"
              aria-disabled="{{if (this.isTabDisabled tab) 'true'}}"
              disabled={{this.isTabDisabled tab}}
              id="{{this.guid}}-tab-{{index}}"
              role="tab"
              class="cds--tabs__nav-item cds--tabs__nav-link
                {{if tab.isSelected 'cds--tabs__nav-item--selected'}}
                {{if (this.isTabDisabled tab) 'cds--tabs__nav-item--disabled'}}"
              tabindex="{{if tab.isFocusable '0' '-1'}}"
              type="button"
              {{on "click" (fn this.tabSelected tab)}}
              {{on "keydown" (fn this.handleTabKeydown tab)}}
            >
              <div class="cds--tabs__nav-item-label-wrapper">
                {{#if (and @dismissable tab.args.renderIcon)}}
                  <div class="cds--tabs__nav-item--icon-left">
                    {{#let tab.args.renderIcon as |RenderIcon|}}
                      <RenderIcon
                        @size="16"
                        @svgClass="cds--tabs__nav-item-icon-svg"
                      />
                    {{/let}}
                  </div>
                {{/if}}
                <span class="cds--tabs__nav-item-label" dir="auto">
                  {{tab.args.title}}
                </span>
                {{#if (and (not @dismissable) tab.args.renderIcon)}}
                  <div class="cds--tabs__nav-item--icon">
                    {{#let tab.args.renderIcon as |RenderIcon|}}
                      <RenderIcon
                        @size="16"
                        @svgClass="cds--tabs__nav-item-icon-svg"
                      />
                    {{/let}}
                  </div>
                {{/if}}
              </div>
              {{#if (and @contained tab.args.secondaryLabel)}}
                <div
                  class="cds--tabs__nav-item-secondary-label"
                  title={{tab.args.secondaryLabel}}
                  dir="auto"
                >
                  {{tab.args.secondaryLabel}}
                </div>
              {{/if}}
            </button>
            {{! A sibling of the tab button above, not a descendant: nesting a close button inside role=tab would be invalid HTML and break roving tabindex. Rendered after every tab even when not dismissable, visually hidden, matching @carbon/react - Carbon's own tab CSS relies on it being there (e.g. its contained-tabs selected + div + nav-item separator rule). }}
            <div
              class={{if
                @dismissable
                "cds--tabs__nav-item--close"
                "cds--tabs__nav-item--close--hidden"
              }}
            >
              {{! The close button sits in the tablist, as in Carbon React; it is
                aria-hidden and tabindex -1, so assistive tech and the tab order
                only see the tabs. }}
              {{! eslint-disable-next-line ember/template-no-nested-interactive }}
              <button
                title="Remove {{tab.args.title}} tab"
                aria-hidden={{if
                  (and tab.isSelected @dismissable)
                  "false"
                  "true"
                }}
                aria-disabled="{{if (this.isTabDisabled tab) 'true'}}"
                class="{{if
                    @dismissable
                    'cds--tabs__nav-item--close-icon'
                    'cds--visually-hidden'
                  }}
                  {{if
                    tab.isSelected
                    'cds--tabs__nav-item--close-icon--selected'
                  }}
                  {{if
                    (this.isTabDisabled tab)
                    'cds--tabs__nav-item--close-icon--disabled'
                  }}"
                disabled={{this.isTabDisabled tab}}
                tabindex="-1"
                type="button"
                {{on "click" (fn this.closeTab tab)}}
              >
                <svg
                  focusable="false"
                  preserveAspectRatio="xMidYMid meet"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  width="16"
                  height="16"
                  viewBox="0 0 32 32"
                  aria-hidden={{if
                    (and tab.isSelected @dismissable)
                    "false"
                    "true"
                  }}
                  aria-label="Press delete to remove {{tab.args.title}} tab"
                  role="img"
                >
                  <path
                    d="M17.4141 16 24 9.4141 22.5859 8 16 14.5859 9.4143 8 8 9.4141 14.5859 16 8 22.5859 9.4143 24 16 17.4141 22.5859 24 24 22.5859 17.4141 16z"
                  ></path>
                </svg>
              </button>
            </div>
          {{/each}}
        </div>
        <button
          {{on "click" this.scrollRight}}
          aria-hidden="true"
          tabindex="-1"
          aria-label="Scroll right"
          class="cds--tab--overflow-nav-button cds--tab--overflow-nav-button--next
            {{unless
              this.showScrollRight
              'cds--tab--overflow-nav-button--hidden'
            }}"
          type="button"
        >
          <svg
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M11 8 6 13 5.3 12.3 9.6 8 5.3 3.7 6 3z"></path>
          </svg>
        </button>
      </div>
      {{yield (component TabPane tab=this)}}
    {{/if}}
  </template>
}
