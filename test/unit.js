var port = process.env.INDABA_TEST_PORT = 13352;
var MAX_OFFSET = process.env.MAX_OFFSET = 100;
var assert = require('assert');
var testServer = require('./server/server');

var indaba = require('../index')({
  dorianEndpoint: 'http://beta.indavelopment.com',
  lydianEndpoint: 'http://localhost:' + port,
});

var visitor;
var fixture = {
  users: require('./fixtures/users').data,
  opportunities: require('./fixtures/opportunities').data,
  submissions: require('./fixtures/submissions').data
};

beforeEach(function(done) {
  visitor = indaba.createVisitor('test-token');
  visitor.facebookToken = 'facebook-token';
  visitor.whoami(done);
});

describe('indaba.get', function() {
  it('casts results to specified Model', function(done) {
    var req = {
      path: '/opportunities',
      cast: indaba.Opportunity
    };
    indaba.get(req, function(err, data) {
      assert.ifError(err);
      var opp = data[0];
      assert.ok(opp instanceof indaba.Opportunity);
      assert.equal(opp.getPhase(), 'submission');
      done();
    });
  });
  it('all option gets all the records', function(done) {
    var req = {
      path: '/users',
      cast: indaba.User,
      all: true
    };
    indaba.get(req, function(err, data) {
      assert.ifError(err);
      assert.equal(data.length, MAX_OFFSET);
      done();
    });
  });
});


describe('visitor.whoami', function() {
  it('sets currentUser', function(done) {
    visitor.whoami(function(err, currentUser) {
      assert.ifError(err);
      assert.equal(currentUser, visitor.currentUser);
      done();
    });
  });
});


describe('visitor.loadFollowing', function() {
  it('populates visitor.following', function(done) {
    visitor.loadFollowing(function(err) {
      assert.ifError(err);
      done();
    });
  });
});


describe('visitor.follow', function() {
  var someUser = fixture.users[0];
  it('adds user to following', function(done) {
    assert.ok(!visitor.isFollowing(someUser));
    visitor.follow(someUser, function(err) {
      assert.ifError(err);
      assert.ok(visitor.isFollowing(someUser));
      done();
    });
  });
});


describe('visitor.unfollow', function() {
  var someUser = fixture.users[8];
  beforeEach(function(done) {
    visitor.follow(someUser, done);
  });
  it('removes user from following', function(done) {
    assert.ok(visitor.isFollowing(someUser));
    visitor.unfollow(someUser, function(err) {
      assert.ifError(err);
      assert.ok(!visitor.isFollowing(someUser));
      done();
    });
  });
});


describe('visitor.loadFollowers', function() {
  it('populates visitor.followers', function(done) {
    visitor.loadFollowers(function(err) {
      assert.ifError(err);
      done();
    });
  });
});


describe('visitor.loadEnteredOpportunities', function() {
  it('populates visitor.enteredOpportunities', function(done) {
    visitor.loadEnteredOpportunities(function(err) {
      assert.ifError(err);
      done();
    });
  });
});


describe('visitor.enterOpportunity', function() {
  it('adds opportunity to your enteredOpportunities', function(done) {
    var opp = fixture.opportunities[0];
    visitor.enterOpportunity(opp, function(err) {
      assert.ifError(err);
      assert.ok(visitor.isEntered(opp));
      done();
    });
  });
});


describe('visitor.loadVotedSubmissions', function() {
  it('populates visitor.votedSubmissions', function(done) {
    visitor.loadVotedSubmissions(function(err) {
      assert.ifError(err);
      assert.ok(visitor.votedSubmissions);
      done();
    });
  });
});

describe('visitor.vote', function() {
  var sub = fixture.submissions[0];
  it('adds submission to visitor.votedSubmissions', function(done) {
    assert.ok(!visitor.hasVotedFor(sub));
    visitor.vote(sub, function(err) {
      assert.ifError(err);
      assert.ok(visitor.hasVotedFor(sub));
      done();
    });
  });
});

describe('visitor.unvote', function() {
  var sub = fixture.submissions[0];
  beforeEach(function(done) {
    visitor.vote(sub, done);
  });
  it('removes submission to visitor.votedSubmissions', function(done) {
    assert.ok(visitor.hasVotedFor(sub));
    visitor.unvote(sub, function(err) {
      assert.ifError(err);
      assert.ok(!visitor.hasVotedFor(sub));
      done();
    });
  });
});
