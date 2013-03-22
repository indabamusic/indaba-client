var extend = require('./extend');

module.exports = Submission;

function Submission(json) {
  extend(this, json);
}
