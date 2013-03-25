var express = require('express');

var app = express();

app.get('/users', function(req, resp) {
  var data = require('./users.json');
  resp.json(data);
});

var port = 9999;
app.listen(port);
console.log('test server on ' + port);
