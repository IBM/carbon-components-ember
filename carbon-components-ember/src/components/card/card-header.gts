/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import AILabel from '../ai-label.gts';
import type Card from '../card.gts';
import { afterRender } from '../../utils/after-render.ts';

export interface CardHeaderSignature {
  Element: HTMLDivElement;
  Args: {
    /** @internal The card, bound by `Card`. */
    card?: Card;
  };
  Blocks: {
    default: [];
    /**
     * Carbon React's `decorator` on `Card`, rendered here, where React's
     * header renders it: usually an `AILabel`, in the header's top corner,
     * which gives the card its AI gradient.
     */
    decorator: [AILabel: typeof AILabel];
  };
}

/** The header of a `Card`: its media, title and actions. */
export default class CardHeader extends Component<CardHeaderSignature> {
  // As Carbon React's, the decorator's clicks and keys don't reach a
  // clickable card. The card styles itself for it once this has rendered.
  setUpDecorator = modifier((element: HTMLElement) => {
    const stop = (event: Event) => event.stopPropagation();
    element.addEventListener('click', stop);
    element.addEventListener('keydown', stop);
    const { card } = this.args;
    let counted = false;
    const cancel = afterRender(this, () => {
      if (!card) return;
      card.decorators += 1;
      counted = true;
    });
    return () => {
      element.removeEventListener('click', stop);
      element.removeEventListener('keydown', stop);
      cancel();
      if (card && counted) afterRender(card, () => (card.decorators -= 1));
    };
  });

  <template>
    <div class="cds--card__header" ...attributes>
      {{yield}}
      {{#if (has-block "decorator")}}
        <div
          class="cds--card__decorator"
          role="presentation"
          {{this.setUpDecorator}}
        >
          {{yield AILabel to="decorator"}}
        </div>
      {{/if}}
    </div>
  </template>
}
