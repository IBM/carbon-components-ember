import Service, { inject as service } from '@ember/service';


export default Service.extend({
  currentDialog: null,
  options: null,

  open(ref, options) {
    this.set('currentDialog', ref);
    this.set('options', options);
  },

  close() {
    this.set('currentDialog', null);
    this.set('options', null);
  }
});
