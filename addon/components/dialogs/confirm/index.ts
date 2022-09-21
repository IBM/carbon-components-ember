import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { action } from '@ember/object';

type Args = {
  onAccept: () => void;
  onCancel: () => void;
  body: string;
  header: string;
  type: string;
  cancelText?: string;
}

export interface DialogConfirmInterface {
  Args: Args
}

export default class ConfirmDialogComponent extends Component<DialogConfirmInterface> {
  @service('carbon-components-ember@dialog-manager') dialogManager;

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
}



