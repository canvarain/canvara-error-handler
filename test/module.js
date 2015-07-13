/**
 * Copyright(c) 2015, canvara Technologies Pvt. Ltd.
 */

'use strict';

/**
 * Test script for module
 *
 * @author      ritesh
 * @version     1.0.0
 */

var errors = require('common-errors');
var request = require('supertest'),
  app = require('./app');

describe('<Module test>', function() {
  it('Should set status code 404 for NotFoundError', function(done) {
    var server = app.createServer(new errors.NotFoundError('User'));
    request(server)
      .get('/')
      .expect(404, done);
  });

  it('Should set status code 401 for NotPermittedError', function(done) {
    var server = app.createServer(new errors.NotPermittedError('User is not allowed to perform this operation'));
    request(server)
      .get('/')
      .expect(403, done);
  });

  it('Should set status code 400 for ValidationError', function(done) {
    var server = app.createServer(new errors.ValidationError('Email cannot be empty'));
    request(server)
      .get('/')
      .expect(400, done);
  });

  it('Should end the response, if there is no next and no error', function(done) {
    var server = app.createServer();
    request(server)
      .get('/')
      .expect(404, done);
  });

  it('Should set 500 status code for general error', function(done) {
    var server = app.createServer(new Error('Hello I am a test error'));
    request(server)
      .get('/')
      .expect(500, done);
  });
});
