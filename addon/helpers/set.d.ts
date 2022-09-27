export declare function setHelper<T, K extends keyof T>([obj, key, path]: [obj: T, key: K, path?: string]): (val: any) => void;
export declare const helper: abstract new <T, K extends keyof T>() => import("@ember/component/helper").FunctionBasedHelperInstance<{
    Args: {
        Positional: [obj: T, key: K, path?: string | undefined];
        Named: import("@ember/component/helper").EmptyObject;
    };
    Return: (val: any) => void;
}>;
export default helper;
declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry {
        'carbon-components-ember/helpers/set': typeof helper;
        'set': typeof helper;
    }
}
