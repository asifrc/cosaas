var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var bucketName = process.env['AWS_S3_BUCKET'] || "cosaaslocal";
var keyPrefix = process.env['AWS_S3_KEY_PREFIX'] || "";

exports.handler = function(event, context, callback) {
  console.log('Process email');
  console.log('event', JSON.stringify(event,null,2));
  if (!event.Records || typeof event.Records[0].ses === "undefined") {
    console.log("Not SES");
    callback("Not SES");
  }
  else {
    console.log('event', event);
    var sesNotification = event.Records[0].ses;
    console.log("SES Notification:\n", JSON.stringify(sesNotification, null, 2));
    console.log("ObjectKEY", keyPrefix + sesNotification.mail.messageId);

    // Retrieve the email from your bucket
    s3.getObject({
      Bucket: bucketName,
      Key: keyPrefix + sesNotification.mail.messageId
    }, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        callback(err);
      } else {
        console.log("Raw email:\n" + data.Body);

        // Custom email processing goes here

        callback(null, null);
      }
    });
  }
};

exports.handle = exports.handler;
