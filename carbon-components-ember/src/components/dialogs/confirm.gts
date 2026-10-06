import { service } from '@ember/service';
import Component from '@glimmer/component';
import Modal from '../modal.gts';
import type DialogManagerService from '../../services/dialog-manager';

export type Args = {
  onAccept: () => void;
  onCancel: () => void;
  body?: string;
  header?: string;
  type: string;
  /** Text of the cancel button */
  cancelText?: string;
  /** Text of the accept (primary) button */
  acceptText?: string;
  label?: string;
};

export interface DialogConfirmInterface {
  Args: Args;
}

export default class ConfirmDialogComponent extends Component<DialogConfirmInterface> {
  @service('carbon.dialog-manager')
  dialogManager!: DialogManagerService;

  onCancel = () => {
    this.dialogManager.close();
    if (this.args.onCancel) this.args.onCancel();
    return false;
  };

  onAccept = () => {
    this.dialogManager.close();
    if (this.args.onAccept) this.args.onAccept();
    return false;
  };

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
          class="cds--btn cds--btn--secondary"
          type="button"
          data-modal-close
          {{on "click" this.onCancel}}
        >
          {{or @cancelText "Cancel"}}
        </button>
        <button
          class="cds--btn cds--btn--{{@type}} cds--btn--primary"
          type="button"
          {{on "click" this.onAccept}}
          data-modal-primary-focus
        >
          {{or @acceptText "Okay"}}
        </button>
      </:footer>
    </Modal>
  </template>
}
