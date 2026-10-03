import { H as Helper, _ as _defineProperty, u as unregisterDestructor, r as registerDestructor, g as get } from './main-BkvZhrTA.js';
export { h as defaultTo, a as getFn, b as has, c as htmlSafe, d as newObj, e as or, f as set } from './main-BkvZhrTA.js';

class GenericHelper extends Helper {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "updateCallback", void 0);
    _defineProperty(this, "teardownCallback", void 0);
  }
  compute(positional, named) {
    const firstTime = !this.updateCallback;
    this.updateCallback = named.update;
    if (named.teardown) {
      if (this.teardownCallback) {
        unregisterDestructor(this, this.teardownCallback);
      }
      this.teardownCallback = named.teardown;
      if (this.teardownCallback) {
        registerDestructor(this, this.teardownCallback);
      }
    }
    if (this.updateCallback && !firstTime) {
      this.updateCallback();
    }
    if (firstTime && named.create) {
      named.create();
    }
    //access all positional params
    positional.forEach((v, i) => get(positional, i));
    return positional;
  }
}

export { GenericHelper as generic };
