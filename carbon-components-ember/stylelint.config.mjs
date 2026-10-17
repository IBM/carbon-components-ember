// Formatting is Prettier's job (`lint:format`); Stylelint has no stylistic
// rules since v16, so the two don't overlap.
export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['dist/**', 'dist-*/**', 'storybook-static/**', 'coverage/**'],
  rules: {
    // Carbon's type tokens have five decimals (1.42857).
    'number-max-precision': 5,
    // Carbon's visually-hidden styles still use `clip`.
    'property-no-deprecated': [true, { ignoreProperties: ['clip'] }],
    // BEM, as Carbon names its classes (`cds--btn__icon--left`).
    'selector-class-pattern': [
      '^[a-z0-9]+(?:(?:-{1,2}|__)[a-z0-9]+)*$',
      { message: (name) => `Expected "${name}" to be a BEM class name` },
    ],
  },
  overrides: [
    {
      // Only here: the SCSS config parses every file it covers as SCSS,
      // which would let `//` comments through in plain CSS.
      files: ['**/*.scss'],
      extends: ['stylelint-config-standard-scss'],
      rules: {
        // Blank `//` lines separate paragraphs in comments.
        'scss/comment-no-empty': null,
      },
    },
  ],
};
