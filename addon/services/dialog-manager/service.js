import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';


export default class DialogManagerService extends Service {
  @tracked currentDialog = null;
  @tracked options = null;

  open(ref, options) {
    this.currentDialog = ref;
    this.options = options;
  }

  close() {
    this.currentDialog = null;
    this.options = null;
  }
}
