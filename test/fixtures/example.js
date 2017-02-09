'use strict';

const bandwagon = require('../../lib/proto'),
      app = bandwagon(),
      co  = require('bluebird').coroutine;

/**
 *
 * ROUTES
 *
 */

const handleRoot = co(function * (req, res) {
  res.statusCode = 302;
  res.setHeader('Location', 'https://www.google.com');

  res.end();
  return null;
});

const handleHealthCheck = co(function * (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Connection': 'close'
  });

  res.end('OK');
  return null;
});

// set route handlers
app.route('/', handleRoot);
app.route('/__health-check__', handleHealthCheck);

console.log(app);
module.exports = app;
