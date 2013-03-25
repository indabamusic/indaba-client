var assert = require('assert');
var makeClient = require('../index');

var token = process.env.INDABA_TEST_TOKEN;
var client = makeClient({
  dorianEndpoint: 'http://beta.indavelopment.com',
  lydianEndpoint: process.env.INDABA_TEST_ENDPOINT,
  token: token
});

var someUsers = require('./fixtures/users.json').data;
var someUser = someUsers[1];
client.currentUser = someUsers[0];


describe('following', function() {

  it('unfollow first', function(done) {
    client.unfollow(someUser, function(err) {
      done();
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
    assert.ok(!client.isFollowing(someUser));
    var beforeLength = client.following.length;
    client.follow(someUser, function(err) {
      assert.equal(client.following.length, beforeLength + 1);
      assert.ok(client.following[0] instanceof client.User);
      done(err);
    });
  });

  it('isFollowing', function() {
    assert.ok(client.isFollowing(someUser));
  });

  it('unfollow removes user from following', function(done) {
    var beforeLength = client.following.length;
    client.unfollow(someUser, function(err) {
      assert.equal(client.following.length, beforeLength - 1);
      done(err);
    });
  });

});

describe('followers', function() {

  it('loads followers', function(done) {
    client.loadFollowers(function(err, data) {
      var datum = data[0];
      assert.ok(client.isFollowedBy(datum));
      done(err);
    });
  });

});
