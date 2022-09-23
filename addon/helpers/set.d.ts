export declare function setHelper([obj, key, path]: [any, any, any]): (val: any) => void;
export declare const helper: import("@ember/component/helper").FunctionBasedHelper<{
    Args: {
        Positional: [any, any, any];
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
