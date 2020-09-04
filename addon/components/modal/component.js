import Component from '@glimmer/component';
import { computed, action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from "@glimmer/tracking";
import { defaultArgs } from "../../decorators";

/** @documenter yuidoc */

/**
 * @class ModalComponent
 * @yield {String} part label|header|content|footer
 */
export default class ModalComponent extends Component {
  tagName = '';
  @tracked isVisible = true;

  @defaultArgs
  args = {
    /**
     * @argument onClose
     * @type function
     */
    onClose: null
  };

  @computed()
  get guid() {
    return guidFor(this);
  }

  @action
  closeModal() {
    this.isVisible = false;
    this.args.onClose && this.args.onClose();
  }
}
