var port = process.env.INDABA_TEST_PORT = 13352;
var MAX_OFFSET = process.env.MAX_OFFSET = 100;
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
  it('casts results to specified Model', function(done) {
    var req = {
      path: '/users',
      cast: client.User
    };
    client.get(req, function(err, data) {
      assert.ok(data[0] instanceof client.User);
      done(err);
    });
  });
  it('all option gets all the records', function(done) {
    var req = {
      path: '/users',
      cast: client.User,
      all: true
    };
    client.get(req, function(err, data) {
      assert.equal(data.length, MAX_OFFSET);
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

