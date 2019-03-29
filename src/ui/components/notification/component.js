import Component from '@ember/component';

export default Component.extend({
  notification: null,
  actions: {
    onClick() {
      if (this.onClick) {
        this.onClick(this.notification);
      }
    }
  }
});
