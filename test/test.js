var assert = require('assert');
var makeClient = require('../index');

// authenticate + token setup
var token;

var authenticate = require('indaba-auth')({
  lydianEndpoint: process.env.INDABA_TEST_ENDPOINT,
  clientId: process.env.INDABA_TEST_CLIENT,
  clientSecret: process.env.INDABA_TEST_SECRET
});

var someUsers;

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

  before(function() {
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
      assert.ok(opp.getUrl());
      done(err);
    });
  });

  it('list users', function(done) {
    var request = {
      path: '/users',
      cast: client.User
    };
    client.get(request, function(err, data) {
      assert.ok(data);
      someUsers = data;
      done(err);
    });
  });

  it('some instruments', function(done) {
    var request = {
      path: '/instruments'
    };
    client.get(request, function(err, data) {
      assert.ok(data);
      assert.ok(data.totalRecords > data.length);
      done(err);
    });
  });

  it.skip('all instruments', function(done) {
    var request = {
      path: '/instruments',
      all: true
    };
    client.get(request, function(err, data) {
      assert.ok(data);
      assert.equal(data.totalRecords, data.length);
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
      assert.ok(opp.getUrl());
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
    client.whoami(function(err, user) {
      assert.ok(user);
      assert.ok(client.currentUser);
      assert.equal(client.currentUser, user);
      assert.ok(user.profileUrl());
      done(err);
    });
  });

  it('load following', function(done) {
    client.loadFollowing(function(err, following) {
      assert.ok(following);
      assert.equal(client.followingCollection.length, following.length);
      done(err);
    });
  });

  it('ensure not following', function(done) {
    var someUser = someUsers[0];
    client.unfollow(someUser, function(err) {
      done();
    });
  });

  it('follow user', function(done) {
    var someUser = someUsers[0];
    var beforeLength = client.followingCollection.length;
    client.follow(someUser, function(err) {
      assert.equal(client.followingCollection.length, beforeLength + 1);
      done(err);
    });
  });

  it('unfollow', function(done) {
    var someUser = someUsers[0];
    var beforeLength = client.followingCollection.length;
    client.unfollow(someUser, function(err) {
      done(err);
    });
    assert.equal(client.followingCollection.length, beforeLength - 1);
  });

});
