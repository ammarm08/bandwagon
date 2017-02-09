'use strict';

const http = require('http'),
      logger = require('./logger'),
      co   = require('bluebird').coroutine;

const app = module.exports = {};

app.settings = [];
app.routes = {};

app.set = function set (k, fn) {
  app.settings.push([k, fn]);
}

app.route = function route (path, fn) {
  app.routes[path] = fn;
}

app.run = co(function* run (req, res) {
  // apply middleware
  for (let setting of this.settings) {
    yield setting[1](req, res);
  }

  // apply routes
  if (this.routes[req.url.pathname]) {
    yield this.routes[req.url.pathname](req, res);
    return null;
  }

  // default route
  res.writeHeader(404, {'Content-Type': 'text/plain'});
  res.end('Resource Not Found');
  return null;
});

app.listen = function listen (...args) {
  const server = http.createServer(app.run.bind(this));

  server.on('clientError', (err, socket) => {
    logger.error('[ SENTIMENT API ]', err);
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  });

  return server.listen(...args);
}
