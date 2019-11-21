/* eslint-env node */

module.exports = {
  name: require('./package').name,

  init(...args) {
    Object.defineProperty(this, 'treePaths', {
      get() {
        return this.__treePaths;
      },
      set(v) {
        console.log('set treePaths');
        this.__treePaths = v;
        this.__treePaths.addon = 'src';
        this.__treePaths['addon-styles'] = 'src/ui/styles';
      }
    });
    this._super(...args);
  },

  isModuleUnification() {
    return true;
  },

  isDevelopingAddon() {
    return true;
  }
};
