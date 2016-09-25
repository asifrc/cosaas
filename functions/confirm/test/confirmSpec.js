var should = require('should');

var Confirm = require('../confirm').Confirm;


describe("Confirm", function() {
  describe("handler", function() {
    it("should call third param as a callback", function(done) {
      var confirm = new Confirm();
      confirm.handler(null,null,done);
    });
  });
});
