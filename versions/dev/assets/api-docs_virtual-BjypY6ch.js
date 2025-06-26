const packageNames = [
  'carbon-components-ember',
];

const loadApiDocs = {
  'carbon-components-ember': () => fetch('/carbon-components-ember/versions/dev/docs/carbon-components-ember.json'),
};

export { loadApiDocs, packageNames };
