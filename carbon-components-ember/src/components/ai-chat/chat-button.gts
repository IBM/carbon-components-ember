/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import { eq } from 'ember-truth-helpers';
import Button from '../button.gts';

export type ChatButtonKind = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
export type ChatButtonSize = 'sm' | 'md' | 'lg';

export type Args = {
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

export interface AiChatChatButtonSignature {
  Element: HTMLButtonElement;
  Args: Args;
  Blocks: {
    default: [];
  };
}

const blockProgrammaticClickWhenSelected = modifier((element: HTMLButtonElement, [blocked]: [boolean]) => {
  const handler = (event: Event) => {
    if (blocked) {
      event.stopImmediatePropagation();
    }
  };
  element.addEventListener('click', handler, { capture: true });
  return () => element.removeEventListener('click', handler, { capture: true });
});

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
 * framework-consistent. Exported as `AiChatChatButton` because Carbon React
 * has its own not-yet-implemented `ChatButton` (see
 * `scripts/parity-check.mjs`'s `AI_CHAT_EXPORT_OVERRIDES`).
 *
 * Upstream's `kind`/`size` also accept `danger--tertiary`/`danger--ghost`
 * combination kinds (from `@carbon/web-components`' `BUTTON_KIND`) and an
 * `xl`/`2xl` size range; this addon's `Button` only exposes
 * `primary`/`secondary`/`tertiary`/`ghost`/`danger` and `sm`/`md`/`lg`/`xl`,
 * so those combinations aren't reproduced - not a behavior consumers of
 * this addon have relied on elsewhere either.
 */
export default class AiChatChatButton extends Component<AiChatChatButtonSignature> {
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

  get buttonType() {
    return this.effectiveKind === 'ghost' || this.effectiveKind === 'tertiary' ? undefined : this.effectiveKind;
  }

  <template>
    <Button
      class='cds-aichat-button {{if @isQuickAction "cds-aichat-button--quick-action"}}'
      @type={{this.buttonType}}
      @tertiary={{eq this.effectiveKind 'tertiary'}}
      @ghost={{eq this.effectiveKind 'ghost'}}
      @size={{this.effectiveSize}}
      @disabled={{@disabled}}
      @onClick={{@onClick}}
      inert={{if this.isBlocked true}}
      tabindex={{if @isQuickAction (if this.isBlocked '-1' '0')}}
      data-is-selected={{if @isSelected ''}}
      {{blockProgrammaticClickWhenSelected this.isBlocked}}
      ...attributes
    >
      {{yield}}
    </Button>
  </template>
}
