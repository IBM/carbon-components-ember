<ThemeSwitcher />

# Notification

```gjs live preview
import { Button, Notification } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { service } from '@ember/service';
import { 
    Information16, 
    ErrorFilled16,
    InformationSquareFilled16,
    CheckmarkFilled16,
} from '@carbon/icons';

class Context {
    @service('carbon.notifications') notifications;

    get icon() {
        const mapping= {
            info: Information16,
            error: ErrorFilled16,
            'info-square': 'information--square--filled',
            success: 'checkmark--filled',
            warning: 'warning',
            'warning-alt': 'warning--alt--filled',
        };
        return mapping[this.defaultArgs.kind];
    }
    
}

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
    <Button @type='primary' @onClick={{@controller.showNotification}}>
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
