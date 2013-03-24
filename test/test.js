var assert = require('assert');
var makeClient = require('../index');

var token = process.env.INDABA_TEST_TOKEN;
var someUsers;


describe('client', function() {
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

describe('authenticated client', function() {
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

});
