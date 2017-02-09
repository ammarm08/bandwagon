'use strict';

const url = require('url'),
      Promise = require('bluebird');

exports.urlParser = (req) => {
  return new Promise(resolve => {
    req.url = url.parse(req.url, true);
    resolve();
  });
}

exports.bodyParser = (req) => {
  if (req.method === 'GET') {
    return Promise.resolve(req);
  }

  return new Promise(resolve => {
    let data = '';

    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      req.body = data ? JSON.parse(data) : {};
      resolve(req);
    });
  });
}
