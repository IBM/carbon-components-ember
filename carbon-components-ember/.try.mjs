// Scenarios for `@embroider/try`, run by the try-scenarios job in
// .github/workflows/nodejs.yml. `allowedToFail` scenarios report but don't
// fail the build.
export default {
  scenarios: [
    {
      name: 'ember-latest',
      npm: {
        devDependencies: {
          'ember-source': 'npm:ember-source@latest',
        },
      },
    },
    {
      name: 'ember-beta',
      allowedToFail: true,
      npm: {
        devDependencies: {
          'ember-source': 'npm:ember-source@beta',
        },
      },
    },
    {
      name: 'ember-alpha',
      allowedToFail: true,
      npm: {
        devDependencies: {
          'ember-source': 'npm:ember-source@alpha',
        },
      },
    },
  ],
};
