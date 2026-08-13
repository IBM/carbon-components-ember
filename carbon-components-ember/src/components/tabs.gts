import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import and from 'ember-truth-helpers/helpers/and';
import { fn, concat } from '@ember/helper';
import { on } from '@ember/modifier';
import { registerDestructor } from '@ember/destroyable';
import type { WithBoundArgs } from '@glint/template';
import { action } from '@ember/object';
import type Owner from '@ember/owner';
import type Icon from './icon.gts';
import didResize from 'ember-resize-modifier/modifiers/did-resize';
import { modifier as eModifier } from 'ember-modifier';
import { runTask } from 'ember-lifeline';

export type Args = {
  selectedTab?: string;
  tabSelected?: (tab: string) => void;
  loading?: boolean;
  contained?: boolean;
  disabled?: boolean;
  /**
   * Size of the tabs. `sm`/`md`/`lg` apply to line tabs, `xl` is only
   * meaningful when `@contained` is also set.
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
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

export interface TabPaneArgs {
  tab: TabsComponent;
  title: string;
  disabled?: boolean;
  isDefault?: boolean;
  /** Icon rendered alongside the tab label, e.g. from `carbon-components-ember/icons`. */
  renderIcon?: typeof Icon;
  /** Subtitle rendered under the label. Only shown when the parent `Tabs` is `@contained`. */
  secondaryLabel?: string;
}

export interface TabPaneSignature {
  Args: TabPaneArgs;
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
    {{#if this.isSelected}}
      <div
        class='cds--tab-content'
        aria-labelledby='{{@tab.guid}}-tab-{{this.index}}'
        id='{{@tab.guid}}-tabpanel-{{this.index}}'
        tabindex='0'
        role='tabpanel'
      >
        {{yield}}
      </div>
    {{/if}}
  </template>
}

export interface TabsComponentSignature {
  Args: Args;
  Element: HTMLDivElement;
  Blocks: {
    default: [WithBoundArgs<typeof TabPane, 'tab'>];
  };
}

export default class TabsComponent extends Component<TabsComponentSignature> {
  @tracked resized: number = 1;
  @tracked scrolled: number = 1;
  @tracked currentTab?: TabPane;
  @tracked focusedTab?: TabPane;
  @tracked tabsDivElement?: HTMLDivElement;
  @tracked tabs: TabPane[] = [];

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
    return this.currentTab;
  }

  get focusableTab(): TabPane | undefined {
    return this.focusedTab ?? this.selectedTab ?? this.tabs[0];
  }

  @action
  isTabDisabled(tab: TabPane) {
    return !!(this.args.disabled || tab.args.disabled);
  }

  get enabledTabs() {
    return this.tabs.filter((t) => !this.isTabDisabled(t));
  }

  get activation() {
    return this.args.activation ?? 'automatic';
  }

  @action
  tabSelected(tab: TabPane) {
    if (this.isTabDisabled(tab)) return;
    this.currentTab = tab;
    this.focusedTab = tab;
    this.args.tabSelected?.(tab.args.title);
  }

  @action
  closeTab(tab: TabPane, event?: Event) {
    event?.stopPropagation();
    this.args.onTabCloseRequest?.(tab.args.title);
  }

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
    const element = this.tabsDivElement?.querySelector<HTMLElement>(
      `[data-tab-index="${index}"]`,
    );
    element?.focus();
  }

  @action
  scrollRight() {
    this.tabsDivElement?.scrollBy({
      left: 100,
    });
  }

  @action
  scrollLeft() {
    this.tabsDivElement?.scrollBy({
      left: -100,
    });
  }

  @action
  onResize() {
    this.resized++;
  }

  @action
  onScroll() {
    this.scrolled++;
  }

  @action
  moveFocus(direction: 1 | -1) {
    const enabled = this.enabledTabs;
    if (!enabled.length) return;
    const current = this.focusableTab;
    const currentIndex = current ? enabled.indexOf(current) : -1;
    const nextIndex =
      currentIndex === -1
        ? 0
        : (currentIndex + direction + enabled.length) % enabled.length;
    this.focusTab(enabled[nextIndex]);
  }

  @action
  focusEdge(edge: 'first' | 'last') {
    const enabled = this.enabledTabs;
    if (!enabled.length) return;
    this.focusTab(edge === 'first' ? enabled[0] : enabled[enabled.length - 1]);
  }

  focusTab(tab?: TabPane) {
    if (!tab) return;
    this.focusedTab = tab;
    if (this.activation === 'automatic') {
      this.tabSelected(tab);
    }
    this.focusTabElement(tab);
  }

  @action
  handleTabKeydown(tab: TabPane, event: KeyboardEvent) {
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
  }

  <template>
    {{#if @loading}}
      <div style='max-width: 100%;'>
        <div
          class='cds--tabs cds--skeleton {{if @contained "cds--tabs--contained"}}'
        >
          <ul class='cds--tabs__nav'>
            <li class='cds--tabs__nav-item'>
              <div class='cds--tabs__nav-link'>
                <span></span>
              </div>
            </li>
            <li class='cds--tabs__nav-item'>
              <div class='cds--tabs__nav-link'>
                <span></span>
              </div>
            </li>
            <li class='cds--tabs__nav-item'>
              <div class='cds--tabs__nav-link'>
                <span></span>
              </div>
            </li>
            <li class='cds--tabs__nav-item'>
              <div class='cds--tabs__nav-link'>
                <span></span>
              </div>
            </li>
            <li class='cds--tabs__nav-item'>
              <div class='cds--tabs__nav-link'>
                <span></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    {{else}}
      <div
        class='cds--tabs
          {{if @contained "cds--tabs--contained"}}
          {{if @fullWidth "cds--tabs--full-width"}}
          {{if @dismissable "cds--tabs--dismissable"}}
          {{if @size (concat "cds--layout--size-" @size)}}'
      >
        <button
          {{on 'click' this.scrollLeft}}
          aria-hidden='true'
          aria-label='Scroll left'
          class='cds--tab--overflow-nav-button cds--tab--overflow-nav-button--previous
            {{unless
              this.showScrollLeft
              "cds--tab--overflow-nav-button--hidden"
            }}'
          type='button'
        >
          <svg
            focusable='false'
            preserveAspectRatio='xMidYMid meet'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            width='16'
            height='16'
            viewBox='0 0 16 16'
            aria-hidden='true'
          >
            <path d='M5 8L10 3 10.7 3.7 6.4 8 10.7 12.3 10 13z'></path>
          </svg>
        </button>
        <div
          aria-label='{{if @ariaLabel @ariaLabel "List of tabs"}}'
          role='tablist'
          class='cds--tab--list'
          {{this.registerTabsDiv}}
          {{didResize this.onResize}}
          {{on 'scroll' this.onScroll}}
        >
          {{#each this.tabs as |tab index|}}
            {{#if @dismissable}}
              {{! template-lint-disable require-presentational-children }}
              <button
                aria-controls='{{this.guid}}-tabpanel-{{index}}'
                aria-selected='{{if tab.isSelected "true" "false"}}'
                aria-disabled='{{if (this.isTabDisabled tab) "true"}}'
                id='{{this.guid}}-tab-{{index}}'
                role='tab'
                data-tab-index={{index}}
                class='cds--tabs__nav-item cds--tabs__nav-link
                  {{if tab.isSelected "cds--tabs__nav-item--selected"}}
                  {{if
                    (this.isTabDisabled tab)
                    "cds--tabs__nav-item--disabled"
                  }}'
                tabindex='{{if tab.isFocusable "0" "-1"}}'
                type='button'
                {{on 'click' (fn this.tabSelected tab)}}
                {{on 'keydown' (fn this.handleTabKeydown tab)}}
              >
                <div class='cds--tabs__nav-item-label-wrapper'>
                  {{#if tab.args.renderIcon}}
                    <div class='cds--tabs__nav-item--icon-left'>
                      {{#let tab.args.renderIcon as |RenderIcon|}}
                        <RenderIcon
                          @size='16'
                          @svgClass='cds--tabs__nav-item-icon-svg'
                        />
                      {{/let}}
                    </div>
                  {{/if}}
                  <span class='cds--tabs__nav-item-label'>
                    {{tab.args.title}}
                  </span>
                </div>
                {{#if (and @contained tab.args.secondaryLabel)}}
                  <div
                    class='cds--tabs__nav-item-secondary-label'
                    title={{tab.args.secondaryLabel}}
                  >
                    {{tab.args.secondaryLabel}}
                  </div>
                {{/if}}
              </button>
              {{! A sibling of the tab button above, not a descendant: nesting a close button inside role=tab would be invalid HTML and break roving tabindex. }}
              <div class='cds--tabs__nav-item--close'>
                <button
                  aria-label='Close {{tab.args.title}} tab'
                  class='cds--tabs__nav-item--close-icon'
                  tabindex='-1'
                  type='button'
                  {{on 'click' (fn this.closeTab tab)}}
                >
                  <svg
                    focusable='false'
                    preserveAspectRatio='xMidYMid meet'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    width='16'
                    height='16'
                    viewBox='0 0 32 32'
                    aria-hidden='true'
                  >
                    <path
                      d='M17.4141 16 24 9.4141 22.5859 8 16 14.5859 9.4143 8 8 9.4141 14.5859 16 8 22.5859 9.4143 24 16 17.4141 22.5859 24 24 22.5859 17.4141 16z'
                    ></path>
                  </svg>
                </button>
              </div>
            {{else}}
              {{! template-lint-disable require-presentational-children }}
              <button
                aria-controls='{{this.guid}}-tabpanel-{{index}}'
                aria-selected='{{if tab.isSelected "true" "false"}}'
                aria-disabled='{{if (this.isTabDisabled tab) "true"}}'
                id='{{this.guid}}-tab-{{index}}'
                role='tab'
                data-tab-index={{index}}
                class='cds--tabs__nav-item cds--tabs__nav-link
                  {{if tab.isSelected "cds--tabs__nav-item--selected"}}
                  {{if
                    (this.isTabDisabled tab)
                    "cds--tabs__nav-item--disabled"
                  }}'
                tabindex='{{if tab.isFocusable "0" "-1"}}'
                type='button'
                {{on 'click' (fn this.tabSelected tab)}}
                {{on 'keydown' (fn this.handleTabKeydown tab)}}
              >
                <div class='cds--tabs__nav-item-label-wrapper'>
                  <span class='cds--tabs__nav-item-label'>
                    {{tab.args.title}}
                  </span>
                  {{#if tab.args.renderIcon}}
                    <div class='cds--tabs__nav-item--icon'>
                      {{#let tab.args.renderIcon as |RenderIcon|}}
                        <RenderIcon
                          @size='16'
                          @svgClass='cds--tabs__nav-item-icon-svg'
                        />
                      {{/let}}
                    </div>
                  {{/if}}
                </div>
                {{#if (and @contained tab.args.secondaryLabel)}}
                  <div
                    class='cds--tabs__nav-item-secondary-label'
                    title={{tab.args.secondaryLabel}}
                  >
                    {{tab.args.secondaryLabel}}
                  </div>
                {{/if}}
              </button>
            {{/if}}
          {{/each}}
        </div>
        <button
          {{on 'click' this.scrollRight}}
          aria-hidden='true'
          aria-label='Scroll right'
          class='cds--tab--overflow-nav-button cds--tab--overflow-nav-button--next
            {{unless
              this.showScrollRight
              "cds--tab--overflow-nav-button--hidden"
            }}'
          type='button'
        >
          <svg
            focusable='false'
            preserveAspectRatio='xMidYMid meet'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            width='16'
            height='16'
            viewBox='0 0 16 16'
            aria-hidden='true'
          >
            <path d='M11 8L6 13 5.3 12.3 9.6 8 5.3 3.7 6 3z'></path>
          </svg>
        </button>
      </div>
      {{yield (component TabPane tab=this)}}
    {{/if}}
  </template>
}
