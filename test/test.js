var assert = require('assert');
var IndabaClient = require('../index');

// authenticate + token setup
var token;

var authenticate = require('indaba-auth')({
  lydianEndpoint: process.env.INDABA_TEST_ENDPOINT,
  clientId: process.env.INDABA_TEST_CLIENT,
  clientSecret: process.env.INDABA_TEST_SECRET
});

describe('get a valid token', function() {
  it('login', function(done) {
    authenticate({
      username: process.env.INDABA_TEST_USERNAME,
      password: process.env.INDABA_TEST_PASSWORD,
      grant_type: 'password'
    }, function(err, t) {
      token = t;
      assert.ok(token);
      done(err);
    });
  });
});

describe('client without token', function() {
  var client;

  it('createClient', function() {
    client = new IndabaClient({
      lydianEndpoint: process.env.INDABA_TEST_ENDPOINT
    });
  });

  it('opportunities', function(done) {
    client.get('/opportunities', {}, function(err, data) {
      assert.ok(data);
      done(err);
    });
  });
});

describe('client with token', function() {
  var client;

  it('createClient', function() {
    client = new IndabaClient({
      lydianEndpoint: process.env.INDABA_TEST_ENDPOINT,
      token: token
    });
  });

  it('whoami', function(done) {
    client.get('/whoami', {access_token: token}, function(err, data) {
      assert.ok(data);
      done(err);
    });
  });
});
