import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { defaultArgs, autoComputed } from '../../decorators';

/** @documenter yuidoc */

type Args = {
  /**
   * @argument onClose
   * @type function
   */
  onClose: null|Function;
  type: string;
}

export interface ModalComponentSignature {
  Args: Args;
  Blocks: {
    label: [];
    header: [];
    body: [];
    footer: [];
  };
}

/**
 * @class ModalComponent
 */
export default class ModalComponent extends Component<ModalComponentSignature> {
  @tracked isVisible = true;

  args = defaultArgs(this, {
    onClose: null
  });

  @autoComputed()
  get guid() {
    return guidFor(this);
  }

  @action
  closeModal() {
    this.isVisible = false;
    this.args.onClose && this.args.onClose();
    return false;
  }
}
