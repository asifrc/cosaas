var should = require('should');

var Confirm = require('../confirm').Confirm;

var sampleEvent = require('./resources/sampleEvent.json');

var validEvent = function() {
  return JSON.parse(JSON.stringify(sampleEvent));
}

var mock = function(obj, methodName, cb) {
  cb = cb || new Function();
  obj[methodName] = function() {
    obj[methodName].called = true;
    obj[methodName].args = arguments;
    cb.apply(obj, arguments);
  };
  obj[methodName].called = false;
};

var s3getObjectStub = function(params, cb) {
  cb = cb || new Function();
  var err = null;
  var data = {
    "Body": ""
  };
  cb(err, data);
};

var stubbedS3 = {
  "getObject": s3getObjectStub
};

describe("Confirm", function() {
  describe("handler", function() {
    it("should call third parameter as a callback in order to conform to AWS Lambda", function(done) {
      var confirm = new Confirm(stubbedS3);
      var event = validEvent();

      confirm.handler(event, null, function() {
        done();
      });
    });

    it("should require that there is a Record field", function(done) {
      var confirm = new Confirm(stubbedS3);
      var event = {}

      confirm.handler(event, null, function(err, data) {
        err.error.should.eql("No SES Event Records");
        done();
      });
    });

    it("should require there to be at least on Record", function(done) {
      var confirm = new Confirm(stubbedS3);
      var event = {
        "Records": []
      };

      confirm.handler(event, null, function(err, data) {
        err.error.should.eql("No SES Event Records");
        done();
      });
    });

    it("should require there to be at least one AWS SES record", function(done) {
      var confirm = new Confirm(stubbedS3);
      var event = {
        "Records": [
          {
            "eventSource": "aws:s3",
            "s3": {}
          },
          {
            "eventSource": "aws:random",
            "random": {}
          }
        ]
      };

      confirm.handler(event, null, function(err, data) {
        err.error.should.eql("No SES Event Records");
        done();
      });
    });

    it("should not return any errors when a valid SES event is present", function(done) {
      var confirm = new Confirm(stubbedS3);
      var event = validEvent();

      confirm.handler(event, null, function(err, data) {
        should.not.exist(err);
        done();
      });
    });

    it("should retrieve bucket specified in environment", function(done) {
      var s3 = {};
      var env = {
        "AWS_S3_BUCKET": "testbucket"
      };
      var confirm = new Confirm(s3, env);
      var event = validEvent();

      mock(s3,'getObject', s3getObjectStub);


      confirm.handler(event, null, function(err, data) {
        s3.getObject.called.should.eql(true);
        s3.getObject.args[0].Bucket.should.eql(env['AWS_S3_BUCKET']);
        done();
      });
    });

    it("should retrieve s3 object using prefix and messageId", function(done) {
      var s3 = {};
      var env = {
        "AWS_S3_KEY_PREFIX": "prefix/"
      };
      var confirm = new Confirm(s3, env);
      var event = validEvent();
      event.Records[0].ses.mail.messageId = "testMessageId";

      mock(s3,'getObject', s3getObjectStub);


      confirm.handler(event, null, function(err, data) {
        s3.getObject.args[0].Key.should.eql("prefix/testMessageId");
        done();
      });
    });

    it("should return error upon s3 error", function(done) {
      var s3 = {};
      var env = {
        "AWS_S3_BUCKET": "testbucket"
      };
      var confirm = new Confirm(s3, env);
      var event = validEvent();

      mock(s3,'getObject', function(params, cb) {
        cb({"error": "S3 Error"});
      });

      confirm.handler(event, null, function(err, data) {
        err.error.should.eql("S3 Error");
        done();
      });
    });
  });
});
