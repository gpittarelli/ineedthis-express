import { createService, ServiceName } from 'ineedthis';
import killable, { KillableServer } from 'killable';
import express from 'express';

type ExpressServiceOptions = {
  setup: (server: any, deps: any) => never;
  port?: number | string | ((deps: any) => number | string);
  dependencies: ServiceName[];
};

function getPort(opts: ExpressServiceOptions, deps: any): number {
  let port = opts.port;
  if (typeof port === 'function') {
    port = port(deps);
  }
  if (typeof port === 'string') {
    port = parseInt(port, 10);
  }
  if (typeof port !== 'number') {
    return 3000;
  }

  return port;
}

export default function createExpressService(
  name: ServiceName,
  opts: ExpressServiceOptions
) {
  return createService<
    KillableServer,
    () => (deps: any) => Promise<KillableServer>
  >(name, {
    dependencies: opts.dependencies || [],

    start: () => (deps: any) => {
      const app = express();
      opts.setup(app, deps);

      return new Promise(function(resolve, reject) {
        const server = app.listen(getPort(opts, deps), () => {
          resolve(killable(server));
        });
        server.on('error', reject);
      });
    },

    stop(server: KillableServer) {
      return new Promise(resolve => {
        server.kill(() => resolve());
      });
    }
  });
}

createExpressService.__ineedthis__isCreateService = true;
