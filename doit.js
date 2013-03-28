var assert = require('assert');

var Batch = require('batch');

var indaba = require('./index')({
  lydianEndpoint: 'https://lydian.indabamusic.com',
  dorianEndpoint: 'https://beta.indabamusic.com',
});

var opp, path;
opp = 'electronica-oasis-indaba-music-spotlight-5';
opp = 'magnetic-music-festival-performance-opportunity';
path = '/opportunities/' + opp + '/submissions';


var batch = new Batch();
batch.concurrency(1);

var configs = [
  {
    path: path
  },
  {
    path: path,
    MAX_OPEN: 8,
  },
  {
    path: path,
    MAX_OPEN: 15,
  },
  {
    path: path,
    MAX_OPEN: 1,
    PAGE_SIZE: 25,
  },
];

configs.forEach(function(config) {
  var description = JSON.stringify(config);
  batch.push(function(done) {
    var timer = makeTimer(description, done);
    indaba.fasterGetAll(config, timer);
  });
});

batch.end(function(err, stuff) {
  //base case
  var timer = makeTimer('traditional');
  indaba.getAll({path: path}, timer);
});


////

function makeTimer(description, origCallback) {
  var started = new Date();
  return function printerCallback(err, result) {
    var time = new Date() - started;
    console.log(description, 'got', result.length, 'in', time);
    console.log('\n\n');
    if (origCallback) origCallback(err, result);
  };
}
