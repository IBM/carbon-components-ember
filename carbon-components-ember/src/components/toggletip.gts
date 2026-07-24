import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { registerDestructor } from '@ember/destroyable';
import { on } from '@ember/modifier';
import { hash } from '@ember/helper';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import type { WithBoundArgs } from '@glint/template';
import ToggletipButtonComponent from './toggletip/button.gts';
import ToggletipContentComponent from './toggletip/content.gts';

export type ToggletipAlignment =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export interface ToggletipComponentSignature {
  Args: {
    /**
     * Specify how the toggletip should align with its trigger button.
     */
    align?: ToggletipAlignment;
    /**
     * Specify if the toggletip should be open by default.
     */
    defaultOpen?: boolean;
  };
  Element: HTMLSpanElement;
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
export default class ToggletipComponent extends Component<ToggletipComponentSignature> {
  guid = guidFor(this);
  @tracked open = this.args.defaultOpen ?? false;
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

  registerElement = (element: HTMLElement) => {
    this.element = element;
    document.addEventListener('click', this.onDocumentClick, true);
    window.addEventListener('blur', this.onWindowBlur);
    registerDestructor(this, () => {
      document.removeEventListener('click', this.onDocumentClick, true);
      window.removeEventListener('blur', this.onWindowBlur);
    });
  };

  onDocumentClick = (event: MouseEvent) => {
    if (!this.open || !this.element) return;
    const target = event.target;
    if (target instanceof Node && !this.element.contains(target)) {
      this.open = false;
    }
  };

  onWindowBlur = () => {
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
    <span
      class='cds--popover-container
        cds--popover--{{this.align}}
        cds--popover--caret
        cds--popover--high-contrast
        {{if this.open "cds--popover--open"}}
        cds--toggletip
        {{if this.open "cds--toggletip--open"}}'
      {{didInsert this.registerElement}}
      {{on 'keydown' this.onKeyDown}}
      {{on 'focusout' this.onFocusOut}}
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
    </span>
  </template>
}
