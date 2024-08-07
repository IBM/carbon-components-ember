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
          <button
            class='cds--modal-close'
            type='button'
            data-modal-close
            aria-label='close modal'
            data-modal-primary-focus
            {{on 'click' this.closeModal}}
          >
            <svg
              class='cds--modal-close__icon'
              width='10'
              height='10'
              viewBox='0 0 10 10'
              xmlns='http://www.w3.org/2000/svg'
            >
              <title>
                Close Modal
              </title>
              <path
                d='M6.32 5L10 8.68 8.68 10 5 6.32 1.32 10 0 8.68 3.68 5 0 1.32 1.32 0 5 3.68 8.68 0 10 1.32 6.32 5z'
                fill-rule='nonzero'
              />
            </svg>
          </button>
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
