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
import Button from '../button.gts';
import Menu from '../menu.gts';
import ChevronDown from '../icons/chevron-down.ts';
import type { MenuSignature } from '../menu.gts';

export interface PageHeaderMenuButtonSignature {
  Element: HTMLDivElement;
  Args: {
    label: string;
  };
  Blocks: {
    default: MenuSignature['Blocks']['default'];
  };
}

const preventDefault = (event: Event) => event.preventDefault();

// Carbon React's MenuButton at its `md` size, opening its menu below the
// button, which is as much of it as a PageHeader's page actions use.
export default class PageHeaderMenuButton extends Component<PageHeaderMenuButtonSignature> {
  @tracked open = false;

  id = guidFor(this);
  trigger?: HTMLElement;

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

  // Read when the menu opens: where the button is then.
  get x(): [number, number] {
    const rect = this.trigger?.getBoundingClientRect();
    return [rect?.left ?? 0, rect?.right ?? 0];
  }

  get y(): [number, number] {
    const rect = this.trigger?.getBoundingClientRect();
    return [rect?.top ?? 0, rect?.bottom ?? 0];
  }

  <template>
    <div
      class="cds--menu-button__container"
      aria-owns={{if this.open this.id}}
      ...attributes
    >
      <Button
        class="cds--menu-button__trigger
          {{if this.open 'cds--menu-button__trigger--open'}}"
        @size="md"
        @kind="primary"
        @renderIcon={{ChevronDown}}
        tabindex="0"
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
        class="cds--menu-button__bottom-end"
        @menuAlignment="bottom-end"
        @label={{@label}}
        @size="md"
        @open={{this.open}}
        @onClose={{this.close}}
        @x={{this.x}}
        @y={{this.y}}
        as |MenuItem MenuItemSelectable MenuItemRadioGroup|
      >
        {{yield MenuItem MenuItemSelectable MenuItemRadioGroup}}
      </Menu>
    </div>
  </template>
}
