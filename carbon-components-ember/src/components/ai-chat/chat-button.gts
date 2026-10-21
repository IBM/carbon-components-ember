/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import Button from '../button.gts';
import type { ButtonSignature } from '../button.gts';
import './chat-button.scss';
import './chat-history.scss';

export type ChatButtonKind = NonNullable<ButtonSignature['Args']['kind']>;
export type ChatButtonSize = 'sm' | 'md' | 'lg';

export interface ChatButtonSignature {
  Element: ButtonSignature['Element'];
  Args: {
    /** Button kind. Defaults to `'primary'` (or `'ghost'` when `@isQuickAction` is set and no kind is given). */
    kind?: ChatButtonKind;
    /** Button size. Defaults to `'lg'` (or `'sm'` when `@isQuickAction` is set). */
    size?: ChatButtonSize;
    /** Renders as a small, pill-shaped quick-action chip rather than a full-size button. */
    isQuickAction?: boolean;
    /**
     * Marks a quick-action chip as the currently-selected option. Blocks both
     * user interaction and programmatic clicks (via `inert` plus a capture-
     * phase click guard), matching upstream's behavior. Only takes effect
     * when `@isQuickAction` is set - upstream's own normalization only
     * applies it on that branch.
     */
    isSelected?: boolean;
    disabled?: boolean;
    onClick?: () => void;
  };
  Blocks: {
    default: [];
  };
}

const blockProgrammaticClickWhenSelected = modifier(
  (element: HTMLElement, [blocked]: [boolean]) => {
    const handler = (event: Event) => {
      if (blocked) {
        event.stopImmediatePropagation();
      }
    };
    element.addEventListener('click', handler, { capture: true });
    return () =>
      element.removeEventListener('click', handler, { capture: true });
  },
);

/**
 * A button styled for use inside AI Chat surfaces: a taller pill radius than
 * this addon's plain `Button`, plus an `@isQuickAction` variant (a small,
 * outlined chip used for quick-reply-style options) that can be marked
 * `@isSelected` to show it was chosen and block further interaction.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-button`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chat-button),
 * which itself extends `@carbon/web-components`' `cds-button` - this port
 * wraps this addon's own `Button` (Carbon React parity) instead, to stay
 * framework-consistent. It's exported from `carbon-components-ember/ai-chat`,
 * so it doesn't collide with Carbon React's own `ChatButton`.
 */
export default class ChatButton extends Component<ChatButtonSignature> {
  handleClick = () => {
    this.args.onClick?.();
  };

  get isBlocked() {
    return Boolean(this.args.isQuickAction && this.args.isSelected);
  }

  get effectiveSize(): ChatButtonSize {
    if (this.args.isQuickAction) return 'sm';
    return this.args.size ?? 'lg';
  }

  get effectiveKind(): ChatButtonKind {
    if (this.args.kind) return this.args.kind;
    return this.args.isQuickAction ? 'ghost' : 'primary';
  }

  <template>
    <Button
      @kind={{this.effectiveKind}}
      @size={{this.effectiveSize}}
      @disabled={{@disabled}}
      class="cds-aichat-button
        {{if @isQuickAction 'cds-aichat-button--quick-action'}}"
      inert={{if this.isBlocked true}}
      {{! Only ever -1 or 0; the rule can't read the nested if. }}
      {{! eslint-disable-next-line ember/template-no-positive-tabindex }}
      tabindex={{if @isQuickAction (if this.isBlocked "-1" "0")}}
      data-is-selected={{if @isSelected ""}}
      {{blockProgrammaticClickWhenSelected this.isBlocked}}
      ...attributes
      {{on "click" this.handleClick}}
    >
      {{yield}}
    </Button>
  </template>
}
