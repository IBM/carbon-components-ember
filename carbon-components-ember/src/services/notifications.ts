import Service from '@ember/service';
import { A, NativeArray } from '@ember/array';

export type NotificationOptions = {
  timeout?: number;
  position?: 'bottom-left';
  title?: string;
  text?: string;
  caption?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  display?: 'toast' | 'inline' | 'actionable';
  kind?:
    | 'error'
    | 'info'
    | 'info-square'
    | 'success'
    | 'warning'
    | 'warning-alt';
  actionTitle?: string;
};

export default class NotificationService extends Service {
  queue: NativeArray<NotificationOptions> = A<NotificationOptions>();
  position = 'bottom-left';
  defaults = {
    timeout: 5000,
    type: 'info',
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
  }

  notify(options: NotificationOptions) {
    this.queue.pushObject(options);
    if (options.timeout && options.timeout >= 0) {
      setTimeout(() => this.queue.removeObject(options), options.timeout);
    }
  }

  has(options: NotificationOptions) {
    return this.queue.includes(options);
  }

  remove(options: NotificationOptions) {
    this.queue.removeObject(options);
  }
}
