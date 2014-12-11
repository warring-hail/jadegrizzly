// prevent jshint errors on global variables
/* global Players: true, Photos: true, Captions: true, Games: true */

Players = new Meteor.Collection('players');
Photos = new Meteor.Collection('photos');
Captions = new Meteor.Collection('captions');
Games = new Meteor.Collection('games');


var playerID = '';

//generate playerID
(function() {
  var count = 10;
  while (count > 0) {
    playerID += Math.floor(Math.random() * 10);
    count -= 1;
  }
})();

Session.set('PlayerID', playerID);

Template.input.helpers({
  photos: function() {
    var games = Games.find({}).fetch();
    var photoID = games[0].photoID;
    return Photos.findOne({photoID: photoID});
  }
});

Template.input.events({
  'submit .new-caption': function(event) {
    var caption = event.target.caption.value;
    var name = event.target.name.value;

    Session.set('name', name);

    //insert new caption to the Caption collection
    Meteor.call('captionsInsert', Session.get('PlayerID'), caption);

    //reset caption input field
    event.target.caption.value = '';
    event.target.name.value = '';

    // Prevent default form submit
    return false;
  },

  'click .navigate-vote': function(event) {
    var games = Games.find({}).fetch();

    //for testing; remove once state connected
    Meteor.call('gamesUpsert', games[0]._id, {
        $set: {stateID: '1'}
    });
    //=======================================

    if (games[0].stateID === '1') {
      Meteor.call('gamesUpsert', games[0]._id, {
        $set: {stateID: '2'}
      });
      Router.go('/vote');
    }
  }
});
