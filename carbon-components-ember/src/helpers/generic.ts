import Helper from '@ember/component/helper';
import { registerDestructor, unregisterDestructor } from '@ember/destroyable';
import { get } from '@ember/object';

export interface Signature<T> {
  Args: {
    Positional: T[];
    Named: {
      update?: () => void;
      teardown?: () => void;
      create?: () => void;
    };
  };
  Return: T[];
}

export default class GenericHelper<T> extends Helper<Signature<T>> {
  updateCallback?: () => void;
  teardownCallback?: () => void;

  compute(
    positional: Signature<T>['Args']['Positional'],
    named: Signature<T>['Args']['Named'],
  ) {
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
