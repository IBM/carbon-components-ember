import Component from '@ember/component';
import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class ModalComponent extends Component {
  tagName = '';
  @computed
  get guid() {
    return guidFor(this);
  }
}
