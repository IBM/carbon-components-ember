<ThemeSwitcher />

# Notification

```gjs live preview
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { Button, Notification } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

class NotificationsDemo extends Component {
  @service('carbon.notifications') notifications;

  showNotification = () => {
    this.notifications.info({
      caption: 'test',
    });
  };

  <template>
    <ThemeSupport />
    <Notification
        @type='success'
        @caption='success'
        @title='Success'
        @text='a long long long long message'
    />
    <br />
    <Notification
        @display='actionable'
        @type='info'
        @caption='info'
        @title='Actionable title'
        @actionTitle='Actionable subtitle text goes here'
    />
    <br />
    <Notification
        @display='inline'
        @type='error'
        @caption='error'
        @title='Inline Notification'
        @text='the notification text'
    />
    <br />
    <Notification @type='warning' @caption='warning' />
    <br />
    <br />
    <Button @type='primary' @onClick={{this.showNotification}}>
        Notify
    </Button>

    <div style="position: absolute; top:0; right: 0">
      {{#each this.notifications.queue as |n|}}
        <Notification @notification={{n}} />
        <div style="margin: 2px"></div>
      {{/each}}
    </div>
  </template>
}

<template><NotificationsDemo /></template>
```
## API Reference

<details>
<summary><h3>Notification</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/notification' 
    @name='default' 
  />
</template>
```
</details>
