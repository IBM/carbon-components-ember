// Hand-written inputs for arg-parity.test.mjs, not the addon's types: small
// stand-ins, each built to hit one rule (a missing prop, an extra argument,
// a bound argument, a barrel line that also exports a helper). The real
// comparison reads declarations it emits from the addon's source at run time.
export { default as Button } from './components/button';
export { default as ButtonSet } from './components/button-set';
export { default as Layer } from './components/layer';
export { default as OnlyEmber } from './components/only-ember';
export { default as Tag, tagColor } from './components/tag';
export { default as Tooltip } from './components/tooltip';
