const packageNames = [
  'carbon-components-ember',
];

const loadApiDocs = {
  'carbon-components-ember': () => fetch('/carbon-components-ember/pr-previews/pr-838/docs/carbon-components-ember.json'),
};

export { loadApiDocs, packageNames };
