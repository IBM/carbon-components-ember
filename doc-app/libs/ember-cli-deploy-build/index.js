const DeployPluginBase = require('ember-cli-deploy-plugin');
const path = require('path');
const { exec } = require('child_process');

module.exports = {
  name: require('./package').name,

  createDeployPlugin: function (options) {
    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,
      defaultConfig: {
        environment: 'production',
        outputPath: 'tmp' + path.sep + 'deploy-dist',
      },

      build: function (/* context */) {
        var self = this;
        var outputPath = this.readConfig('outputPath');
        if (process.env.EMBER_CLI_DEPLOY_REUSE_BUILD) {
          this.log('reusing build from `' + outputPath, { verbose: true });
          return Promise.resolve({
            distDir: outputPath,
            distFiles: glob.sync('**/*', {
              cwd: outputPath,
              nodir: true,
              dot: true,
            }),
          });
        }
        var buildEnv = this.readConfig('environment');

        this.log(
          'building app to `' +
            outputPath +
            '` using buildEnv `' +
            buildEnv +
            '`...',
          { verbose: true },
        );
        return new Promise((resolve, reject) => {
          const child = exec(
            `pnpm vite build --mode=${buildEnv} --outDir=${outputPath}`,
          );

          child.stdout.on('data', (data) => {
            console.log(data.toString());
          });

          child.stderr.on('data', (data) => {
            console.error(data.toString());
          });

          child.on('exit', (code) => {
            console.log(`Child exited with code ${code}`);
            if (code === 0) {
              resolve();
            } else {
              reject(new Error('vite build failed ' + code));
            }
          });
        });
      },
    });
    return new DeployPlugin();
  },
};
