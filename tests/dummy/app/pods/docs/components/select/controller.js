// BEGIN-SNIPPET select.js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SelectController extends Controller {
  @tracked selected;
  @tracked selectedMultiple;
  options = ['first', 'second', 'a', 'b'];
}
// END-SNIPPET
