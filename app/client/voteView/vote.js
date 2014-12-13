Template.vote.helpers({
  captions: function() {
    return Captions.find({});
  },
  getImage: function() {
    var gameInfo = Games.findOne();
    if (gameInfo) {
      return Photos.findOne({photoID: gameInfo.photoID});
    }
  }
});

var hasUpVoted = function(voterId, captionId) {
  var query = {'_id':captionId, upvoteUsers: {$in: [voterId]}};
  var voteCheck = Captions.findOne(query);
  return (voteCheck !== undefined);
};

var hasDownVoted = function(voterId, captionId) {
  var query = {'_id':captionId, downvoteUsers: {$in: [voterId]}};
  var voteCheck = Captions.findOne(query);
  return (voteCheck !== undefined);
};

var ownCaptionCheck = function(captionId) {
  var userId = sessionStorage.getItem('currentPlayerID');
  var caption = Captions.findOne({_id: captionId});

  return userId === caption.playerID;
};

/**
 * Helpers for each Caption
 */

Template.onecaption.helpers({
  upStyle: function() {
    var userId = sessionStorage.getItem('currentPlayerID');
    return hasUpVoted(userId, this._id);
  },
  downStyle: function() {
    var userId = sessionStorage.getItem('currentPlayerID');
    return hasDownVoted(userId, this._id);
  },
  ownCaption: function() {
    return ownCaptionCheck(this._id);
  }
});

// Helpers for taking action based on upvoting and downvoting

var upVote = function(id, userId) {
  Meteor.call('captionsUpsert', id, {$inc: {upvoteCount: 1}});
  Meteor.call('captionsUpsert', id, {$push: {upvoteUsers: userId}});
};

var removeUpVote = function(id, userId) {
  Meteor.call('captionsUpsert', id, {$inc: {upvoteCount: -1}});
  Meteor.call('captionsUpsert', id, {$pull: {upvoteUsers: userId}});
};

var downVote = function(id, userId) {
  Meteor.call('captionsUpsert', id, {$inc: {downvoteCount: 1}});
  Meteor.call('captionsUpsert', id, {$push: {downvoteUsers: userId}});
};

var removeDownVote = function(id, userId) {
  Meteor.call('captionsUpsert', id, {$inc: {downvoteCount: -1}});
  Meteor.call('captionsUpsert', id, {$pull: {downvoteUsers: userId}});
};

// Conditionals for handling voting clicks

Template.onecaption.events({
  'click i.voteButton': function(evt, template) {
    var stateNum = Games.findOne().stateID;
    if (stateNum !== 2) {
      Router.go('/s' + stateNum);
    } else {
      var userId = sessionStorage.getItem('currentPlayerID');
      var captionId = this._id;
      var upVoteCheck = hasUpVoted(userId, captionId);
      var downVoteCheck = hasDownVoted(userId, captionId);
      var ownCaption = ownCaptionCheck(captionId);
      var voteType = evt.target.id;

      if (voteType === 'upvote') {
        // Clicked upvote button
        if (userId && !ownCaption) {
          if (upVoteCheck) {
            // Has upvoted already, but not downvoted
            removeUpVote(captionId, userId);
          } else if (!downVoteCheck) {
            // Has not downvoted or upvoted
            upVote(captionId, userId);
          } else {
            // Has already downvoted, but not upvoted
            removeDownVote(captionId, userId);
            upVote(captionId, userId);
          }
        }
      } else {
        // Clicked downvote
        if (userId && !ownCaption) {
          if (downVoteCheck) {
            // Has downvoted already
            removeDownVote(captionId, userId);
          } else if (!upVoteCheck) {
            // Has not upvoted, but has downvoted
            downVote(captionId, userId);
          }
          else {
            // Has upvoted, but not downvoted
            removeUpVote(captionId, userId);
            downVote(captionId, userId);
          }
        }
      }
    }
  }
});
