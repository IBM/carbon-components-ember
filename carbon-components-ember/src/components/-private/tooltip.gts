import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier as eModifier } from 'ember-modifier';
import { Popover } from 'ember-primitives/components/popover';

import type { ModifierLike } from '@glint/template';
import './tooltip.scss';

export interface BaseTooltipSignature {
  Args: {
    /**
     * When set, overrides hover/focus detection and forces the tooltip to
     * be shown (`true`) or hidden (`false`). Used by callers (e.g. the copy
     * button's "Copied!" confirmation) that need to show the tooltip
     * outside of a hover/focus interaction.
     */
    isShown?: boolean;
  };
  Blocks: {
    trigger: [trigger: ModifierLike<{ Element: HTMLElement | SVGElement }>];
    content: [];
  };
}

const attachTrigger = eModifier<{
  Element: HTMLElement | SVGElement;
  Args: {
    Named: {
      setReference: (element: HTMLElement | SVGElement) => void;
      onShow: () => void;
      onHide: () => void;
      describedBy: string;
    };
  };
}>((element, _positional, { setReference, onShow, onHide, describedBy }) => {
  setReference(element);
  element.setAttribute('aria-describedby', describedBy);
  element.addEventListener('mouseenter', onShow);
  element.addEventListener('mouseleave', onHide);
  element.addEventListener('focusin', onShow);
  element.addEventListener('focusout', onHide);

  return () => {
    element.removeAttribute('aria-describedby');
    element.removeEventListener('mouseenter', onShow);
    element.removeEventListener('mouseleave', onHide);
    element.removeEventListener('focusin', onShow);
    element.removeEventListener('focusout', onHide);
  };
});

/**
 * Internal hover/focus-triggered tooltip, built on ember-primitives'
 * `Popover` (Floating UI positioning + native `popover` top-layer
 * promotion). Not part of the public component set (`-private`).
 */
export default class BaseTooltip extends Component<BaseTooltipSignature> {
  @tracked isHovered = false;

  show = () => {
    this.isHovered = true;
  };

  hide = () => {
    this.isHovered = false;
  };

  get isVisible() {
    return this.args.isShown ?? this.isHovered;
  }

  get contentId() {
    return `tooltip-${guidFor(this)}`;
  }

  <template>
    {{! eslint-disable-next-line ember/template-require-splattributes -- the trigger is the caller's element }}
    <Popover @placement="top" as |p|>
      {{#let
        (modifier
          attachTrigger
          setReference=p.setReference
          onShow=this.show
          onHide=this.hide
          describedBy=this.contentId
        )
        as |reference|
      }}
        {{yield reference to="trigger"}}
      {{/let}}
      {{! Always present so aria-describedby on the trigger resolves to
        something, regardless of hover/focus state. The floating bubble
        below is purely visual and hidden from assistive tech. }}
      <span id={{this.contentId}} class="cds--visually-hidden">
        {{yield to="content"}}
      </span>
      {{#if this.isVisible}}
        <p.Content class="cds--ember-tooltip" aria-hidden="true">
          {{yield to="content"}}
          <div class="cds--ember-tooltip__arrow" {{p.arrow}}></div>
        </p.Content>
      {{/if}}
    </Popover>
  </template>
}
