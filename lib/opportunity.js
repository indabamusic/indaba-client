var extend = require('./extend');

module.exports = function(ENV) {

  var OpportunityDates = {
    initialize: function(obj) {
      obj.submission_start_date = new Date(obj.submission_start_date);
      if (obj.votingEnabled()) {
        obj.voting_start_date = new Date(obj.voting_start_date);
        obj.voting_end_date = new Date(obj.voting_end_date);
      }
      ['submission_end_date', 'end_date', 'winners_date'].forEach(function(optionalDateKey) {
        if (obj[optionalDateKey]) {
          obj[optionalDateKey] = new Date(obj[optionalDateKey]);
        }
      });
    },
    methods: {
      getPhase: function() {
        if (this.inSubmission())
          return 'submission';
        else if (this.inVoting())
          return 'voting';
        else if (this.winnersAnnounced())
          return 'winners';
        else
          return 'listen';
      },
      inSubmission: function() {
        return (inPast(this.submission_start_date) &&
            (!this.submission_end_date || inFuture(this.submission_end_date)));
      },
      inVoting: function() {
        return (this.votingEnabled() && inPast(this.voting_start_date) && inFuture(this.voting_end_date));
      },
      winnersAnnounced: function() {
        return !!(this.winners_date && inPast(this.winners_date));
      },
      hasEnded: function() {
        return !!(this.hasEndDate() && inPast(this.end_date));
      },
      votingEnabled: function() {
        return !!(this.voting_start_date && this.voting_end_date);
      },
      hasSubmissionDeadline: function() {
        return !!(this.submission_end_date);
      },
      hasWinnersPhase: function() {
        return !!(this.winners_date);
      },
      hasEndDate: function() {
        return !!(this.end_date);
      }
    }
  };

  function Opportunity(json) {
    extend(this, json);
    OpportunityDates.initialize(this);
  }
  extend(Opportunity.prototype, OpportunityDates.methods);
  Opportunity.prototype.getUrl = function() {
    if (this.competition_level === 'project') {
      return ENV.dorianEndpoint + "/projects/" + this.slug;
    } else {
      return ENV.dorianEndpoint + "/opportunities/" + this.slug;
    }
  };

  function OpportunitySeries(json) {
    extend(this, json);
    OpportunityDates.initialize(this);
    this.opportunities = this.opportunities.map(function(json) {
      return new Opportunity(json);
    });
    this.image_urls = { };
  }
  extend(OpportunitySeries.prototype, OpportunityDates.methods);
  OpportunitySeries.prototype.getUrl = function() {
    return ENV.dorianEndpoint + '/opportunity-series/' + this.slug;
  };


  return {
    Opportunity: Opportunity,
    OpportunitySeries: OpportunitySeries
  };
};

function inFuture(date) {
  var now = new Date();
  if (!(date instanceof Date)) date = new Date(date);
  return date > now;
}
function inPast(date) {
  var now = new Date();
  if (!(date instanceof Date)) date = new Date(date);
  return now >= date;
}
