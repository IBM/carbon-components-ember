import DocsHeader from 'ember-cli-addon-docs/components/docs-header';
import Notification from 'carbon-components-ember/components/notification';
import RouteTemplate from 'ember-routable-component';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import DialogManagerService from 'carbon-components-ember/services/dialog-manager';

interface Signature<T> {
  Args: {
    controller: typeof Controller<T>;
    model: T;
  };
  Blocks: {
    default: [];
    outlet: [];
  };
}

class RouteComponent extends Component<Signature<any>> {
  @service('carbon-components-ember@dialog-manager')
  dialogManager: DialogManagerService;
  @service('carbon/notifications') notifications;

  <template>
    <DocsHeader />
    {{yield to='outlet'}}

    <div style='position: fixed; top: 0; right: 0; width: 350px; z-index: 9999'>
      {{#each this.notifications.queue as |notification|}}
        <Notification
          style='word-wrap: break-word; width: 350px;'
          @notification={{notification}}
        />
        <div style='height: 2px'></div>
      {{/each}}
    </div>
    <div id='{{this.dialogManager.id}}'>
      {{#if this.dialogManager.currentDialog}}
        {{#let (component this.dialogManager.currentDialog) as |Current|}}
          <Current @options={{this.dialogManager.options}} />
        {{/let}}
      {{/if}}
    </div>
  </template>
}

export default RouteTemplate(RouteComponent);
