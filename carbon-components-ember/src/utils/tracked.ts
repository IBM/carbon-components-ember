import { tracked } from '@glimmer/tracking';


export class TrackedPromise {
  @tracked value: any;
  promise?: Promise<any>;
  load: () => Promise<any>;
  getValue() {
    if (!this.promise) {
      this.promise = this.load();
      void this.promise?.then((v) => {
        this.value = v;
      });
    }
    return this.value;
  }

  constructor(load: () => Promise<any>) {
    this.load = load;
  }
}
