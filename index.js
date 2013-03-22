var superagent = require('superagent');

module.exports = function(config) {
  if (!config || !config.lydianEndpoint) throw new Error("lydianEndpoint is required");

  function get(urlPath, query, cb) {
    var urlString = config.lydianEndpoint + urlPath;
    var request = superagent.get(urlString);
    query.access_token = config.token;
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
    get: get,
    followUser: followUser
  };

};
