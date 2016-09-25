var Confirm = function(s3, env) {
  var self = this;

  self.handler = function(event, context, callback) {
    callback();
  };
  return self;
};

exports.Confirm = Confirm;
