var STATE_ID_TO_TEXT = [
  'Pending...',
  'Accepting Captions...',
  'Voting Underway...',
  'Showing Results'
];
var MAX_STATE_ID = STATE_ID_TO_TEXT.length - 1;

Template.navigate.helpers({
  gameState: function() {
    var gameId = Session.get('currentGameId');
    var game = Games.findOne(gameId);
    var stateID = game ? game.stateID : 0;
    return STATE_ID_TO_TEXT[stateID];
  }
});

Template.navigate.events({
  'click .previous': function(event, template) {
    var gameId = Session.get('currentGameId');
    var game = Games.findOne(gameId);
    if (game.stateID > 0) {
      Meteor.call('gamesUpsert', gameId, {$inc: {stateID: -1}});
    }
  },

  'click .next': function(event, template) {
    var gameId = Session.get('currentGameId');
    var game = Games.findOne(gameId);
    if (game.stateID < MAX_STATE_ID) {
      Meteor.call('gamesUpsert', gameId, {$inc: {stateID: 1}});
    }
  },

  'click .ask-reset': function(event, template) {
    $('.reset').toggleClass('hidden');
  },

  'click button.reset': function(event, template) {
    var gameId = Session.get('currentGameId');
    Meteor.call('gamesUpsert', gameId, {stateID: 0});
    Router.go('/start');
  }
});
