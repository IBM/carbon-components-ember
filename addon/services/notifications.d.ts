import Service from '@ember/service';
declare type NotificationOptions = {
    timeout?: number;
    position?: 'bottom-left';
    title?: string;
    text?: string;
    caption?: string;
    type?: 'info' | 'success' | 'warning' | 'error';
};
export default class NotificationService extends Service {
    queue: import("@ember/array/-private/native-array").default<NotificationOptions>;
    position: string;
    defaults: {
        timeout: number;
        type: string;
    };
    info(opts: NotificationOptions): void;
    success(opts: NotificationOptions): void;
    warning(opts: NotificationOptions): void;
    error(opts: NotificationOptions): void;
    notify(options: NotificationOptions): void;
    has(options: NotificationOptions): boolean;
    remove(options: NotificationOptions): void;
}
export {};
