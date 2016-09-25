var bucketName = process.env['AWS_S3_BUCKET'] || "cosaaslocal";
var keyPrefix = process.env['AWS_S3_KEY_PREFIX'] || "";

var parsers = require('./mailParser');

var Confirm = function(s3) {
  var self = this;

  var mailParser = new parsers.HParser(s3, bucketName, keyPrefix);

  self.handler = function(event, context, callback) {
    console.log('Process email');
    console.log('event', JSON.stringify(event,null,2));
    if (!event.Records || typeof event.Records[0].ses === "undefined") {
      console.log("Not SES");
      callback("Not SES");
    }
    else {
      var sesNotification = event.Records[0].ses;
      mailParser.parse(sesNotification, function(err, data) {
        console.log("Parsing Complete:", err, data);
      });
    }
  };
  return self;
};

exports.Confirm = Confirm;
