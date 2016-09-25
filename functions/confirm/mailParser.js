var MailParser = function(s3, bucketName, keyPrefix) {
  var self = this;
  self.parse = function(sesNotification, callback) {
    s3.getObject({
      Bucket: bucketName,
      Key: keyPrefix + sesNotification.mail.messageId
    }, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        callback(err);
      } else {
        console.log("Raw email:\n" + data.Body);


        callback(null, null);
      }
    });
  };
  return self;
};

exports.HParser = MailParser;
