// Get the score for the caption and handle edge case if values don't exist
var getScore = function(caption) {
  var upvoteCount = caption.upvoteCount || 0;
  var downvoteCount = caption.downvoteCount || 0;
  return upvoteCount - downvoteCount;
};

// Sort function to rank captions from highest to lowest votes
var sortCaptions = function(a, b) {
  return getScore(b) - getScore(a);
};

// Return all the captions, sorted by number of votes
var getWinners = function() {
  var captions = Captions.find({}).fetch();
  captions.sort(sortCaptions);
  return captions;
};

// Use the playerID to find the name of the player
var getName = function(playerID) {
  var player = Players.findOne({playerID:playerID});
  if (player) {
    return player.name ? player.name : 'Anonymous';
  }
  return 'Anonymous';
};

Template.results.helpers({
  // Return info for the winning caption
  winner: function() {
    var winner = getWinners()[0];
    return {
      name: getName(winner.playerID),
      text: winner.text,
      score: getScore(winner)
    };
  },
  // Return info for all the runners up
  runnersUp: function() {
    var runnersUp = getWinners().slice(1, 5);
    for (var i = 0; i < runnersUp.length; i++) {
      runnersUp[i].name = getName(runnersUp[i].playerID);
    }
    return runnersUp;
  },
  // Return the path of the active photo
  photoPath: function() {
    var photo = Games.find({}).fetch();
    var photoID = photo[0].photoID;
    var photoPath = Photos.find({photoID:photoID}).fetch();
    return '/img/' + photoPath[0].path;
  }
});

Template.runnerUp.helpers({
  // Return the score for runners up, setting any negative votes counts to 0
  score: function() {
    var score = this.upvoteCount - this.downvoteCount;
    if (isNaN(score) || score < 0) {
      return 0;
    } else {
      return score;
    }
  }
});
