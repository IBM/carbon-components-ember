import { inject as service } from '@ember/service';
import Controller from '@ember/controller';


export default class ApplicationController extends Controller {
  @service('carbon-components-ember@dialog-manager') dialogManager;
  @service('carbon-components-ember@notifications') notifications;
}
