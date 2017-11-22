# @ineedthis/express
[![npm version](https://badge.fury.io/js/ineedthis.svg)](https://badge.fury.io/js/ineedthis)

Implements an [ineedthis](https://github.com/gpittarelli/ineedthis)
service for [express](https://expressjs.com/).

## Example

```js
import {start, stop} from 'ineedthis';
import {createExpressService} from '@ineedthis/express';

const mySys = createExpressService('@myorg/webserver', {
  port: 3000,

  dependencies: [ /*  */ ],

  setup(server, deps) {
    server.get('/', (req, res) => res.send('Hello, World!'));
  }
});

start(mySys).then(system => {
  // Server is now running!

  stop(system).then(() => {
    // Server is now shutdown
  });
});
```

## License

Released under the MIT License. See the LICENSE file for full text

Copyright © 2017 George Pittarelli
