/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';
import type Owner from '@ember/owner';
import { modifier } from 'ember-modifier';
import captureElement from '../../modifiers/capture-element.ts';
import { afterRender } from '../../utils/after-render.ts';
import type { IconComponent } from '../icon.gts';
import type Tabs from '../tabs.gts';
import type TabList from './tab-list.gts';

export interface TabSignature {
  Element: HTMLButtonElement;
  Args: {
    tabs: Tabs;
    list: TabList;
    /** Whether the tab can't be selected. */
    disabled?: boolean;
    /** A component used to render an icon, e.g. from `carbon-components-ember/icons`. */
    renderIcon?: IconComponent;
    /** A label under the tab's own. Shown only in a `@contained` `TabList`. */
    secondaryLabel?: string;
  };
  Blocks: {
    default: [];
  };
}

export default class Tab extends Component<TabSignature> {
  element?: HTMLElement;
  closing = false;
  @tracked label = '';
  @tracked ignoreHover = false;

  constructor(owner: Owner, args: TabSignature['Args']) {
    super(owner, args);
    // Tabs has read its tabs during this render; register after it.
    afterRender(this, () => {
      args.tabs.registerTab(this);
      registerDestructor(this, () => args.tabs.unregisterTab(this));
    });
  }

  get index() {
    return this.args.tabs.tabs.indexOf(this);
  }

  get isSelected() {
    return this.index === this.args.tabs.selectedIndex;
  }

  get isTabStop() {
    return this.args.tabs.tabStop === this;
  }

  setElement = (element: HTMLElement) => {
    this.element = element;
  };

  // The close button names the tab by its label, as React does from a string child.
  readLabel = modifier((element: HTMLElement) => {
    const label = element.textContent?.trim() ?? '';
    return afterRender(this, () => {
      this.label = label;
    });
  });

  select = () => {
    if (this.args.disabled || this.index < 0) return;
    this.args.tabs.setSelectedIndex(this.index);
  };

  close = (event: Event) => {
    event.stopPropagation();
    const { tabs, disabled } = this.args;
    if (!tabs.args.dismissable || disabled) return;
    this.closing = true;
    tabs.args.onTabCloseRequest?.(this.index);
  };

  handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Delete' && this.args.tabs.args.dismissable) {
      this.close(event);
    }
  };

  // A dismissable contained tab doesn't highlight while its close button is hovered.
  hoverCloseButton = (event: Event) => {
    if (!this.args.list.args.contained) return;
    event.stopPropagation();
    this.ignoreHover = true;
  };

  leaveCloseButton = () => {
    if (this.args.list.args.contained) this.ignoreHover = false;
  };

  <template>
    <button
      ...attributes
      aria-controls="{{@tabs.baseId}}-tabpanel-{{this.index}}"
      aria-selected="{{if this.isSelected 'true' 'false'}}"
      aria-disabled={{if @disabled "true"}}
      disabled={{@disabled}}
      id="{{@tabs.baseId}}-tab-{{this.index}}"
      role="tab"
      class="cds--tabs__nav-item cds--tabs__nav-link
        {{if this.isSelected 'cds--tabs__nav-item--selected'}}
        {{if @disabled 'cds--tabs__nav-item--disabled'}}
        {{if this.ignoreHover 'cds--tabs__nav-item--hover-off'}}"
      tabindex={{if this.isTabStop "0" "-1"}}
      type="button"
      {{captureElement this.setElement}}
      {{@list.rovingFocus.item disabled=@disabled}}
      {{on "click" this.select}}
      {{on "keydown" this.handleKeydown}}
    >
      <div class="cds--tabs__nav-item-label-wrapper">
        {{#if (and @tabs.args.dismissable @renderIcon)}}
          <div class="cds--tabs__nav-item--icon-left">
            <@renderIcon @size="16" />
          </div>
        {{/if}}
        <span class="cds--tabs__nav-item-label" dir="auto" {{this.readLabel}}>
          {{yield}}
        </span>
        {{#if (and (not @tabs.args.dismissable) @renderIcon)}}
          <div class="cds--tabs__nav-item--icon">
            <@renderIcon @size="16" />
          </div>
        {{/if}}
      </div>
      {{#if (and @list.hasSecondaryLabelTabs @secondaryLabel)}}
        <div
          class="cds--tabs__nav-item-secondary-label"
          title={{@secondaryLabel}}
          dir="auto"
        >
          {{@secondaryLabel}}
        </div>
      {{/if}}
    </button>
    {{! A sibling of the tab, not inside it: a button in a tab would be invalid. Rendered for every tab even when not dismissable, visually hidden, as Carbon React does: Carbon's tab CSS selects it (the contained selected tab's separator). }}
    <div
      class={{if
        @tabs.args.dismissable
        "cds--tabs__nav-item--close"
        "cds--tabs__nav-item--close--hidden"
      }}
    >
      {{! It is aria-hidden and tabindex -1, so assistive tech and the tab order only see the tabs. }}
      <button
        title="Remove {{this.label}} tab"
        aria-hidden={{if
          (and this.isSelected @tabs.args.dismissable)
          "false"
          "true"
        }}
        aria-disabled={{if @disabled "true"}}
        class="{{if
            @tabs.args.dismissable
            'cds--tabs__nav-item--close-icon'
            'cds--visually-hidden'
          }}
          {{if this.isSelected 'cds--tabs__nav-item--close-icon--selected'}}
          {{if @disabled 'cds--tabs__nav-item--close-icon--disabled'}}"
        disabled={{@disabled}}
        tabindex="-1"
        type="button"
        {{on "click" this.close}}
        {{on "mouseover" this.hoverCloseButton}}
        {{on "mouseleave" this.leaveCloseButton}}
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
            (and this.isSelected @tabs.args.dismissable)
            "false"
            "true"
          }}
          aria-label="Press delete to remove {{this.label}} tab"
          role="img"
        >
          <path
            d="M17.4141 16 24 9.4141 22.5859 8 16 14.5859 9.4143 8 8 9.4141 14.5859 16 8 22.5859 9.4143 24 16 17.4141 22.5859 24 24 22.5859 17.4141 16z"
          ></path>
        </svg>
      </button>
    </div>
  </template>
}
