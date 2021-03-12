import Service from '@ember/service';
import { A } from '@ember/array';

type NotificationOptions = {
  timeout?: number,
  position?: 'bottom-left',
  title?: string,
  text?: string,
  caption?: string,
  type?: 'info'|'success'|'warning'|'error'
}

export default class NotificationService extends Service {
  queue = A<NotificationOptions>();
  position = 'bottom-left';
  defaults = {
    timeout: 5000,
    type: 'info'
  };

  info(opts: NotificationOptions) {
    const options: NotificationOptions = {};
    Object.assign(options, opts, this.defaults, { type: 'info' });
    this.notify(options);
  }

  success(opts: NotificationOptions) {
    const options: NotificationOptions = {};
    Object.assign(options, opts, this.defaults, { type: 'success' });
    this.notify(options);
  }

  warning(opts: NotificationOptions) {
    const options: NotificationOptions = {};
    Object.assign(options, opts, this.defaults, { type: 'warning' });
    this.notify(options);
  }

  error(opts: NotificationOptions) {
    const options: NotificationOptions = {};
    Object.assign(options, opts, this.defaults, { type: 'error' });
    this.notify(options);
  }E

  notify(options: NotificationOptions) {
    this.queue.pushObject(options);
    if (options.timeout && options.timeout >= 0) {
      setTimeout(() => this.queue.removeObject(options), options.timeout);
    }
  }
}
