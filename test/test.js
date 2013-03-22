var assert = require('assert');
var makeClient = require('../index');

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
    client = makeClient({
      dorianEndpoint: 'http://beta.indavelopment.com',
      lydianEndpoint: process.env.INDABA_TEST_ENDPOINT
    });
  });

  it('opportunities', function(done) {
    var request = {
      path: '/opportunities',
      cast: client.Opportunity
    };
    client.get(request, function(err, data) {
      assert.ok(data);
      var opp = data[0];
      assert.equal(opp.getUrl(), 'http://beta.indavelopment.com/opportunities/submission-time');
      done(err);
    });
  });

  it('single opportunity', function(done) {
    var request = {
      path: '/opportunities/submission-time',
      cast: client.Opportunity
    };
    client.get(request, function(err, opp) {
      assert.ok(opp);
      assert.equal(opp.getUrl(), 'http://beta.indavelopment.com/opportunities/submission-time');
      done(err);
    });
  });

});

describe('client with token', function() {
  var client;

  it('createClient', function() {
    client = makeClient({
      dorianEndpoint: 'http://beta.indavelopment.com',
      lydianEndpoint: process.env.INDABA_TEST_ENDPOINT,
      token: token
    });
  });

  it('whoami', function(done) {
    var request = {
      path: '/whoami',
      query: {access_token: token},
      cast: client.User
    };
    client.get(request, function(err, user) {
      assert.ok(user);
      console.log(user.profileUrl());
      done(err);
    });
  });
});
