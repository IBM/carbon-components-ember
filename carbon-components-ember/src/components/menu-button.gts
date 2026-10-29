/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import { flip, size } from '@floating-ui/dom';
import Button from './button.gts';
import Menu from './menu.gts';
import ChevronDown from './icons/chevron-down.ts';
import { float } from '../utils/floating.ts';

import type { Middleware } from '@floating-ui/dom';
import type { MenuSignature } from './menu.gts';

export interface MenuButtonSignature {
  Element: HTMLDivElement;
  Args: {
    /** The button's text, and the menu's accessible name. */
    label: string;
    /** Defaults to `primary`. */
    kind?: 'primary' | 'tertiary' | 'ghost';
    /** Defaults to `lg`. */
    size?: MenuSignature['Args']['size'];
    disabled?: boolean;
    /** Where the menu opens against the button. Defaults to `bottom`. */
    menuAlignment?:
      | 'top'
      | 'top-start'
      | 'top-end'
      | 'bottom'
      | 'bottom-start'
      | 'bottom-end';
    /** The menu's background token. Defaults to `layer`. */
    menuBackgroundToken?: MenuSignature['Args']['backgroundToken'];
    /** Draws a border around the menu. */
    menuBorder?: boolean;
    /** The element the menu renders in, as Menu's `@target`. */
    menuTarget?: MenuSignature['Args']['target'];
    /** The button's `tabindex`. Defaults to 0. */
    tabIndex?: number;
  };
  Blocks: {
    /** The menu's items, as Menu yields them. */
    default: MenuSignature['Blocks']['default'];
  };
}

const preventDefault = (event: Event) => event.preventDefault();

/**
 * A button that opens a menu of actions, as Carbon React's MenuButton.
 */
export default class MenuButton extends Component<MenuButtonSignature> {
  @tracked open = false;

  id = guidFor(this);
  trigger?: HTMLElement;

  get alignment() {
    return this.args.menuAlignment ?? 'bottom';
  }

  get size() {
    return this.args.size ?? 'lg';
  }

  get tabIndex() {
    return this.args.tabIndex ?? 0;
  }

  toggle = () => {
    this.open = !this.open;
  };

  close = () => {
    this.open = false;
  };

  captureTrigger = modifier((element: HTMLElement) => {
    this.trigger = element;
    return () => {
      if (this.trigger === element) this.trigger = undefined;
    };
  });

  // Carbon React's MenuButton positions its Menu with Floating UI, the menu
  // as wide as the button when it opens above or below it.
  position = modifier((menu: HTMLElement) => {
    const trigger = this.trigger;
    if (!trigger) return;
    const alignment = this.alignment;
    const middleware: Middleware[] = [flip({ crossAxis: false })];
    if (alignment === 'bottom' || alignment === 'top') {
      middleware.push(
        size({
          apply({ rects, elements }) {
            elements.floating.style.width = `${rects.reference.width}px`;
          },
        }),
      );
    }
    const teardown = float(trigger, menu, { placement: alignment, middleware });
    return () => {
      teardown();
      menu.style.removeProperty('width');
    };
  });

  <template>
    <div
      class="cds--menu-button__container"
      ...attributes
      aria-owns={{if this.open this.id}}
    >
      <Button
        class="cds--menu-button__trigger
          {{if this.open 'cds--menu-button__trigger--open'}}"
        @size={{this.size}}
        @kind={{if @kind @kind "primary"}}
        @renderIcon={{ChevronDown}}
        @disabled={{@disabled}}
        {{! Forwards @tabIndex, as Carbon React's tabIndex prop does. }}
        {{! eslint-disable-next-line ember/template-no-positive-tabindex }}
        tabindex={{this.tabIndex}}
        aria-haspopup="true"
        aria-expanded={{if this.open "true" "false"}}
        aria-controls={{if this.open this.id}}
        {{this.captureTrigger}}
        {{on "click" this.toggle}}
        {{! As in Carbon React: pressing the button leaves focus where it is. }}
        {{! eslint-disable-next-line ember/template-no-pointer-down-event-binding }}
        {{on "mousedown" preventDefault}}
      >{{@label}}</Button>
      <Menu
        id={{this.id}}
        class="cds--menu-button__{{this.alignment}}"
        @menuAlignment={{this.alignment}}
        @legacyAutoalign={{false}}
        @label={{@label}}
        @size={{this.size}}
        @open={{this.open}}
        @onClose={{this.close}}
        @target={{@menuTarget}}
        @backgroundToken={{@menuBackgroundToken}}
        @border={{@menuBorder}}
        {{this.position}}
        as |MenuItem MenuItemSelectable MenuItemRadioGroup|
      >
        {{yield MenuItem MenuItemSelectable MenuItemRadioGroup}}
      </Menu>
    </div>
  </template>
}
