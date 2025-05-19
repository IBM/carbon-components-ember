import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import defaultTo from '../../helpers/default-to.ts';
import Modal from '../modal.gts';
import { on } from '@ember/modifier';
import type DialogManagerService from '../../services/dialog-manager';

type Args = {
  onAccept: () => void;
  onCancel: () => void;
  body?: string;
  header?: string;
  type: string;
  cancelText?: string;
  label?: string;
};

export interface DialogConfirmInterface {
  Args: Args;
}

export default class ConfirmDialogComponent extends Component<DialogConfirmInterface> {
  @service('carbon-components-ember.dialog-manager')
  dialogManager!: DialogManagerService;

  @action
  onCancel() {
    this.dialogManager.close();
    if (this.args.onCancel) this.args.onCancel();
    return false;
  }

  @action
  onAccept() {
    this.dialogManager.close();
    if (this.args.onAccept) this.args.onAccept();
    return false;
  }

  <template>
    <Modal @onClose={{this.onCancel}}>
      <:label>
        {{@label}}
      </:label>

      <:header>
        {{@header}}
      </:header>

      <:body>
        {{@body}}
      </:body>

      <:footer>
        <button
          class='cds--btn cds--btn--secondary'
          type='button'
          data-modal-close
          {{on 'click' this.onCancel}}
        >
          {{defaultTo @cancelText 'Cancel'}}
        </button>
        <button
          class='cds--btn cds--btn--{{@type}} cds--btn--primary'
          type='button'
          aria-label='Danger'
          {{on 'click' this.onAccept}}
          data-modal-primary-focus
        >
          {{defaultTo @cancelText 'Okay'}}
        </button>
      </:footer>
    </Modal>
  </template>
}
