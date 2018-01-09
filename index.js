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
        var server = express();
        opts.setup(server, deps);

        return new Promise(function (resolve) {
          server.listen(getPort(opts, deps), function () {
            resolve(killable(server));
          });
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
