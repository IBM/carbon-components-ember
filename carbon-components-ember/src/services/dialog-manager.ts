import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type Component from '@glimmer/component';

export default class DialogManagerService extends Service {
  @tracked currentDialog?: typeof Component<any>;
  @tracked options = null;
  id = 'carbon-components-dialog-id';

  get destinationElement(): HTMLElement {
    return document.getElementById(this.id)!;
  }

  open(ref: any, options: any) {
    this.currentDialog = ref;
    this.options = options;
  }

  close() {
    this.currentDialog = undefined;
    this.options = null;
  }
}
