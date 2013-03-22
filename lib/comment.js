var extend = require('./extend');

module.exports = Comment;

function Comment(json) {
  extend(this, json);
}
