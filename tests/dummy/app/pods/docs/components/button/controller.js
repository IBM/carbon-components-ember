// BEGIN-SNIPPET button.js
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ButtonController extends Controller {

  @action
  doSomething() {
    return new Promise((resolve, rej) => {
      setTimeout(resolve, 5000);
    });
  }
}
// END-SNIPPET
