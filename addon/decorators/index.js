import Ember from 'ember';
export function classPrefix(prefix) {
    return (target) => {
        target.prototype.classPrefix = prefix;
    };
}
export function bxClassNames(...names) {
    return (target, name, descriptor) => {
        const attrs = names.map(m => m.split(':'));
        function createMapping() {
            const mapping = {};
            attrs.forEach(([a, c]) => {
                if (!c)
                    c = a;
                mapping[a] = target.classPrefix + c;
            });
            return mapping;
        }
        if (!descriptor) {
            Object.defineProperty(target, name, {
                get() {
                    const mapping = createMapping();
                    // @ts-ignore
                    return attrs.map(a => a[0]).map(a => ((String(this[a] || this.args && this.args[a]) === 'true') ? mapping[a] : null)).compact().join(' ');
                }
            });
            return;
        }
        const decorator = function () {
            const mapping = createMapping();
            // @ts-ignore
            return attrs.map(a => a[0]).map(a => ((String(this[a] || this.args && this.args[a]) === 'true') ? mapping[a] : null)).compact().join(' ');
        };
        return {
            get: decorator
        };
    };
}
export function defaultArgs(target, name, descriptor) {
    if (typeof name !== 'string') {
        const defaultArgs = name;
        const args = target.args;
        const withDefaultArgs = {};
        Object.keys(defaultArgs).forEach((k) => {
            const v = defaultArgs[k];
            Object.defineProperty(withDefaultArgs, k, {
                get() {
                    return (k in args) ? args[k] : v;
                }
            });
        });
        return withDefaultArgs;
    }
    const init = descriptor.initializer;
    descriptor.initializer = function () {
        const args = init(this);
        const context = this;
        const origArgs = context.args;
        Object.keys(args).forEach((k) => {
            const v = args[k];
            Object.defineProperty(args, k, {
                get() {
                    return (k in origArgs) ? origArgs[k] : v;
                }
            });
        });
        return args;
    };
    return descriptor;
}
export function autoComputed() {
    // @ts-ignore
    const fixDesc = (desc) => ({ get: desc.get, set: desc.set });
    const dec = (instance, key, desc) => require('@ember/-internals/metal').autoComputed()(instance, key, desc);
    return Ember.autoComputed || dec;
}
