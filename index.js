var superagent = require('superagent');

module.exports = function(config) {
  if (!config || !config.lydianEndpoint) throw new Error("lydianEndpoint is required");

  var Opportunity = require('./lib/opportunity')(config).Opportunity;
  var OpportunitySeries = require('./lib/opportunity')(config).OpportunitySeries;
  var User = require('./lib/user')(config);

  function get(getRequest, cb) {
    if (!getRequest || !getRequest.path) throw new Error('path is required');
    var urlString = config.lydianEndpoint + getRequest.path;
    var request = superagent.get(urlString);
    var query = getRequest.query || {};
    query.access_token = query.access_token || config.token;
    request.query(query);
    request.end(function(err, resp) {
      if (err) {
        cb(err);
      } else if (! resp.ok) {
        cb(new Error("http " + resp.status + " " + resp.text));
      } else if (resp.body.status !== 'success') {
        cb(new Error("lydian says " + resp.body.status + ": " + resp.body.message));
      } else {
        var result = resp.body.data;
        if (getRequest.cast && Array.isArray(result)) {
          result = result.map(function(datum) {
            return new getRequest.cast(datum);
          });
        }
        else if (getRequest.cast) {
          result = new getRequest.cast(result);
        }
        if (result && resp.body.total_records) {
          result.totalRecords = resp.body.total_records;
        }
        cb(null, result);
      }
    });
  }

  function followUser(user, cb) {
    var path = "/users/" + user.slug + "/follow";
    var query = {access_token: token};
    indaba.lydianGet(path, query, cb);
  }


  return {
    Opportunity: Opportunity,
    OpportunitySeries: OpportunitySeries,
    User: User,

    get: get,
    followUser: followUser
  };

};
