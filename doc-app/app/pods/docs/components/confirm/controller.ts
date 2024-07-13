// BEGIN-SNIPPET confirm.js
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ConfirmController extends Controller {
  @tracked answer;
}
// END-SNIPPET
