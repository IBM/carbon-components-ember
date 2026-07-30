import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier as eModifier } from 'ember-modifier';
import { stylesheet } from 'astroturf';
import { Popover } from 'ember-primitives/components/popover';

import type { ModifierLike } from '@glint/template';

export interface Signature {
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
    trigger: [ModifierLike<{ Element: HTMLElement | SVGElement }>];
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
export default class Tooltip extends Component<Signature> {
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

  styles = stylesheet`
    .tooltip {
      background: var(--cds-background-inverse, #393939);
      color: var(--cds-text-inverse, #fff);
      padding: 0.1875rem 0.5rem;
      font-size: 0.75rem;
      line-height: 1rem;
      max-width: 18rem;
      overflow-wrap: break-word;
      border-radius: 0;
      margin: 0.4375rem;
    }

    @media (max-width: 450px) {
      .tooltip {
        max-width: min(90vw, 400px);
      }
    }

    .arrow {
      position: absolute;
      width: 0.5rem;
      height: 0.5rem;
      background: var(--cds-background-inverse, #393939);
      transform: rotate(45deg);
    }
  ` as { tooltip: string; arrow: string };

  <template>
    <Popover @placement='top' as |p|>
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
        {{yield reference to='trigger'}}
      {{/let}}
      {{!-- Always present so aria-describedby on the trigger resolves to
        something, regardless of hover/focus state. The floating bubble
        below is purely visual and hidden from assistive tech. --}}
      <span id={{this.contentId}} class='cds--visually-hidden'>
        {{yield to='content'}}
      </span>
      {{#if this.isVisible}}
        <p.Content class={{this.styles.tooltip}} aria-hidden='true'>
          {{yield to='content'}}
          <div class={{this.styles.arrow}} {{p.arrow}}></div>
        </p.Content>
      {{/if}}
    </Popover>
  </template>
}
