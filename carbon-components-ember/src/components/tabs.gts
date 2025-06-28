import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import eq from 'ember-truth-helpers/helpers/eq';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { registerDestructor } from '@ember/destroyable';
import type { WithBoundArgs } from '@glint/template';
import { action } from '@ember/object';
import or from '../helpers/or.ts';
import didResize from 'ember-resize-modifier/modifiers/did-resize';
import { A, type NativeArray } from '@ember/array';
import { runTask } from 'ember-lifeline';

export type Args = {
  selectedTab?: string;
  tabSelected?: (tab: string) => void;
  loading?: boolean;
  contained?: boolean;
  disabled?: boolean;
};

class TabPane extends Component<{
  Args: {
    tab: TabsComponent;
    title: string;
    disabled?: boolean;
    isDefault?: boolean;
  };
  Blocks: {
    default: [];
  };
}> {
  get index() {
    return this.args.tab.tabs.findIndex((t) => t === this);
  }

  get isSelected(): boolean {
    return this.args.tab.selectedTab === this;
  }

  constructor(owner: any, args: any) {
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
        tabindex='{{this.index}}'
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
  @tracked open: boolean = false;
  @tracked resized: number = 1;
  @tracked scrolled: number = 1;
  @tracked currentTab?: TabPane;
  @tracked tabsDivElement?: HTMLDivElement;
  @tracked tabs: NativeArray<TabPane> = A([]);

  get guid() {
    return guidFor(this);
  }

  registerTab(tab: TabPane) {
    this.tabs.pushObject(tab);
    if (tab.args.isDefault && !this.currentTab) {
      this.tabSelected(tab);
    }
  }

  unregisterTab(tab: TabPane) {
    this.tabs.removeObject(tab);
  }

  get selectedTab() {
    if (this.args.selectedTab) {
      return this.tabs.find((t) => t.args.title === this.args.selectedTab);
    }
    return this.currentTab;
  }

  @action
  tabSelected(tab: TabPane) {
    this.currentTab = tab;
    this.args.tabSelected?.(tab.args.title);
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

  @action
  registerTabsDiv(element: HTMLDivElement) {
    this.tabsDivElement = element;
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

  <template>
    {{#if @loading}}
      <div style='max-width: 100%;'>
        <div class='cds--tabs cds--skeleton'>
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
      <div class='cds--tabs {{if @contained "cds--tabs--contained"}}'>
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
          aria-label='List of tabs'
          role='tablist'
          class='cds--tab--list'
          {{didInsert this.registerTabsDiv}}
          {{didResize this.onResize}}
          {{on 'scroll' this.onScroll}}
        >
          {{#each this.tabs as |tab index|}}
            <button
              aria-controls='{{this.guid}}-tabpanel-{{index}}'
              aria-selected='{{if (eq @selectedTab tab.args.title) "true"}}'
              id='{{this.guid}}-tab-{{index}}'
              role='tab'
              class='cds--tabs__nav-item cds--tabs__nav-link
                {{if tab.isSelected "cds--tabs__nav-item--selected"}}
                {{if
                  (or @disabled tab.args.disabled)
                  "cds--tabs__nav-item--disabled"
                }}'
              tabindex='{{index}}'
              type='button'
              {{on 'click' (fn this.tabSelected tab)}}
            >
              <span class='cds--tabs__nav-item-label'>
                {{tab.args.title}}
              </span>
            </button>
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
