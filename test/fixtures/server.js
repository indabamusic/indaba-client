var port = process.env.INDABA_TEST_PORT;
var MAX_OFFSET = parseInt(process.env.MAX_OFFSET, 10);

var express = require('express');
var app = express();

function fixtureResponse(req, resp) {
  if (req.query.offset && req.query.offset >= MAX_OFFSET) {
    resp.json(require('./empty.json'));
  }
  else {
    resp.json(require('.' + req.path));
  }
}

app.get('/users', fixtureResponse);
app.get('/whoami', fixtureResponse);

app.listen(port);
console.log('test server on ' + port);
