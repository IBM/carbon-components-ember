declare module '@carbon/icons/es/index.js';

// ---------------------------------------------------------------------------
// TEMPORARY: ember-assign-helper ships without TypeScript types. It's only
// imported by tests/power-select-modules.ts, to register it in the strict
// test resolver so ember-power-select@8's loose-mode templates can render.
//
// REMOVE once we upgrade to ember-power-select@9 / ember-basic-dropdown@9
// (strict-mode, no manual registration needed).
// ---------------------------------------------------------------------------
declare module 'ember-assign-helper/helpers/assign' {
  import type Helper from '@ember/component/helper';
  const AssignHelper: typeof Helper;
  export default AssignHelper;
}
