import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { action } from '@ember/object';

export default class DialogComponent extends Component {
  @service('carbon@dialog-manager') dialogManager;
  tagName = '';

  @action
  onCancel() {
    this.dialogManager.close();
    if (this.options.onCancel) this.options.onCancel();
  }

  @action
  onAccept() {
    this.dialogManager.close();
    if (this.options.onAccept) this.options.onAccept();
  }
}