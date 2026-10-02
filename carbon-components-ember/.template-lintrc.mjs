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
    {
      files: ['**/*.stories.{gjs,gts}'],
      rules: {
        // Story templates read Storybook's `args` from the render function's
        // scope (not `this.args`), and ember-storybook's <RenderStory> takes
        // an `@args` argument.
        'no-args-paths': 'off',
        'no-capital-arguments': 'off',
      },
    },
  ],
};
