var assert = require('assert');

var indaba = require('./index')({
  lydianEndpoint: 'https://lydian.indabamusic.com',
  dorianEndpoint: 'https://beta.indabamusic.com',
});

var opp = 'electronica-oasis-indaba-music-spotlight-5';
opp = 'magnetic-music-festival-performance-opportunity';

var results1, results2;
var path = '/opportunities/' + opp + '/submissions';

// run 1
var start1 = new Date();
indaba.getAll({path: path}, function(err, results) {
  results1 = results;
  var end1 = new Date();
  console.log("run1", end1 - start1);
  compare();
});

// run 2
var start2 = new Date();
indaba.fasterGetAll({path: path}, function(err, results) {
  results2 = results;
  var end2 = new Date();
  console.log("run2", end2 - start2);
  compare();
});



function compare() {
  if (results1 && results2) {
    for (var i = 0; i < results1.length; i++) {
      assert.equal(results1[i].id, results2[i].id);
    }
  }
}

