/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { WithBoundArgs } from '@glint/template';
import { modifier } from 'ember-modifier';
import Switcher from './switcher.gts';

export interface HeaderPanelSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * Closes it when focus leaves it or on Escape, calling
     * `@onHeaderPanelFocus`. Defaults to `true`.
     */
    addFocusListeners?: boolean;
    /** Whether it's open. Without it, it closes itself. */
    expanded?: boolean;
    /** Where Escape sends the page, such as the `#id` of its button. */
    href?: string;
    /**
     * Called when it closes itself: on Escape, when focus leaves it, or, for
     * a `Switcher`, on a click outside it. Set `@expanded` to `false` here.
     */
    onHeaderPanelFocus?: () => void;
  };
  Blocks: {
    default: [Switcher: WithBoundArgs<typeof Switcher, 'panel'>];
  };
}

/**
 * A panel the `Header` opens from a `HeaderGlobalAction`, such as the app
 * `Switcher` it yields.
 */
export default class HeaderPanel extends Component<HeaderPanelSignature> {
  #controlled = this.args.expanded !== undefined;
  // Without @expanded, it starts closed, as React's state does.
  @tracked expandedState = false;
  hasSwitcher = false;
  #lastClicked: Element | null = null;

  get isExpanded() {
    return this.#controlled ? this.args.expanded : this.expandedState;
  }

  close = () => {
    this.expandedState = false;
    this.args.onHeaderPanelFocus?.();
  };

  closeOnBlur = (event: FocusEvent) => {
    if (this.args.addFocusListeners === false) return;
    const panel = event.currentTarget as HTMLElement;
    if (
      panel.contains(event.relatedTarget as Node | null) ||
      this.#lastClicked?.classList.contains('cds--switcher__item-link')
    ) {
      return;
    }
    this.expandedState = false;
    this.#lastClicked = null;
    if (this.args.expanded) this.args.onHeaderPanelFocus?.();
  };

  closeOnEscape = (event: KeyboardEvent) => {
    if (this.args.addFocusListeners === false || event.key !== 'Escape') {
      return;
    }
    this.close();
    if (this.args.href) window.location.href = this.args.href;
  };

  // A panel holding a Switcher closes on a click outside it and the header's
  // actions.
  closeOnOutsideClick = modifier((panel: HTMLElement) => {
    const listener = (event: MouseEvent) => {
      const { target } = event;
      if (!(target instanceof Element)) return;
      this.#lastClicked = target;
      if (
        this.hasSwitcher &&
        this.args.expanded &&
        !target.closest('.cds--header-panel--expanded') &&
        !target.closest('.cds--header__action') &&
        !panel.classList.contains('cds--switcher')
      ) {
        this.close();
      }
    };
    window.addEventListener('click', listener);
    return () => window.removeEventListener('click', listener);
  });

  <template>
    {{! eslint-disable-next-line ember/template-no-invalid-interactive -- as in Carbon React, the panel closes on Escape and when focus leaves it ~}}
    <div
      ...attributes
      class="cds--header-panel
        {{if this.isExpanded 'cds--header-panel--expanded'}}"
      {{on "focusout" this.closeOnBlur}}
      {{on "keydown" this.closeOnEscape}}
      {{this.closeOnOutsideClick}}
    >
      {{~yield (component Switcher panel=this)~}}
    </div>
  </template>
}
