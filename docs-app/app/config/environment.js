const ENV = {
  modulePrefix: 'docs-app',
  environment: import.meta.env.MODE,
  // Vite's own `base` config (docs-app/vite.config.mjs) already encodes the
  // versioned GH Pages subpath from process.env.DOCS_URL at build time and
  // exposes it here — no need to recompute it.
  rootURL: import.meta.env.BASE_URL || '/',
  locationType: 'history',
  EmberENV: {
    EXTEND_PROTOTYPES: false,
    FEATURES: {},
  },
  APP: {},
};

export default ENV;
