'use strict';

define("dummy/tests/helpers/ember-cli-clipboard", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.triggerSuccess = triggerSuccess;
  _exports.triggerError = triggerError;
  _exports.default = _default;

  /* === Integration Test Helpers === */

  /**
   * Fires `success` action for an instance of a copy-button component
   * @function triggerSuccess
   * @param {Object} context - integration test’s this context
   * @param {String|Element} selector - selector of the copy-button instance
   * @returns {Void}
   */
  function triggerSuccess(context, selector) {
    fireComponentAction(context, selector, 'success');
  }
  /**
   * Fires `error` action for an instance of a copy-button component
   * @function triggerError
   * @param {Object} context - integration test’s this context
   * @param {String|Element} selector - selector of the copy-button instance
   * @returns {Void}
   */


  function triggerError(context, selector) {
    fireComponentAction(context, selector, 'error');
  }
  /* === Acceptance Test Helpers === */

  /**
   * Default export is a function that registers acceptance test helpers
   */


  function _default() {
    Ember.Test.registerAsyncHelper('triggerCopySuccess', function (app) {
      var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.copy-btn';
      fireComponentActionFromApp(app, selector, 'success');
    });
    Ember.Test.registerAsyncHelper('triggerCopyError', function (app) {
      var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.copy-btn';
      fireComponentActionFromApp(app, selector, 'error');
    });
  }
  /* === Private Functions === */

  /**
   * Fires named action for an instance of a copy-button component in an app
   * @function fireComponentActionFromApp
   * @param {Object} app - Ember application
   * @param {String|Element} selector - selector of the copy-button instance
   * @param {String} actionName - name of action
   * @returns {Void}
   */


  function fireComponentActionFromApp(app, selector, actionName) {
    fireComponentAction({
      container: app.__container__,
      $: app.$
    }, selector, actionName);
  }
  /**
   * Fires named action for an instance of a copy-button component
   * @function fireComponentAction
   * @param {Object} context - test context
   * @param {String|Element} selector - selector of the copy-button instance
   * @param {String} actionName - name of action
   * @returns {Void}
   */


  function fireComponentAction(context, selector, actionName) {
    var component = getComponentBySelector(context, selector);
    fireActionByName(component, actionName);
  }
  /**
   * Fetches component reference for a given context and selector
   * @function getComponentBySelector
   * @param {Object} context - test context
   * @param {String|Element} selector - selector of the copy-button instance
   * @returns {Object} component object
   */


  function getComponentBySelector(context) {
    var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.copy-btn';
    var emberId = context.$(selector).attr('id');
    return context.container.lookup('-view-registry:main')[emberId];
  }
  /**
   * Fires a component's action given an action name
   * @function fireActionByName
   * @param {Ember.Component} component - component to fire action from
   * @param {String} actionName - name of action
   * @returns {Void}
   */


  function fireActionByName(component, actionName) {
    var action = component[actionName];
    Ember.run(function () {
      if (typeof action === 'string') {
        component.sendAction(action);
      } else {
        action();
      }
    });
  }
});
define("dummy/tests/lint/templates.template.lint-test", [], function () {
  "use strict";

  QUnit.module('TemplateLint');
  QUnit.test('dummy/pods/application/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'dummy/pods/application/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('dummy/pods/docs/components/button/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'dummy/pods/docs/components/button/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('dummy/pods/docs/index/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'dummy/pods/docs/index/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('dummy/pods/docs/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'dummy/pods/docs/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('dummy/pods/index/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'dummy/pods/index/template.hbs should pass TemplateLint.\n\n');
  });
});
define("dummy/tests/test-helper", ["dummy/src/main", "dummy/config/environment", "@ember/test-helpers", "ember-qunit"], function (_main, _environment, _testHelpers, _emberQunit) {
  "use strict";

  (0, _testHelpers.setApplication)(_main.default.create(_environment.default.APP));
  (0, _emberQunit.start)();
});
define('dummy/config/environment', [], function() {
  var prefix = 'dummy';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('dummy/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
