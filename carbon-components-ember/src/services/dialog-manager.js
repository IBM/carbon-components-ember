import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';


export default class DialogManagerService extends Service {
  @tracked currentDialog = null;
  @tracked options = null;
  id = 'carbon-components-dialog-id'

  get destinationElement() {
    return document.getElementById(this.id);
  }

  open(ref, options) {
    this.currentDialog = ref;
    this.options = options;
  }

  close() {
    this.currentDialog = null;
    this.options = null;
  }
}
