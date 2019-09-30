# @ineedthis/express
[![npm version](https://badge.fury.io/js/%40ineedthis%2Fexpress.svg)](https://badge.fury.io/js/%40ineedthis%2Fexpress)

Implements an [ineedthis](https://github.com/gpittarelli/ineedthis)
service for [express](https://expressjs.com/).

## Example

```js
import {start, stop} from 'ineedthis';
import {createExpressService} from '@ineedthis/express';

const mySys = createExpressService('@myorg/webserver', {
  // number | (deps) => number | undefined (defaults to 3000)
  port: 3000,
  // read from env var example:
  // port: ({ '@company/my-config': config }) => config.PORT,

  // desired dependencies (same as ineedthis createService)
  dependencies: [ /*  */ ],

  // server: express server instance to decorate (add route handlers, etc.)
  // deps: object of fufilled dependencies
  setup(server, deps) {
    server.get('/', (req, res) => res.send('Hello, World!'));
  }
});

// Usage:
start(mySys).then(system => {
  // system is: { '@myorg/webserver': <express server> }

  // Server is now running!
  console.log(
    '@myorg/webserver running on port: ',
    system['@myorg/webserver'].address().port
  );

  stop(system).then(() => {
    // Server is now shutdown
  });
});

// Alternative usage:
export default mySys;
// and then run `ineedthis-run ./thisfile.js`
// or `ineedthis-debug ./thisfile.js` for hot-reloading
```

## License

Released under the MIT License. See the LICENSE file for full text

Copyright © 2017 George Pittarelli
