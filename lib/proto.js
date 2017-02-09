'use strict';

const http = require('http'),
      co   = require('bluebird').coroutine,
      utils = require('./utils');

const app = {};

app.settings = [];
app.routes = {};

app.init = function init () {
  // set defaults
  app.set(utils.urlParser);
  app.set(utils.bodyParser);
}

app.set = function set (fn) {
  app.settings.push(fn);
}

app.route = function route (path, fn) {
  app.routes[path] = fn;
}

app.run = co(function * run (req, res) {
  // apply middleware
  for (let setting of this.settings) {
    yield setting(req, res);
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
  return server.listen(...args);
}

module.exports = function () {
  app.init();
  return app;
}
