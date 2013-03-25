var port = process.env.INDABA_TEST_PORT = 13352;
var indabaClient = require('../index');

var assert = require('assert');
var testServer = require('./fixtures/server');

var client;

beforeEach(function() {
  client = indabaClient({
    dorianEndpoint: 'http://beta.indavelopment.com',
    lydianEndpoint: 'http://localhost:' + port,
    token: 'test-token'
  });
});

describe('client.get', function() {
  it('gets users', function(done) {
    var req = {
      path: '/users',
      cast: client.User
    };
    client.get(req, function(err, data) {
      assert.ok(data);
      assert.ok(data[0] instanceof client.User);
      done(err);
    });
  });
});

describe('whoami', function() {
  it('sets currentUser', function(done) {
    client.whoami(function(err, currentUser) {
      assert.ok(client.currentUser);
      done(err);
    });
  });
});

