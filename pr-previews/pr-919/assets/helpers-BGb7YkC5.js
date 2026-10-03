import { H as Helper, u as unregisterDestructor, r as registerDestructor, g as get } from './main-B8rrDxlx.js';
export { h as defaultTo, a as getFn, b as has, c as htmlSafe, d as newObj, e as or, f as set } from './main-B8rrDxlx.js';

class GenericHelper extends Helper {
  updateCallback;
  teardownCallback;
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
