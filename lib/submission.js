var extend = require('./extend');

module.exports = function(ENV) {

  function Submission(json) {
    extend(this, json);
  }

  return Submission;
};
