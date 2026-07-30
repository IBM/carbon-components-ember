const ENV = {
  modulePrefix: 'test-app',
  environment: 'test',
  rootURL: '/',
  locationType: 'none',
  EmberENV: {
    EXTEND_PROTOTYPES: false,
    FEATURES: {},
  },
  APP: {
    LOG_ACTIVE_GENERATION: false,
    LOG_VIEW_LOOKUPS: false,
    rootElement: '#ember-testing',
    autoboot: false,
  },
};

export default ENV;
