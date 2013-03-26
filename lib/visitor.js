module.exports = function(indaba, token) {

  var visitor = {
    indaba: indaba,
    token: token
  };

  // whoami
  // ------
  visitor.whoami = function whoami(cb) {
    var request = {
      path: '/whoami',
      token: token,
      cast: indaba.User
    };
    indaba.get(request, function(err, user) {
      if (err) return cb(err);
      visitor.currentUser = user;
      cb(null, visitor.currentUser);
    });
  };



  /**
   * visitor.following
   *
   * stores following for current user
   */
  visitor.following = {};

  visitor.loadFollowing = function loadFollowing(cb) {
    if (!visitor.currentUser) cb(new Error('visitor.currentUser is required. Call visitor.whoami first.'));
    var request = {
      path: "/users/" + visitor.currentUser.slug + "/follows",
      cast: indaba.User,
      all: true
    };
    indaba.get(request, function(err, following) {
      if (err) return cb(err);
      following.forEach(function(item) {
        visitor.following[item.id] = item;
      });
      cb(null);
    });
  };

  visitor.isFollowing = function(user) {
    return !!visitor.following[user.id];
  };

  visitor.follow = function follow(user, cb) {
    var request = {
      path: "/users/" + user.slug + "/follow",
      token: token
    };
    indaba.post(request, function(err) {
      if (err) {
        return cb(err);
      }
      visitor.following[user.id] = user;
      cb(null);
    });
  };

  visitor.unfollow = function unfollow(user, cb) {
    var request = {
      path: "/users/" + user.slug + "/unfollow",
      token: token
    };
    indaba.post(request, function(err) {
      if (err) return cb(err);
      visitor.following[user.id] = undefined;
      cb(null);
    });
  };


  visitor.followers = {};
  visitor.loadFollowers = function(cb) {
    if (!visitor.currentUser) cb(new Error('visitor.currentUser is required. Call visitor.whoami first.'));
    var request = {
      path: "/users/" + visitor.currentUser.slug + "/followers",
      cast: indaba.User,
      all: true
    };
    indaba.get(request, function(err, data) {
      if (err) return cb(err);
      data.forEach(function(user) {
        visitor.followers[user.id] = user;
      });
      cb(null);
    });
  };
  visitor.isFollowedBy = function(user) {
    return !!visitor.followers[user.id];
  };

  /**
   * enteredOpportunities
   *
   */

  visitor.enteredOpportunities = {};

  visitor.loadEnteredOpportunities = function(cb) {
    var request = {
      path: "/whoami/entered_opportunities",
      token: token,
      cast: indaba.Opportunity,
      all: true
    };
    indaba.get(request, function(err, data) {
      if (err) return cb(err);
      data.forEach(function(opp) {
        visitor.enteredOpportunities[opp.id] = opp;
      });
      cb(null);
    });
  };

  visitor.enterOpportunity = function(opp, cb) {
    var request = {
      path: "/opportunities/" + opp.slug + "/enter",
      token: token
    };
    indaba.post(request, function(err) {
      if (err) return cb(err);
      visitor.enteredOpportunities[opp.id] = opp;
      cb(null);
    });
  };

  visitor.isEntered = function(opp, cb) {
    return !!visitor.enteredOpportunities[opp.id];
  };


  /**
   * Voting
   *
   */

  visitor.votedSubmissions = {};

  visitor.loadVotedSubmissions = function(query, cb) {
    if (!cb) {
      cb = query;
      query = {};
    }
    var request = {
      path: "/whoami/voted_submissions",
      query: query,
      cast: indaba.Submission,
      all: true
    };
    indaba.get(request, function(err, data) {
      data.forEach(function(item) {
        visitor.votedSubmissions[item.id] = item;
      });
      cb(null);
    });
  };

  visitor.vote = function(submission, cb) {
    if (!visitor.facebookToken) return cb(new Error("visitor.facebookToken is required"));
    var request = {
      path: "/submissions/" + submission.id + "/vote",
      token: token,
      body: {
        facebook_token: visitor.facebookToken
      }
    };
    indaba.post(request, function(err) {
      if (err) return cb(err);
      visitor.votedSubmissions[submission.id] = submission;
      cb(null);
    });
  };

  visitor.unvote = function(submission, cb) {
    if (!visitor.facebookToken) return cb(new Error("visitor.facebookToken is required"));
    var request = {
      path: "/submissions/" + submission.id + "/unvote",
      token: token,
      body: {
        facebook_token: visitor.facebookToken
      }
    };
    indaba.post(request, function(err) {
      if (err) return cb(err);
      visitor.votedSubmissions[submission.id] = undefined;
      cb(null);
    });
  };

  visitor.hasVotedFor = function(submission, cb) {
    return !!visitor.votedSubmissions[submission.id];
  };


  return visitor;

};
