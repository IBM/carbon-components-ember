// BEGIN-SNIPPET button.js
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ButtonController extends Controller {
  confirmText: string;
  type: 'primary'|'secondary';
  isSmall: boolean;
  isTertiary: boolean;
  isDisabled: boolean;
  isDanger: boolean;
  bubbles: boolean;

  @action
  doSomething() {
    return new Promise((resolve, rej) => {
      setTimeout(resolve, 5000);
    });
  }
}
// END-SNIPPET
