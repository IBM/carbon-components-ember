import Service from '@ember/service';

/**
 * Where Button's and Icon's `@danger` confirmation dialogs render: the
 * element with this `id`, which the app adds to its application template.
 */
export default class DialogManagerService extends Service {
  id = 'carbon-components-dialog-id';

  get destinationElement(): HTMLElement {
    return document.getElementById(this.id)!;
  }
}
