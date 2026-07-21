const packageNames = [
  'carbon-components-ember',
];

const loadApiDocs = {
  'carbon-components-ember': () => fetch('/carbon-components-ember/pr-previews/pr-654/docs/carbon-components-ember.json'),
};

export { loadApiDocs, packageNames };
