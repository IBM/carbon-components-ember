/* eslint-env node */

module.exports = {
  name: require('./package').name,

  discoverAddons() {
    this.pkg.dependencies = this.pkg.peerDependencies;
    const pkgInfo = this.packageInfoCache.getEntry(this.root);
    if (pkgInfo) {
      pkgInfo.processed = false;
      pkgInfo.pkg.dependencyPackages = pkgInfo.pkg.dependencyPackages || {};
      Object.assign(pkgInfo.pkg.dependencyPackages, pkgInfo.pkg.peerDependencies);
    }
    this.packageInfoCache._resolveDependencies();
    this._super();
  },

  isModuleUnification() {
    return true;
  }
};
