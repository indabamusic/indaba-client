var port = process.env.INDABA_TEST_PORT = 13352;
var MAX_OFFSET = process.env.MAX_OFFSET = 100;
var indabaClient = require('../index');

var assert = require('assert');
var testServer = require('./server/server');

var client;
var fixture = {
  users: require('./fixtures/users').data,
  opportunities: require('./fixtures/opportunities').data,
  submissions: require('./fixtures/submissions').data
};

beforeEach(function(done) {
  client = indabaClient({
    dorianEndpoint: 'http://beta.indavelopment.com',
    lydianEndpoint: 'http://localhost:' + port,
    token: 'test-token',
    facebookToken: 'facebook-token'
  });
  client.whoami(done);
});

describe('client.get', function() {
  it('casts results to specified Model', function(done) {
    var req = {
      path: '/opportunities',
      cast: client.Opportunity
    };
    client.get(req, function(err, data) {
      assert.ifError(err);
      var opp = data[0];
      assert.ok(opp instanceof client.Opportunity);
      assert.equal(opp.getPhase(), 'submission');
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
    client.loadFollowing(function(err) {
      assert.ifError(err);
      assert.ok(client.following.length > 0);
      done();
    });
  });
});


describe('client.follow', function() {
  var someUser = fixture.users[0];
  it('adds user to following', function(done) {
    assert.equal(client.following.length, 0);
    assert.ok(!client.isFollowing(someUser));
    client.follow(someUser, function(err) {
      assert.ifError(err);
      assert.equal(client.following.length, 1);
      assert.ok(client.isFollowing(someUser));
      done();
    });
  });
});


describe('client.unfollow', function() {
  var someUser = fixture.users[8];
  beforeEach(function(done) {
    client.follow(someUser, done);
  });
  it('removes user from following', function(done) {
    assert.equal(client.following.length, 1);
    assert.ok(client.isFollowing(someUser));
    client.unfollow(someUser, function(err) {
      assert.ifError(err);
      assert.equal(client.following.length, 0);
      assert.ok(!client.isFollowing(someUser));
      done();
    });
  });
});


describe('client.loadFollowers', function() {
  it('populates client.followers', function(done) {
    client.loadFollowers(function(err) {
      assert.ifError(err);
      var datum = client.followers[0];
      assert.ok(client.isFollowedBy(datum));
      done();
    });
  });
});


describe('client.loadEnteredOpportunities', function() {
  it('populates client.enteredOpportunities', function(done) {
    client.loadEnteredOpportunities(function(err) {
      assert.ifError(err);
      assert.ok(client.enteredOpportunities.length > 0);
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


describe('client.loadVotedSubmissions', function() {
  it('populates client.votedSubmissions', function(done) {
    client.loadVotedSubmissions(function(err) {
      assert.ifError(err);
      assert.ok(client.votedSubmissions);
      assert.ok(client.votedSubmissions[0] instanceof client.Submission);
      done();
    });
  });
});

describe('client.vote', function() {
  var sub = fixture.submissions[0];
  it('adds submission to client.votedSubmissions', function(done) {
    assert.equal(client.votedSubmissions.length, 0);
    assert.ok(!client.hasVotedFor(sub));
    client.vote(sub, function(err) {
      assert.ifError(err);
      assert.equal(client.votedSubmissions.length, 1);
      assert.ok(client.hasVotedFor(sub));
      done();
    });
  });
});

describe('client.unvote', function() {
  var sub = fixture.submissions[0];
  beforeEach(function(done) {
    client.vote(sub, done);
  });
  it('removes submission to client.votedSubmissions', function(done) {
    assert.equal(client.votedSubmissions.length, 1);
    assert.ok(client.hasVotedFor(sub));
    client.unvote(sub, function(err) {
      assert.ifError(err);
      assert.equal(client.votedSubmissions.length, 0);
      assert.ok(!client.hasVotedFor(sub));
      done();
    });
  });
});
