// prevent jshint errors on global variables
/* global Players: true, Photos: true, Captions: true, Games: true */

Players = new Meteor.Collection('players');
Photos = new Meteor.Collection('photos');
Captions = new Meteor.Collection('captions');
Games = new Meteor.Collection('games');

var playerID = '';

var generatePlayerID = function() {
  var count = 10;
  while (count > 0) {
    playerID += Math.floor(Math.random() * 10);
    count -= 1;
  }
};

generatePlayerID();

//set playerID to the Session
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

    //Set name to the session
    Session.set('name', name);

    //insert new caption to the Caption collection
    Meteor.call('captionsInsert', Session.get('PlayerID'), caption);

    //reset caption input field
    event.target.caption.value = '';
    event.target.name.value = '';

    // Prevent default form submit
    return false;
  }

  // "click .navigate-vote": function(event){
  //   Games.update(this._id,{$set: stateID: 'vote'});
  //   Router.go('/vote');
  // }
});
