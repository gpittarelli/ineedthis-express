var createService = require('ineedthis').createService;
var killable = require('killable');
var express = require('express');

module.exports = function createExpressService(name, opts) {
  return createService(name, {
    dependencies: opts.dependencies || [],

    start: function () {
      return function (deps) {
        var server = express();
        opts.setup(server, deps);
        return killable(server);
      };
    },

    stop: function (server) {
      return new Promise(function (resolve) {
        server.kill()
      });
    }
  })
};
