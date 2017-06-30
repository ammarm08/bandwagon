'use strict';

const http = require('http'),
      co   = require('bluebird').coroutine,
      utils = require('./utils');

const app = {};

app.settings = [];
app.routes = {
  'get': {},
  'post': {}
};

app.init = function init () {
  // set defaults
  app.set(utils.urlParser);
  app.set(utils.bodyParser);
}

app.set = function set (fn) {
  app.settings.push(fn);
}

app.route = function route (method, path, fn) {
  if (!method || !app.routes[method]) {
    throw Error(`RouteError: ${method} is not supported yet.`)
  }

  // accept a pipeline of handlers for any given route
  app.routes[method][path] = app.routes[method][path] || []
  app.routes[method][path].push(fn);
}

app.get = function get (path, fn) {
  app.route('get', path, fn);
}

app.post = function post (path, fn) {
  app.route('post', path, fn);
}

app.run = co(function * run (req, res) {
  // apply middleware
  for (let setting of this.settings) {
    yield setting(req, res);
  }

  // get routes
  const handlers = this.routes[req.method.toLowerCase()][req.url.pathname];

  // default route if no routes found
  if (!handlers || handlers.length === 0) {
    res.writeHeader(404, {'Content-Type': 'text/plain'});
    res.end('Resource Not Found');
    return null;
  }

  // otherwise, apply routes
  for (let handler of handlers) {
    yield handler(req, res)
  }
  
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
