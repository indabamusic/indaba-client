var extend = require('./extend');

module.exports = function(config) {
  if (!config || !config.dorianEndpoint) throw new Error("dorianEndpoint is required");

  function User(json) {
    extend(this, json);
  }

  User.prototype.profileUrl = function() {
    return config.dorianEndpoint + '/people/' + this.slug;
  };

  return User;
};
