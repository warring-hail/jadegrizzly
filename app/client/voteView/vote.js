Template.vote.helpers({
  captions: function() {
    return Captions.find({});
  },
  getImage: function() {
    var picId = Games.findOne();
    return Photos.findOne({photoID: picId.photoID});
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
  var userId = Session.get('currentPlayerID');
  var caption = Captions.findOne({_id: captionId});

  return userId === caption.playerID;
};

/**
 * Helpers for each Caption
 */

Template.onecaption.helpers({
  upStyle: function() {
    var userId = Session.get('currentPlayerID');
    return hasUpVoted(userId, this._id);
  },
  downStyle: function() {
    var userId = Session.get('currentPlayerID');
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
  console.log('upVoted');
};

var removeUpVote = function(id, userId) {
  Meteor.call('captionsUpsert', id, {$inc: {upvoteCount: -1}});
  Meteor.call('captionsUpsert', id, {$pull: {upvoteUsers: userId}});
  console.log('removed upvote');
};

var downVote = function(id, userId) {
  Meteor.call('captionsUpsert', id, {$inc: {downvoteCount: 1}});
  Meteor.call('captionsUpsert', id, {$push: {downvoteUsers: userId}});
  console.log('downvoted');
};

var removeDownVote = function(id, userId) {
  Meteor.call('captionsUpsert', id, {$inc: {downvoteCount: -1}});
  Meteor.call('captionsUpsert', id, {$pull: {downvoteUsers: userId}});
  console.log('removed downvote');
};

// Conditionals for handling voting clicks

Template.onecaption.events({
  'click i.voteButton': function(evt, template) {
    var stateCheck = Games.findOne().stateID;
    if (stateCheck === 2) {
      var userId = Session.get('currentPlayerID');
      var captionId = this._id;
      var upVoteCheck = hasUpVoted(userId, captionId);
      var downVoteCheck = hasDownVoted(userId, captionId);
      var ownCaption = ownCaptionCheck(captionId);
      var voteType = evt.target.id;

      if (voteType === 'upvote') {
        // Clicked upvote button
        if (!ownCaption) {
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
        if (!ownCaption) {
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
