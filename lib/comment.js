var extend = require('./extend');

module.exports = function(ENV) {

  function Comment(json) {
    extend(this, json);
  }

  return Comment;
};
