/**
 * Copyright(c) 2015, canvara Technologies Pvt. Ltd.
 */
/* jshint camelcase: false */
'use strict';

/**
 * Module dependencies
 * @private
 */
var httpStatus = require('http-status');
var errors = require('common-errors');
var winston = require('winston'),
  emitter = require('eventemitter2').EventEmitter2;

var DEFAULT_NAME = 'ServerError',
  ERROR_EVENT = 'error',
  DEFAULT_MESSAGE = 'Internal server error';

/**
 * Constructor function
 */
function CanvaraErrorHandler(options) {
  this.options = options || {};
}

/**
 * Middleware function
 * This function is added to the express application as last middleware in the middleware stack.
 * This will log the error and will send the appropriate message to the client.
 *
 * @param   {Error}     err             error instance
 * @param   {Object}    req             express request instance
 * @param   {Object}    res             express response instance
 * @param   {Function}  next            next function(middleware) to call
 */
CanvaraErrorHandler.prototype.middleware = function(err, req, res, next) {
  // if the error is not defined
  if(!err) {
    if(next) {
      return next();
    } else {
      return res.end();
    }
  }
  winston.error('Error while processing request [' + JSON.stringify(err) + ']', err.stack);
  if(err instanceof Error) {
    var httpError = new errors.HttpStatusError(err);
    if(err.status_code >= 500) {
      httpError.message = DEFAULT_MESSAGE;
    }
    res.status(httpError.status_code).json({ message: httpError.message, name: err.name || DEFAULT_NAME });
  } else {
    res.status(err.code || httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || DEFAULT_MESSAGE, name: err.name || DEFAULT_NAME });
  }
};

// add listener for 'error' event
emitter.on(ERROR_EVENT, function(err) {
  winston.error('Unhandled error [' + JSON.stringify(err) +']' , err.stack);
});