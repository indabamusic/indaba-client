var assert = require('assert');
var makeClient = require('../index');

var token = process.env.INDABA_TEST_TOKEN;
var client = makeClient({
  dorianEndpoint: 'http://beta.indavelopment.com',
  lydianEndpoint: process.env.INDABA_TEST_ENDPOINT,
  token: token
});

var someUser;

before(function(done) {

  var request = {
    path: '/users',
    cast: client.User
  };
  client.get(request, function(err, data) {
    someUser = data[0];
    assert.ok(someUser);
    ensureNotFollowing();
  });

  function ensureNotFollowing() {
    client.unfollow(someUser, function(err) {
      done();
    });
  }
});

describe('following', function() {

  it('requires whoami first', function(done) {
    client.whoami(function(err, user) {
      assert.ok(user);
      assert.ok(client.currentUser);
      assert.equal(client.currentUser, user);
      assert.ok(user.profileUrl());
      done(err);
    });
  });

  it('loads following', function(done) {
    client.loadFollowing(function(err, following) {
      assert.ok(following);
      assert.equal(client.following.length, following.length);
      done(err);
    });
  });

  it('follow adds user to following', function(done) {
    var beforeLength = client.following.length;
    client.follow(someUser, function(err) {
      assert.equal(client.following.length, beforeLength + 1);
      assert.ok(client.following[0] instanceof client.User);
      done(err);
    });
  });

  it('unfollow removes user from following', function(done) {
    var beforeLength = client.following.length;
    client.unfollow(someUser, function(err) {
      assert.equal(client.following.length, beforeLength - 1);
      done(err);
    });
  });

});
