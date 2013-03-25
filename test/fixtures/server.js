var port = process.env.INDABA_TEST_PORT;
var MAX_OFFSET = parseInt(process.env.MAX_OFFSET, 10);

var express = require('express');
var app = express();

app.use(function(req, resp, next) {
  if (req.query.offset && req.query.offset >= MAX_OFFSET) {
    resp.json(require('./empty.json'));
  }
  else {
    next();
  }
});

function fixtureResponse(req, resp) {
  resp.json(require('.' + req.path));
}

function okResponse(req, resp) {
  resp.json({status: 'success'});
}

app.get('/users', fixtureResponse);
app.get('/whoami', fixtureResponse);

app.get('/users/:user_id/follows', function(req, resp) {
  resp.json(require('./users'));
});
app.get('/users/:user_id/followers', function(req, resp) {
  resp.json(require('./users'));
});

app.post('/users/:user_id/follow', okResponse);
app.post('/users/:user_id/unfollow', okResponse);

app.get('*', function(req, res){
  console.error('\nno GET:', req.path);
  res.send(404);
});
app.post('*', function(req, res){
  console.error('\nno POST:', req.path);
  res.send(404);
});

app.listen(port);
console.log('test server on ' + port);
