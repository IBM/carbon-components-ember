import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { cached, tracked } from '@glimmer/tracking';
import { defaultArgs } from '../utils/decorators.ts';
import { on } from '@ember/modifier';

/** @documenter yuidoc */

type Args = {
  /**
   * @argument onClose
   * @type function
   */
  onClose?: (args?: any) => any;
  type?: 'danger' | 'default' | 'passive';
};

export interface ModalComponentSignature {
  Args: Args;
  Blocks: {
    label: [];
    header: [];
    body: [];
    footer: [];
  };
}

/**
 * @class Modal
 */
export default class Modal extends Component<ModalComponentSignature> {
  @tracked isVisible = true;

  args: Args = defaultArgs(this, {
    onClose: undefined,
  });

  @cached
  get guid() {
    return guidFor(this);
  }

  @action
  closeModal() {
    this.isVisible = false;
    this.args.onClose && this.args.onClose?.();
    return false;
  }

  <template>
    <div
      data-modal
      id='modal-{{this.guid}}'
      class='cds--modal cds--modal--{{@type}}
        {{if this.isVisible "is-visible"}}'
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-{{this.guid}}-label'
      aria-describedby='modal-{{this.guid}}-heading'
      tabindex='-1'
    >
      <div class='cds--modal-container'>
        <div class='cds--modal-header'>
          <p
            class='cds--modal-header__label cds--type-delta'
            id='modal-{{this.guid}}-label'
          >
            {{yield to='label'}}
          </p>
          <p
            class='cds--modal-header__heading cds--type-beta'
            id='modal-{{this.guid}}-heading'
          >
            {{yield to='header'}}
          </p>
          <div class="cds--modal-close-button"><span
            class="cds--popover-container cds--popover--caret cds--popover--high-contrast cds--popover--left cds--tooltip cds--icon-tooltip">
            <div class="cds--tooltip-trigger__wrapper">
              <button {{on 'click' this.closeModal}} aria-label="Close" class="cds--modal-close cds--btn cds--btn--primary cds--btn--icon-only" type="button">
                <svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" aria-hidden="true" width="20" height="20" viewBox="0 0 32 32"
                     class="cds--modal-close__icon" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.4141 16L24 9.4141 22.5859 8 16 14.5859 9.4143 8 8 9.4141 14.5859 16 8 22.5859 9.4143 24 16 17.4141 22.5859 24 24 22.5859 17.4141 16z"></path>
                </svg>
              </button>
            </div>
            <span aria-hidden="true" id="tooltip-:rm:" role="tooltip" class="cds--popover">
              <span class="cds--popover-content cds--tooltip-content">Close</span>
            <span class="cds--popover-caret"></span></span></span></div>
        </div>

        <div class='cds--modal-content'>
          {{yield to='body'}}
        </div>

        <div class='cds--modal-footer'>
          {{yield to='footer'}}
        </div>
      </div>
    </div>
  </template>
}
