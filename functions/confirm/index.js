var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var handler = require('./confirm.js');
var confirm = new handler.Confirm(s3);

exports.handler = confirm.handler;
exports.handle = exports.handler;
