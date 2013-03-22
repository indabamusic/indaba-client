var superagent = require('superagent');

module.exports = function(ENV) {
  if (!ENV || !ENV.lydianEndpoint) throw new Error("lydianEndpoint is required");
  if (!ENV.dorianEndpoint) throw new Error("dorianEndpoint is required");

  var client = {};
  client.ENV = ENV;

  // Models
  // ------
  client.Opportunity = require('./lib/opportunity')(ENV).Opportunity;
  client.OpportunitySeries = require('./lib/opportunity')(ENV).OpportunitySeries;
  client.User = require('./lib/user')(ENV);

  client.get = get;
  client.post = post;


  // Get
  // ---
  function get(getConfig, cb) {
    if (!getConfig || !getConfig.path) throw new Error('path is required');
    if (getConfig.all) return getAll(getConfig, cb);
    var urlString = ENV.lydianEndpoint + getConfig.path;
    var request = superagent.get(urlString);
    var query = getConfig.query || {};
    query.access_token = query.access_token || ENV.token;
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
        result = _cast(getConfig.cast, result);
        if (result && resp.body.total_records) {
          result.totalRecords = resp.body.total_records;
        }
        cb(null, result);
      }
    });
  }

  function getAll(getConfig, cb) {
    getConfig.all = false;
    getConfig.query = getConfig.query || {};
    get(getConfig, function(err, page) {
      if (err) return cb(err);
      if (page.length === 0) {
        cb(null, page);
      }
      else {
        getConfig.query.offset = (getConfig.query.offset || 0) + page.length;
        getAll(getConfig, function(err, nextPage) {
          nextPage.forEach(function(datum) {
            page.push(datum);
          });
          cb(null, page);
        });
      }
    });
  }

  // Post
  // ----
  function post(postConfig, cb) {
    if (!postConfig || !postConfig.path) throw new Error('path is required');
    if (!ENV.token) throw new Error('token is required');
    var urlString = ENV.lydianEndpoint + postConfig.path;
    var request = superagent.post(urlString);
    request.set('Authorization', "Bearer " + ENV.token);
    request.send(postConfig.body);
    request.end(function(err, resp) {
      if (err) {
        cb(err);
      } else if (! resp.ok) {
        cb(new Error("http " + resp.status + " " + resp.text));
      } else if (resp.body.status !== 'success') {
        cb(new Error("lydian says " + resp.body.status + ": " + resp.body.message));
      } else {
        result = _cast(postConfig.cast, result);
        cb(null, resp.body.data);
      }
    });
  }


  client.whoami = function whoami(cb) {
    var request = {
      path: '/whoami',
      cast: client.User
    };
    get(request, function(err, user) {
      if (err) return cb(err);
      client.currentUser = user;
      cb(null, client.currentUser);
    });
  };


  // Public Interface
  // ----------------
  return client;


  // Util
  // ----

  function _cast(model, data) {
    if (!model) return data;
    if (Array.isArray(data)) {
      return data.map(function(datum) {
        return new model(datum);
      });
    }
    else {
      return new model(data);
    }
  }

};
