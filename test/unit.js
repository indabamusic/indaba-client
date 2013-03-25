var port = process.env.INDABA_TEST_PORT = 13352;

var assert = require('assert');
var testServer = require('./fixtures/server');


var client = require('../index')({
  dorianEndpoint: 'http://beta.indavelopment.com',
  lydianEndpoint: 'http://localhost:' + port,
  token: 'test-token'
});

describe('test server', function() {
  it('works', function(done) {
    var req = {
      path: '/users',
      cast: client.User
    };
    client.get(req, function(err, data) {
      assert.ok(data);
      done(err);
    });
  });
});
