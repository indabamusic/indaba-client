var assert = require('assert');
var makeClient = require('../index');

var token = process.env.INDABA_TEST_TOKEN;
var client = makeClient({
  dorianEndpoint: 'http://beta.indavelopment.com',
  lydianEndpoint: process.env.INDABA_TEST_ENDPOINT,
  token: token
});

var someOpps;

before(function(done) {
  client.get({path: '/opportunities', cast: client.Opportunity}, function(err, opps) {
    someOpps = opps;
    done(err);
  });
});

describe('entering', function() {
  it('loads your entered opportunities', function(done) {
    client.loadEnteredOpportunities(function(err, opps) {
      assert.ok(opps[0] instanceof client.Opportunity);
      done(err);
    });
  });

  it('adds opportunity to your enteredOpportunities', function(done) {
    var opp = someOpps[0];
    assert.ok(opp instanceof client.Opportunity);
    var beforeLength = client.enteredOpportunities.length;
    client.enterOpportunity(opp, function(err) {
      if (!err) {
        assert.equal(client.enteredOpportunities.length, beforeLength + 1);
        done();
      }
      else if (err.message.match('AlreadyEnteredError')) {
        // already entered.... testing would be better if we had better fixture setup
        assert.equal(client.enteredOpportunities.length, beforeLength);
        done();
      }
      else {
        done(err);
      }
    });
  });
});
