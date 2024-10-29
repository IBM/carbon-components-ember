# Carbon Components Ember

Implementation of the carbon design system in ember
https://www.carbondesignsystem.com/

## Compatibility

- Ember.js v4.8 or above
- Embroider or ember-auto-import v2

## Installation

```
ember install carbon-components-ember
```

## Usage

Access carbon components with Carbon:: prefix

```handlebars
<Carbon::Button />
```

Services:

```js
class Component {
  @service('carbon.notifications') notifications;
}
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [Apache License 2.0](LICENSE.md).
