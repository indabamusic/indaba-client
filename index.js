var superagent = require('superagent');

module.exports = IndabaClient;

function IndabaClient(config) {
  if (!config || !config.lydianEndpoint) throw new Error("lydianEndpoint is required");
  this.config = config;
}

IndabaClient.prototype.get = function(urlPath, query, cb) {
  var urlString = this.config.lydianEndpoint + urlPath;
  var request = superagent.get(urlString);
  query.access_token = this.config.token;
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
};

IndabaClient.prototype.followUser = function(user, cb) {
  var path = "/users/" + user.slug + "/follow";
  var query = {access_token: token};
  indaba.lydianGet(path, query, cb);
};

