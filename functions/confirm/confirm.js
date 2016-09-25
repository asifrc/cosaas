var Confirm = function(s3, env) {
  var self = this;

  env = env || process.env;

  var sesRecords = function(e) {
    return e.Records.filter(function(record) {
      return record.eventSource === "aws:ses";
    }).length > 0;
  };

  self.handler = function(event, context, callback) {
    if (!event.Records || !event.Records.length || !sesRecords(event)) {
      var error = {
        "error": "No SES Event Records"
      };
      callback(error);
    }
    else {
      var params = {
        "Bucket": env['AWS_S3_BUCKET'],
        "Key": env['AWS_S3_KEY_PREFIX'] + event.Records[0].ses.mail.messageId
      };
      s3.getObject(params, function(err, data) {
        if (err) {
          callback(err);
        }
        else {
          callback();
        }
      });
    }
  };
  return self;
};

exports.Confirm = Confirm;
