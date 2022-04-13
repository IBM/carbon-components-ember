import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { action } from '@ember/object';

type Args = {
  onAccept: () => null;
  onCancel: () => null;
  body: string;
  header: string;
  type: string;
  cancelText: string;
}

export default class DialogComponent extends Component<Args> {
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
