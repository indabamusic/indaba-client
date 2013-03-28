var superagent = require('superagent');

module.exports = function(ENV) {
  if (!ENV || !ENV.lydianEndpoint) throw new Error("lydianEndpoint is required");
  if (!ENV.dorianEndpoint) throw new Error("dorianEndpoint is required");

  var client = {};
  client.ENV = ENV;

  // Models
  // ------
  client.Opportunity = require('./lib/opportunity')(ENV).Opportunity;
  client.OpportunitySeries = require('./lib/opportunity')(ENV).OpportunitySeries;
  client.User = require('./lib/user')(ENV);
  client.Submission = require('./lib/submission')(ENV);

  client.get = get;
  client.post = post;

  client.getAll = getAll;
  client.fasterGetAll = fasterGetAll;


  // Get
  // ---
  function get(getConfig, cb) {
    if (!getConfig || !getConfig.path) throw new Error('path is required');
    if (getConfig.all) return getAll(getConfig, cb);
    var urlString = ENV.lydianEndpoint + getConfig.path;
    var request = superagent.get(urlString);
    var query = getConfig.query || {};
    query.access_token = query.access_token || ENV.token;
    request.query(query);
    request.end(function(err, resp) {
      if (err) {
        cb(err);
      } else if (! resp.ok) {
        cb(new Error("http " + resp.status + " " + resp.text));
      } else if (resp.body.status !== 'success') {
        cb(new Error("lydian says " + resp.body.status + ": " + resp.body.message));
      } else {
        var result = resp.body.data;
        result = _cast(getConfig.cast, result);
        if (result && resp.body.total_records) {
          result.totalRecords = resp.body.total_records;
        }
        cb(null, result);
      }
    });
  }

  // getAll
  // ------
  function getAll(getConfig, cb) {
    getConfig.all = false;
    getConfig.query = getConfig.query || {};
    get(getConfig, function(err, page) {
      if (err) return cb(err);
      if (page.length === 0) {
        cb(null, page);
      }
      else {
        getConfig.query.offset = (getConfig.query.offset || 0) + page.length;
        console.log("offset", getConfig.query.offset);
        getAll(getConfig, function(err, nextPage) {
          nextPage.forEach(function(datum) {
            page.push(datum);
          });
          cb(null, page);
        });
      }
    });
  }

  function fasterGetAll(getConfig, cb) {
    getConfig.query = getConfig.query || {};
    getConfig.query.offset = 0;

    var allData = [];
    var finished = false;
    var cursor = 0;
    var numOpen = 0;

    var MAX_OPEN = getConfig.MAX_OPEN || 5;
    var PAGE_SIZE = getConfig.PAGE_SIZE || 50;

    while (numOpen < MAX_OPEN) {
      openRequest(cursor);
      cursor += PAGE_SIZE;
    }

    function openRequest(offset) {
      console.log("offset", offset);
      numOpen += 1;
      getConfig.query.offset = offset;
      getConfig.query.limit = PAGE_SIZE;
      get(getConfig, function(err, page) {
        if (err) return handleError(err);
        if (page.length === 0) {
          finished = true;
        }
        else {
          for (var i = 0; i < page.length; i++) {
            allData[offset + i] = page[i];
          }
        }
        requestFinished();
      });
    }

    function requestFinished() {
      numOpen -= 1;
      if (!finished && numOpen < MAX_OPEN) {
        openRequest(cursor);
        cursor += PAGE_SIZE;
      }
      if (finished && numOpen === 0) {
        cb(null, allData);
      }
    }

    function handleError(err) {
      console.error('fuuuuuuuu', err);
      cb(err);
    }

  }

  // Post
  // ----
  function post(postConfig, cb) {
    if (!postConfig || !postConfig.path) throw new Error('path is required');
    if (!ENV.token) throw new Error('token is required');
    var urlString = ENV.lydianEndpoint + postConfig.path;
    var request = superagent.post(urlString);
    request.set('Authorization', "Bearer " + ENV.token);
    request.send(postConfig.body);
    request.end(function(err, resp) {
      if (err) {
        cb(err);
      } else if (! resp.ok) {
        cb(new Error("http " + resp.status + " " + resp.text));
      } else if (resp.body.status !== 'success') {
        cb(new Error("lydian says " + resp.body.status + ": " + resp.body.message));
      } else {
        cb(null, _cast(postConfig.cast, resp.body.data));
      }
    });
  }


  // whoami
  // ------
  client.whoami = function whoami(cb) {
    var request = {
      path: '/whoami',
      cast: client.User
    };
    get(request, function(err, user) {
      if (err) return cb(err);
      client.currentUser = user;
      cb(null, client.currentUser);
    });
  };



  /**
   * client.following
   *
   * stores following for current user
   */
  client.following = [];

  client.loadFollowing = function loadFollowing(cb) {
    if (!client.currentUser) cb(new Error('client.currentUser is required. Call client.whoami first.'));
    var request = {
      path: "/users/" + client.currentUser.slug + "/follows",
      cast: client.User,
      all: true
    };
    get(request, function(err, following) {
      if (err) return cb(err);
      following.forEach(function(item) {
        client.following.push(item);
      });
      cb(null);
    });
  };

  client.isFollowing = function(user) {
    var index = _indexOfId(client.following, user.id);
    return (index > -1);
  };

  client.follow = function follow(user, cb) {
    var request = {
      path: "/users/" + user.slug + "/follow"
    };
    post(request, function(err) {
      if (err) {
        return cb(err);
      }
      client.following.push(user);
      cb(null);
    });
  };

  client.unfollow = function unfollow(user, cb) {
    var request = {
      path: "/users/" + user.slug + "/unfollow"
    };
    post(request, function(err) {
      if (err) return cb(err);
      var index = _indexOfId(client.following, user.id);
      if (index > -1) {
        client.following.splice(index, 1);
      }
      cb(null);
    });
  };


  client.followers = [];
  client.loadFollowers = function(cb) {
    if (!client.currentUser) cb(new Error('client.currentUser is required. Call client.whoami first.'));
    var request = {
      path: "/users/" + client.currentUser.slug + "/followers",
      cast: client.User,
      all: true
    };
    get(request, function(err, data) {
      if (err) return cb(err);
      data.forEach(function(item) {
        client.followers.push(item);
      });
      cb(null);
    });
  };
  client.isFollowedBy = function(user) {
    return (client.followers.indexOf(user) > -1);
  };

  /**
   * enteredOpportunities
   *
   */

  client.enteredOpportunities = [];

  client.loadEnteredOpportunities = function(cb) {
    var request = {
      path: "/whoami/entered_opportunities",
      cast: client.Opportunity,
      all: true
    };
    get(request, function(err, data) {
      if (err) return cb(err);
      data.forEach(function(item) {
        client.enteredOpportunities.push(item);
      });
      cb(null);
    });
  };

  client.enterOpportunity = function(opp, cb) {
    var request = {
      path: "/opportunities/" + opp.slug + "/enter"
    };
    post(request, function(err) {
      if (err) return cb(err);
      client.enteredOpportunities.push(opp);
      cb(null);
    });
  };

  client.isEntered = function(opp, cb) {
    return (_indexOfId(client.enteredOpportunities, opp.id) > -1);
  };


  /**
   * Voting
   *
   */

  client.votedSubmissions = [];

  client.loadVotedSubmissions = function(query, cb) {
    if (!cb) {
      cb = query;
      query = {};
    }
    var request = {
      path: "/whoami/voted_submissions",
      query: query,
      cast: client.Submission,
      all: true
    };
    get(request, function(err, data) {
      data.forEach(function(item) {
        client.votedSubmissions.push(item);
      });
      cb(null);
    });
  };

  client.vote = function(submission, cb) {
    if (!ENV.facebookToken) return cb(new Error("client.ENV.facebookToken is required"));
    var request = {
      path: "/submissions/" + submission.id + "/vote",
      body: {
        facebook_token: client.ENV.facebookToken
      }
    };
    post(request, function(err) {
      if (err) return cb(err);
      client.votedSubmissions.push(submission);
      cb(null);
    });
  };

  client.unvote = function(submission, cb) {
    if (!ENV.facebookToken) return cb(new Error("client.ENV.facebookToken is required"));
    var request = {
      path: "/submissions/" + submission.id + "/unvote",
      body: {
        facebook_token: client.ENV.facebookToken
      }
    };
    post(request, function(err) {
      if (err) return cb(err);
      var index = _indexOfId(client.votedSubmissions, submission.id);
      if (index > -1) {
        client.votedSubmissions.splice(index, 1);
      }
      cb(null);
    });
  };

  client.hasVotedFor = function(submission, cb) {
    var index = _indexOfId(client.votedSubmissions, submission.id);
    return (index > -1);
  };


  // Public Interface
  // ----------------
  return client;


  // Util
  // ----

  function _cast(Model, data) {
    if (!Model) return data;
    if (Array.isArray(data)) {
      return data.map(function(datum) {
        return new Model(datum);
      });
    }
    else {
      return new Model(data);
    }
  }


  function _indexOfId(array, id) {
    for (var i = 0; i < array.length; ++i) {
      var item = array[i];
      if (item.id == id) {
        return i;
      }
    }
    return -1;
  }
};
