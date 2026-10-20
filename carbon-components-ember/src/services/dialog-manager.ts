import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

/** What `open()` passes to the confirmation dialog. */
export interface DialogOptions {
  type?: 'danger' | 'default' | 'passive';
  header?: string;
  body?: string;
  onAccept?: () => void;
}

export default class DialogManagerService extends Service {
  /** The dialog to show: a component's module path. */
  @tracked currentDialog?: string;
  @tracked options: DialogOptions | null = null;

  open(ref: string, options: DialogOptions) {
    this.currentDialog = ref;
    this.options = options;
  }

  close() {
    this.currentDialog = undefined;
    this.options = null;
  }
}
