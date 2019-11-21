import Service from '@ember/service';

export default class NotificationService extends Service {
  queue = [];
  position = 'bottom-left';
  defaults = {
    timeout: 5000,
    type: 'info'
  };

  info(opts) {
    const options = {};
    Object.assign(options, opts, this.defaults, { type: 'info' });
    this.notify(options);
  }

  success(opts) {
    const options = {};
    Object.assign(options, opts, this.defaults, { type: 'success' });
    this.notify(options);
  }

  warning(opts) {
    const options = {};
    Object.assign(options, opts, this.defaults, { type: 'warning' });
    this.notify(options);
  }

  error(opts) {
    const options = {};
    Object.assign(options, opts, this.defaults, { type: 'error' });
    this.notify(options);
  }E

  notify(options) {
    this.queue.pushObject(options);
    if (options.timeout >= 0) {
      setTimeout(() => this.queue.removeObject(options), options.timeout);
    }
  }
}
