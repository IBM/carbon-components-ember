// BEGIN-SNIPPET pagination.js
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class PaginationController extends Controller {
  @tracked paginationLength = 100;
}
// END-SNIPPET
