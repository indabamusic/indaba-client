var express = require('express');

var app = express();

app.get('/users', function(req, resp) {
  var data = require('./users.json');
  resp.json(data);
});

app.get('/whoami', function(req, resp) {
  resp.json(require('.' + req.path));
});

var port = process.env.INDABA_TEST_PORT;
app.listen(port);
console.log('test server on ' + port);
