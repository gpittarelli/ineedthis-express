import {createService, ServiceName} from 'ineedthis';
import killable, {KillableServer} from 'killable';
import express from 'express';

type ExpressServiceOptions = {
  setup: (server: any, deps: any) => never;
  port?: (deps: any) => number;
  dependencies: ServiceName[];
};

function getPort(opts: ExpressServiceOptions, deps: any): number {
  if (typeof opts.port === 'function') {
    return opts.port(deps);
  }
  return opts.port || 3000;
}

module.exports = function createExpressService(name: ServiceName, opts: ExpressServiceOptions) {
  return createService<KillableServer, () => (deps: any) => Promise<KillableServer>>(name, {
    dependencies: opts.dependencies || [],

    start: function () {
      return function (deps: any) {
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

    stop: function (server: KillableServer) {
      return new Promise(function (resolve) {
        server.kill(function () {
          resolve();
        });
      });
    }
  })
};

module.exports.__ineedthis__isCreateService = true;
