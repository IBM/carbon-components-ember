<ThemeSwitcher />

# Notification

```gjs live preview
import { Button, Notification } from 'carbon-components-ember/components';
import { ThemeSupport, setOwner } from 'docs-support';
import { service } from '@ember/service';

class Context {
  @service('carbon.notifications') notifications;
  
  constructor() {
    setOwner(this);
  }
  
  get documentBody() {
    return document.body; 
  }

  showNotification = (type) => {
    this.notifications.info({
      caption: 'test',
    });
  }
}

const context = new Context();

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
    <Button @type='primary' @onClick={{context.showNotification}}>
        Notify
    </Button>

    <div style="position: absolute; top:0; right: 0">
      {{#each context.notifications.queue as |n|}}
        <Notification @notification={{n}} />
        <div style="margin: 2px"></div>
      {{/each}}
    </div> 
</template>
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
