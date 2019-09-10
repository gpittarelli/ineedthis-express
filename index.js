var createService = require('ineedthis').createService;
var killable = require('killable');
var express = require('express');

function getPort(opts, deps) {
  if (typeof opts.port === 'function') {
    return opts.port(deps);
  }
  return opts.port || 3000;
}

module.exports = function createExpressService(name, opts) {
  return createService(name, {
    dependencies: opts.dependencies || [],

    start: function () {
      return function (deps) {
        var app = express();
        opts.setup(app, deps);

        return new Promise(function (resolve, reject) {
          var server = app.listen(getPort(opts, deps), function () {
            resolve(killable(server));
          });
          server.on('error', reject);
        });
      };
    },

    stop: function (server) {
      return new Promise(function (resolve) {
        server.kill(function () {
          resolve();
        });
      });
    }
  })
};

module.exports.__ineedthis__isCreateService = true;
