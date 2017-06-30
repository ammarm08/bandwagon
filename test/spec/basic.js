'use strict';
/* eslint-disable */

/**
 * basic.js
 * ------------------------------------------------------
 *
 * Mocha tests for BandwagonJS
 *
 * ------------------------------------------------------
 */


const app = require('../fixtures/example'),
      fs  = require('fs'),
      path = require('path'),
      request = require('supertest'),
      should  = require('should'),
      Promise = require('bluebird');

require('should-http');




/**
 * ------------------------------------------------------
 *
 * BASIC SERVER START TEST
 *
 * ------------------------------------------------------
 *
 */
describe('Server starts', function () {
  let server;

  before(function () {
    server = app.listen(3000);
  });

  after(function (done) {
    server.close(done);
  });

  it('GET /: should redirect requests to MCI', function (done) {
    request(server)
      .get('/')
      .expect(302)
      .expect('location', 'https://www.google.com')
      .end((err, res) => {
        res.status.should.equal(302);
        done();
      });
  });


  it('GET /foo/bar: should reject unknown routes', function (done) {
    request(server)
      .get('/foo/bar')
      .expect(404)
      .end((err, res) => {
        res.status.should.equal(404);
        done();
      });
  });


  it('GET /__health-check__: sends a health message', function (done) {
    request(server)
      .get('/__health-check__')
      .expect(200)
      .expect('Content-type', /text\/plain/)
      .end((err, res) => {
        res.status.should.equal(200);
        res.text.should.be.a.String().and.equal('OK');
        done();
      });
  });

  it('POST /data: sends back data sent in request body', function (done) {
    request(server)
      .post('/data')
      .send({send: 'data'})
      .expect(200)
      .expect('Content-type', /application\/json/)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.should.be.a.Object();
        res.body.send.should.equal('data');
        done();
      });
  });
});
