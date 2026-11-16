/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { getOwner } from '@ember/owner';
import type Owner from '@ember/owner';
import Link from './-link.gts';
import type { LinkSignature } from './-link.gts';
import captureElement from '../../modifiers/capture-element.ts';
import { isCurrentRoute } from '../-private/router-link.gts';
import type Switcher from './switcher.gts';

export interface SwitcherItemSignature {
  Element: LinkSignature['Element'];
  Args: Omit<LinkSignature['Args'], 'as'> & {
    /**
     * Classes for the `<li>`, as Carbon React's `className`. `class` and the
     * other attributes go on the link.
     */
    className?: string;
    /** Marks the current product, as does a link to the current route. */
    isSelected?: boolean;
    switcher?: Switcher;
  };
  Blocks: {
    default: [];
  };
}

/** A product in the `Switcher`. Name it with `aria-label`. */
export default class SwitcherItem extends Component<SwitcherItemSignature> {
  element?: HTMLElement;

  constructor(owner: Owner, args: SwitcherItemSignature['Args']) {
    super(owner, args);
    args.switcher?.registerItem(this);
  }

  get isSelected() {
    return (
      Boolean(this.args.isSelected) ||
      isCurrentRoute(getOwner(this)!, this.args)
    );
  }

  setElement = (element: HTMLElement) => {
    this.element = element;
  };

  moveFocus = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    this.args.switcher?.focusNext(this, event.key);
  };

  <template>
    <li class="cds--switcher__item {{@className}}">
      <Link
        @href={{@href}}
        @route={{@route}}
        @externalRoute={{@externalRoute}}
        @models={{@models}}
        @query={{@query}}
        tabindex={{if @switcher.args.expanded "0" "-1"}}
        ...attributes
        class="cds--switcher__item-link
          {{if this.isSelected 'cds--switcher__item-link--selected'}}"
        {{captureElement this.setElement}}
        {{on "keydown" this.moveFocus}}
      >
        {{yield}}
      </Link>
    </li>
  </template>
}
