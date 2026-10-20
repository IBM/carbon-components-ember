import { service } from '@ember/service';
import Component from '@glimmer/component';
import Modal from '../modal.gts';
import type DialogManagerService from '../../services/dialog-manager.ts';
import type { ModalSignature } from '../modal.gts';

export interface ConfirmDialogSignature {
  Element: ModalSignature['Element'];
  Args: {
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
}

export default class ConfirmDialog extends Component<ConfirmDialogSignature> {
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
    <Modal
      @open={{true}}
      @modalLabel={{@label}}
      @modalHeading={{@header}}
      @primaryButtonText={{or @acceptText "Okay"}}
      @secondaryButtonText={{or @cancelText "Cancel"}}
      @danger={{eq @type "danger"}}
      @onRequestClose={{this.onCancel}}
      @onRequestSubmit={{this.onAccept}}
      ...attributes
    >
      {{@body}}
    </Modal>
  </template>
}
