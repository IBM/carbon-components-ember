module.exports = {
  extends: 'recommended',

  plugins: ["ember-hbs-imports/hbs-imports-rule"],

  rules: {
    'no-bare-strings': true,
    'must-have-hbs-imports': true
  },
};
