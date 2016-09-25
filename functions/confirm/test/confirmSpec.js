var should = require('should');

describe("Hello", function() {
  it("should say world", function() {
    var str = "world";
    str.should.eql("world");
  });
});
