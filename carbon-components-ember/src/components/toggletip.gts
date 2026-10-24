import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import type { WithBoundArgs } from '@glint/template';
import ToggletipButtonComponent from './toggletip/toggletip-button.gts';
import ToggletipContentComponent from './toggletip/toggletip-content.gts';
import closeOnOutsideClick from '../modifiers/close-on-outside-click.ts';
import Popover from './popover.gts';

import type { PopoverAlignment, PopoverSignature } from './popover.gts';

export interface ToggletipSignature {
  Args: {
    /**
     * Specify how the toggletip should align with its trigger button.
     */
    align?: PopoverAlignment;
    /**
     * **Experimental:** Keeps the toggletip within the viewport, as
     * `Popover`'s `autoAlign` does.
     */
    autoAlign?: boolean;
    /**
     * Specify if the toggletip should be open by default.
     */
    defaultOpen?: boolean;
  };
  Element: PopoverSignature['Element'];
  Blocks: {
    default: [
      {
        Button: WithBoundArgs<
          typeof ToggletipButtonComponent,
          'open' | 'toggle' | 'id'
        >;
        Content: WithBoundArgs<typeof ToggletipContentComponent, 'id'>;
      },
    ];
  };
}

/**
 * Used as a container for the button and content of a toggletip. Coordinates
 * between interactions with the button and the visibility of the content.
 */
export default class Toggletip extends Component<ToggletipSignature> {
  guid = guidFor(this);
  @tracked open: boolean;

  constructor(owner: Owner, args: ToggletipSignature['Args']) {
    super(owner, args);
    this.open = args.defaultOpen ?? false;
  }
  element?: HTMLElement;

  get id() {
    return `toggletip-${this.guid}`;
  }

  get align() {
    return this.args.align ?? 'top';
  }

  toggle = () => {
    this.open = !this.open;
  };

  close = (focusButton = false) => {
    if (!this.open) return;
    this.open = false;
    if (focusButton) {
      this.element?.querySelector('button')?.focus();
    }
  };

  registerElement = modifier((element: HTMLElement) => {
    this.element = element;
  });

  onOutsideClick = () => {
    if (this.open) this.open = false;
  };

  onKeyDown = (event: KeyboardEvent) => {
    if (this.open && event.key === 'Escape') {
      event.stopPropagation();
      this.close(true);
    }
  };

  onFocusOut = (event: FocusEvent) => {
    if (this.open && event.relatedTarget === null) return;
    if (!this.element?.contains(event.relatedTarget as Node | null)) {
      this.open = false;
    }
  };

  <template>
    <Popover
      class="cds--toggletip {{if this.open 'cds--toggletip--open'}}"
      @align={{this.align}}
      @autoAlign={{@autoAlign}}
      @caret={{true}}
      @dropShadow={{false}}
      @highContrast={{true}}
      @open={{this.open}}
      {{this.registerElement}}
      {{closeOnOutsideClick this.onOutsideClick capture=true onWindowBlur=true}}
      {{on "keydown" this.onKeyDown}}
      {{on "focusout" this.onFocusOut}}
      ...attributes
    >
      {{yield
        (hash
          Button=(component
            ToggletipButtonComponent
            open=this.open
            toggle=this.toggle
            id=this.id
          )
          Content=(component ToggletipContentComponent id=this.id)
        )
      }}
    </Popover>
  </template>
}
