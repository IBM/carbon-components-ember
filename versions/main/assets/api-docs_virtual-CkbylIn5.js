const packageNames = [
  'carbon-components-ember',
];

const loadApiDocs = {
  'carbon-components-ember': () => fetch('/carbon-components-ember/versions/main/docs/carbon-components-ember.json'),
};

export { loadApiDocs, packageNames };
