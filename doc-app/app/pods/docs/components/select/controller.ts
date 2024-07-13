// BEGIN-SNIPPET select.js
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class SelectController extends Controller {
  @tracked selected: string;
  @tracked selectedMultiple: string[];

  options = ['first', 'second', 'a', 'b'];

  @action
  add(v) {
    this.selectedMultiple.push(v);
  }
}
// END-SNIPPET
