var port = process.env.INDABA_TEST_PORT = 13352;
var MAX_OFFSET = process.env.MAX_OFFSET = 100;
var indabaClient = require('../index');

var assert = require('assert');
var testServer = require('./fixtures/server');

var client;
var fixture = {
  users: require('./fixtures/users').data,
  opportunities: require('./fixtures/opportunities').data
};

beforeEach(function(done) {
  client = indabaClient({
    dorianEndpoint: 'http://beta.indavelopment.com',
    lydianEndpoint: 'http://localhost:' + port,
    token: 'test-token'
  });
  client.whoami(done);
});

describe('client.get', function() {
  it('casts results to specified Model', function(done) {
    var req = {
      path: '/users',
      cast: client.User
    };
    client.get(req, function(err, data) {
      assert.ifError(err);
      assert.ok(data[0] instanceof client.User);
      done();
    });
  });
  it('all option gets all the records', function(done) {
    var req = {
      path: '/users',
      cast: client.User,
      all: true
    };
    client.get(req, function(err, data) {
      assert.ifError(err);
      assert.equal(data.length, MAX_OFFSET);
      done();
    });
  });
});


describe('whoami', function() {
  it('sets currentUser', function(done) {
    client.whoami(function(err, currentUser) {
      assert.ifError(err);
      assert.equal(currentUser, client.currentUser);
      done();
    });
  });
});


describe('client.loadFollowing', function() {
  it('populates client.following', function(done) {
    client.loadFollowing(function(err, following) {
      assert.ifError(err);
      assert.ok(following);
      assert.equal(client.following.length, following.length);
      done();
    });
  });
});


describe('client.follow', function() {
  var someUser = fixture.users[0];
  it('adds user to following', function(done) {
    assert.ok(!client.isFollowing(someUser));
    var beforeLength = client.following.length;
    client.follow(someUser, function(err) {
      assert.ifError(err);
      assert.equal(client.following.length, beforeLength + 1);
      assert.ok(client.isFollowing(someUser));
      done();
    });
  });
});


describe('client.unfollow', function() {
  var someUser = fixture.users[8];
  var beforeLength;
  beforeEach(function(done) {
    client.follow(someUser, function(err) {
      assert.ifError(err);
      assert.ok(client.isFollowing(someUser));
      beforeLength = client.following.length;
      done();
    });
  });
  it('removes user from following', function(done) {
    client.unfollow(someUser, function(err) {
      assert.ifError(err);
      assert.equal(client.following.length, beforeLength - 1);
      assert.ok(!client.isFollowing(someUser));
      done();
    });
  });
});


describe('client.loadFollowers', function() {
  it('populates client.followers', function(done) {
    client.loadFollowers(function(err, data) {
      assert.ifError(err);
      var datum = data[0];
      assert.ok(client.isFollowedBy(datum));
      done();
    });
  });
});


describe('client.loadEnteredOpportunities', function() {
  it('populates client.enteredOpportunities', function(done) {
    client.loadEnteredOpportunities(function(err, opps) {
      assert.ifError(err);
      done();
    });
  });
});


describe('client.enterOpportunity', function() {
  it('adds opportunity to your enteredOpportunities', function(done) {
    var opp = fixture.opportunities[0];
    client.enterOpportunity(opp, function(err) {
      assert.ifError(err);
      assert.equal(client.enteredOpportunities.length, 1);
      assert.ok(client.isEntered(opp));
      done();
    });
  });
});
