/* global Captions: true, Template: true, Photos: true, Players: true, Games: true */
Players = new Meteor.Collection('players');
Photos = new Meteor.Collection('photos');
Captions = new Meteor.Collection('captions');
Games = new Meteor.Collection('games');

var sortCaptions = function(a, b) {
  return (b.upvoteCount - b.downvoteCount) - (a.upvoteCount - a.downvoteCount);
};

var getWinners = function() {
  var captions = Captions.find({}).fetch();
  captions.sort(sortCaptions);
  return captions;
};

var getScore = function(caption) {
  return caption.upvoteCount - caption.downvoteCount;
};

var getName = function(playerID) {
  var player = Players.findOne({playerID:playerID});
  return player.name;
};

Template.results.helpers({
  winner: function() {
    var winner = getWinners()[0];
    return {
      name: getName(winner.playerID),
      text: winner.text,
      score: getScore(winner)
    };
  },
  runnersUp: function() {
    var runnersUp = getWinners().slice(1,5);
    for ( var i = 0; i < runnersUp.length; i++) {
      runnersUp[i].name = getName(runnersUp[i].playerID);
    }
    return runnersUp;
  },
  photoPath: function() {
    var photo = Games.find({}).fetch();
    var photoID = photo[0].photoID;
    var photoPath = Photos.find({photoID:photoID}).fetch();
    return '/img/'+photoPath[0].path;
  }
});