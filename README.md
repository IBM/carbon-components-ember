Carbon Components Ember
==============================================================================

Implementation of the carbon design system in ember
https://www.carbondesignsystem.com/


Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above


Installation
------------------------------------------------------------------------------

```
ember install carbon-components-ember
```


Usage
------------------------------------------------------------------------------

Access carbon components with Carbon:: prefix
```handlebars
<Carbon::Button></Carbon::Button>
```

Services:
```js
class Component {
  @service('carbon.notifications') notifications;
}
```

Carbon Components can also be imported with
[ember-hbs-import addon](https://github.com/patricklx/ember-hbs-imports)


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
