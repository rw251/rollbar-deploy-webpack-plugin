RollbarDeployPlugin
========================
[![Dependency Status](https://img.shields.io/david/thredup/rollbar-deploy-webpack-plugin.svg?style=flat-square)](https://david-dm.org/thredup/rollbar-deploy-webpack-plugin)
[![devDependency Status](https://img.shields.io/david/dev/thredup/rollbar-deploy-webpack-plugin.svg?maxAge=2592000?style=flat-square)](https://david-dm.org/thredup/rollbar-deploy-webpack-plugin#info=devDependencies)
[![Build Status](https://img.shields.io/travis/thredup/rollbar-deploy-webpack-plugin.svg?style=flat-square)](https://travis-ci.org/thredup/rollbar-deploy-webpack-plugin)
[![Coverage](https://img.shields.io/codecov/c/github/thredup/rollbar-deploy-webpack-plugin/master.svg?style=flat-square)](https://codecov.io/gh/thredup/rollbar-deploy-webpack-plugin)
[![Downloads](https://img.shields.io/npm/dm/rollbar-deploy-webpack-plugin.svg?style=flat-square)](https://www.npmjs.com/package/rollbar-deploy-webpack-plugin)

This is a [Webpack](https://webpack.github.io) plugin that simplifies the process of notifiying [Rollbar](https://rollbar.com) of a deployment.

## Installation
Install the plugin with npm:
```shell
$ npm install rollbar-deploy-webpack-plugin --save-dev
```

## Basic Usage
An example webpack.config.js:
```javascript
const RollbarDeployPlugin = require('rollbar-deploy-webpack-plugin')
const PUBLIC_PATH = 'https://my.cdn.net/assets'
const webpackConfig = {
  entry: 'index',
  publicPath: PUBLIC_PATH,
  output: {
    path: 'dist',
    filename: 'index-[hash].js'
  },
  plugins: [new RollbarDeployPlugin({
    accessToken: 'aaaabbbbccccddddeeeeffff00001111',
    environment: 'production'
    revision: 'version_string_here', // would typically be the git hash
    localUsername: 'user', // whoever has done the deploy
  })]
}
```

## Plugin Configuration
You can pass a hash of configuration options to `RollbarDeployPlugin`.
Allowed values are as follows:

#### `accessToken: string` **(required)**
Your rollbar `post_server_item` access token.

#### `revision: string` **(required)**
A string identifying the version of your code this deployment is for. Typically this will be the full git sha.

#### `environment: string` **(required)**
Environment to which the revision was deployed. E.g. 'production', 'development', 'testing' etc.

#### `localUsername: string | [string]` **(optional)**
Local username of person who deployed the script. Visible in web application.

#### `silent: boolean` **(default: `false`)**
If `false`, success and warning messages will be logged to the console for each upload. Note: if you also do not want to see errors, set the `ignoreErrors` option to `true`.

#### `ignoreErrors: boolean` **(default: `false`)**
Set to `true` to bypass adding upload errors to the webpack compilation. Do this if you do not want to fail the build when the deployment upload fails. If you do not want to fail the build but you do want to see the failures as warnings, make sure `silent` option is set to `false`.

#### `rollbarEndpoint: string` **(default: `https://api.rollbar.com/api/1/deploy`)**
A string defining the Rollbar API endpoint to upload the deployment to. It can be used for self-hosted Rollbar instances.

## App Configuration
- The web app should have [rollbar-browser](https://github.com/rollbar/rollbar.js) installed and configured for webpack as described [here](https://github.com/rollbar/rollbar.js/tree/master/examples/webpack#using-rollbar-with-webpack).
- See the [Rollbar deploy tracking](https://docs.rollbar.com/docs/deploy-tracking/) documentation
  for how to configure the client side for deployment support.
- More general info on the using [Rollbar for browser JS](https://rollbar.com/docs/notifier/rollbar.js/).

## Contributing
See the [Contributors Guide](/CONTRIBUTING.md)

# License
[MIT](/LICENSE.md)
