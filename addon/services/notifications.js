import Service from '@ember/service';
import { A } from '@ember/array';
export default class NotificationService extends Service {
    constructor() {
        super(...arguments);
        this.queue = A();
        this.position = 'bottom-left';
        this.defaults = {
            timeout: 5000,
            type: 'info'
        };
    }
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
    }
    notify(options) {
        this.queue.pushObject(options);
        if (options.timeout && options.timeout >= 0) {
            setTimeout(() => this.queue.removeObject(options), options.timeout);
        }
    }
    has(options) {
        return this.queue.includes(options);
    }
    remove(options) {
        this.queue.removeObject(options);
    }
}
