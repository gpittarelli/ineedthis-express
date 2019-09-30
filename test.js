const { start, stop } = require('ineedthis');
const http = require('http');
const util = require('util');
const { default: createExpressService } = require('./');

const get = url =>
  new Promise((resolve, reject) => http.get(url, resolve).on('error', reject));

(async function() {
  const myservice = createExpressService('myservice', {
    port: 0,
    setup(app) {
      app.get('/', (req, res) => res.send('Hello, World!'));
    }
  });
  const sys = await start(myservice);

  const address = sys['myservice'].address();
  const host =
    address.family === 'IPv6' ? `[${address.address}]` : address.address;
  const res = await get(`http://${host}:${address.port}/`);

  res.setEncoding('utf8');
  let body = '';
  for await (const chunk of res) {
    body += chunk;
  }

  if (body !== 'Hello, World!') {
    throw new Error('Server did not return expected value!');
  }

  await stop(sys);
})().catch(e => {
  console.error(e);
});
