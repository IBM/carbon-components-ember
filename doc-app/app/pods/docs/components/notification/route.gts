import Button from 'carbon-components-ember/components/button';
import DocsDemo from 'ember-cli-addon-docs/components/docs-demo';
import Notification from 'carbon-components-ember/components/notification';
import RouteTemplate, { RoutableComponent } from 'ember-routable-component';
import Component from '@glimmer/component';
import type NotificationController from './controller.ts';

class RouteComponent extends RoutableComponent<NotificationController> {
  <template>
    <h1>
      Carbon Notification
    </h1>

    <DocsDemo as |demo|>
      <demo.example @name='notification.hbs'>
        <Notification
          @type='success'
          @caption='success'
          @title='Title'
          @text='a long long long long message'
        />
        <br />
        <Notification
          @display='actionable'
          @type='info'
          @caption='info'
          @title='Notification title'
          @actionTitle='Subtitle text goes here'
        />
        <br />
        <Notification
          @display='inline'
          @type='error'
          @caption='error'
          @title='Title'
          @text='the notification text'
        />
        <br />
        <Notification @type='warning' @caption='warning' />
        <br />
        <br />
        <Button @type='primary' @onClick={{@controller.showNotification}}>
          Notify
        </Button>
      </demo.example>
      <demo.snippet @name='notification.hbs' />
      <demo.snippet @name='notification.js' />
    </DocsDemo>
  </template>
}

export default RouteTemplate(RouteComponent);
