var port = process.env.INDABA_TEST_PORT;
var MAX_OFFSET = parseInt(process.env.MAX_OFFSET, 10);

var express = require('express');
var fs = require('fs');
var app = express();

app.use(function(req, resp, next) {
  if (req.query.offset && req.query.offset >= MAX_OFFSET) {
    resp.json(fixture('empty'));
  }
  else {
    next();
  }
});

function fixture(name) {
  return require('../fixtures/' + name);
}
function okResponse(req, resp) {
  resp.json({status: 'success'});
}

// in_browser
app.use(express.static(__dirname + '/../../build'));
app.get('/in_browser', function(req, resp) {
  fs.createReadStream('./in_browser.html').pipe(resp);
});

// Gets
// ----

app.get('/users', function(req, resp) {
  resp.json(fixture('users'));
});
app.get('/users/:user_id/follows', function(req, resp) {
  resp.json(fixture('users'));
});
app.get('/users/:user_id/followers', function(req, resp) {
  resp.json(fixture('users'));
});

app.get('/whoami', function(req, resp) {
  resp.json(fixture('whoami'));
});
app.get('/whoami/entered_opportunities', function(req, resp) {
  resp.json(fixture('opportunities'));
});
app.get('/whoami/voted_submissions', function(req, resp) {
  resp.json(fixture('submissions'));
});

// Posts
// -----

app.post('/users/:user_id/follow', okResponse);
app.post('/users/:user_id/unfollow', okResponse);
app.post('/opportunities/:opportunity_id/enter', okResponse);
app.post('/submissions/:id/vote', okResponse);
app.post('/submissions/:id/unvote', okResponse);

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
