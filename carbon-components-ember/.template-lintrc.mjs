export default {
  extends: 'recommended',
  checkHbsTemplateLiterals: false,
  rules: {
    'no-inline-styles': 'warn',
    'no-positive-tabindex': 'warn',
  },
  overrides: [
    {
      files: ['tests/**/*'],
      rules: {
        // Style snapshot tests inject Carbon's stylesheets with <style> tags.
        'no-forbidden-elements': ['error', ['meta', 'html', 'script']],
        // Bare inputs are test fixtures, not UI.
        'require-input-label': 'off',
      },
    },
  ],
};
