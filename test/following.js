var assert = require('assert');
var makeClient = require('../index');

describe('client with token', function() {
  var client;
  var someUsers;
  var token = process.env.INDABA_TEST_TOKEN;

  it('createClient', function() {
    client = makeClient({
      dorianEndpoint: 'http://beta.indavelopment.com',
      lydianEndpoint: process.env.INDABA_TEST_ENDPOINT,
      token: token
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
      assert.equal(client.following.length, following.length);
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
    var beforeLength = client.following.length;
    client.follow(someUser, function(err) {
      assert.equal(client.following.length, beforeLength + 1);
      done(err);
    });
  });

  it('unfollow', function(done) {
    var someUser = someUsers[0];
    var beforeLength = client.following.length;
    client.unfollow(someUser, function(err) {
      done(err);
    });
    assert.equal(client.following.length, beforeLength - 1);
  });

});
