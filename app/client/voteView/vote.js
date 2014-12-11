/**
 * Photo View Helpers
 */

Template.vote.helpers({
  captions: function() {
    console.log(Captions.find({}).fetch());
    return Captions.find({});

  },
  getImage: function() {
    // console.log('getImage');
    var picId = Games.findOne();
    return Photos.findOne({photoID: picId.photoID});
  }
});

Template.vote.events({
  'change #gameState': function(evt, template) {
    var statePath = evt.target.gameState.value;
    Router.go('/' + statePath);
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
  }
});

// Has downvoted
  // Upvote click 
  // Downvote click [Need to move to disabled]
// Has not downvoted
  // Upvote click
  // Downvote click
// Has upvoted
  // Upvote click [Need to undo and switch to disabled]
  // Downvote click
// Has not upvoted
  // Upvote click
  // Downvote click


Template.onecaption.events({
  'click div.upvote': function(evt, template) {
    var userId = Session.get('currentPlayerID');

    var ownCaption = ownCaptionCheck(this._id);
    if (!ownCaption) {
      var upVoteCheck = hasUpVoted(userId, this._id);
      var downVoteCheck = hasDownVoted(userId, this._id);
      if (downVoteCheck) {
        // Has downvoted already
        Meteor.call('captionsUpsert', this._id, {$inc: {downvoteCount: -1}});
        Meteor.call('captionsUpsert', this._id, {$pull: {downvoteUsers: userId}});
        console.log('removed downvote');
      } else if (!upVoteCheck) {
        // Has not upvoted already
        console.log('upVoted');
        Meteor.call('captionsUpsert', this._id, {$inc: {upvoteCount: 1}});
        Meteor.call('captionsUpsert', this._id, {$push: {upvoteUsers: userId}});
      }
      else {
        // Has already upvoted, remove their upvote
        Meteor.call('captionsUpsert', this._id, {$inc: {upvoteCount: -1}});
        Meteor.call('captionsUpsert', this._id, {$pull: {upvoteUsers: userId}});
        console.log('removed upvote');
      }
    } else {
      console.log('prevented upvote on own caption');
    }
  },

  'click div.downvote': function(evt, template) {
    var userId = Session.get('currentPlayerID');
    var ownCaption = ownCaptionCheck(this._id);
    console.log(ownCaption);
    if (!ownCaption) {
      var upVoteCheck = hasUpVoted(userId, this._id);
      var downVoteCheck = hasDownVoted(userId, this._id);
      if (upVoteCheck) {
        // Has upvoted already
        Meteor.call('captionsUpsert', this._id, {$inc: {upvoteCount: -1}});
        Meteor.call('captionsUpsert', this._id, {$pull: {upvoteUsers: userId}});
        console.log('removed upvote');
      } else if (!downVoteCheck) {
        // Has not downvoted already
        console.log('downvoted');
        Meteor.call('captionsUpsert', this._id, {$inc: {downvoteCount: 1}});
        Meteor.call('captionsUpsert', this._id, {$push: {downvoteUsers: userId}});
      } else {
        // Has already downvoted, remove their downvote
        Meteor.call('captionsUpsert', this._id, {$inc: {downvoteCount: -1}});
        Meteor.call('captionsUpsert', this._id, {$pull: {downvoteUsers: userId}});
        console.log('removed downvote');
      }
    } else {
      console.log('prevented downvote on own caption');
    }
  }
});
