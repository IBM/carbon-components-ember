// BEGIN-SNIPPET pagination.js
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class CheckboxController extends Controller {
  @tracked checked: boolean;
}
// END-SNIPPET
