/**
 * Copyright(c) 2015, canvara Technologies Pvt. Ltd.
 */

'use strict';

/**
 * This file exposes createServer method.
 *
 * @author      ritesh
 * @version     1.0.0
 */

/**
 * Module dependencies
 * @private
 */
var ErrorHandler = require('..');
var express = require('express');

/**
 * Create an http server with the provided error and options.
 * @param   {Error}     error             error object to add to error handler
 * @param   {Object}    options           options to configure the http server
 */
exports.createServer = function(error, options) {
  var errorHandler = new ErrorHandler(options);
  var app = express();
  app.get('/', function(req, res, next) {
    next(error);
  });
  app.use(errorHandler.middleware());
  return app;
};