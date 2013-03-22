var extend = require('./extend');

module.exports = function(ENV) {
  if (!ENV || !ENV.dorianEndpoint) throw new Error("dorianEndpoint is required");

  function User(json) {
    extend(this, json);
  }

  User.prototype.profileUrl = function() {
    return ENV.dorianEndpoint + '/people/' + this.slug;
  };

  return User;
};
