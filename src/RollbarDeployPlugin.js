import request from 'request';
import VError from 'verror';
import { handleError, validateOptions } from './helpers';
import { ROLLBAR_ENDPOINT } from './constants';

class RollbarDeployPlugin {
  constructor({
    accessToken,
    environment,
    revision,
    localUsername = 'unknown',
    silent = false,
    ignoreErrors = false,
    rollbarEndpoint = ROLLBAR_ENDPOINT
  }) {
    this.accessToken = accessToken;
    this.environment = environment;
    this.revision = revision;
    this.localUsername = localUsername;
    this.silent = silent;
    this.ignoreErrors = ignoreErrors;
    this.rollbarEndpoint = rollbarEndpoint;
  }

  afterEmit(compilation, cb) {
    const errors = validateOptions(this);

    if (errors) {
      compilation.errors.push(...handleError(errors));
      return cb();
    }

    this.uploadDeploy((err) => {
      if (err) {
        if (!this.ignoreErrors) {
          compilation.errors.push(...handleError(err));
        } else if (!this.silent) {
          compilation.warnings.push(...handleError(err));
        }
      }
      cb();
    });
  }

  apply(compiler) {
    if (compiler.hooks) {
      compiler.hooks.afterEmit.tapAsync('after-emit', this.afterEmit.bind(this));
    } else {
      compiler.plugin('after-emit', this.afterEmit.bind(this));
    }
  }

  uploadDeploy(cb) {
    const req = request.post(this.rollbarEndpoint, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        if (!this.silent) {
          console.info('Deployment logged to Rollbar'); // eslint-disable-line no-console
        }
        return cb();
      }

      const errMessage = 'failed to log deployment to Rollbar';
      if (err) {
        return cb(new VError(err, errMessage));
      }

      try {
        const { message } = JSON.parse(body);
        return cb(new Error(message ? `${errMessage}: ${message}` : errMessage));
      } catch (parseErr) {
        return cb(new VError(parseErr, errMessage));
      }
    });

    const form = req.form();
    form.append('access_token', this.accessToken);
    form.append('environment', this.environment);
    form.append('revision', this.revision);
    form.append('local_username', this.localUsername);
  }
}

module.exports = RollbarDeployPlugin;
