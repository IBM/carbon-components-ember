<ThemeSwitcher />

# Notification

```gjs live preview
import { Button, Notification } from 'carbon-components-ember/components';
import { ThemeSupport, setOwner } from 'docs-support';
import { service } from '@ember/service';
import { 
    Information16, 
    ErrorFilled16,
    InformationSquareFilled16,
    CheckmarkFilled16,
} from 'carbon-components-ember/icons';

class Context {
  @service('carbon.notifications') notifications;
  
  constructor() {
    setOwner(this);
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
    <Button @type='primary' @onClick={{context.showNotification}}>
        Notify
    </Button>
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
