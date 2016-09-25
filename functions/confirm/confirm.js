var cheerio = require('cheerio');
var MailParser = require('mailparser').MailParser;

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
          self.parseEmail(data, callback);
        }
      });
    }
  };

  self.parseEmail = function(data, cb) {
    var mailparser = new MailParser();
    mailparser.on('end', function(email) {
      var html = email.html || ""
      var links = cheerio.load(html)('a').toArray();
      var url = links.map(function(link) {
        return link.attribs.href;
      }).filter(function(href) {
        return /id.*accept/.test(href);
      }).shift();
      cb(null, url);
    });
    mailparser.write(data.Body);
    mailparser.end();
  };

  return self;
};

exports.Confirm = Confirm;
