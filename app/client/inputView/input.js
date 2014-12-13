// prevent jshint errors on global variables
/* global Players: true, Photos: true, Captions: true, Games: true */

Players = new Meteor.Collection('players');
Photos = new Meteor.Collection('photos');
Captions = new Meteor.Collection('captions');
Games = new Meteor.Collection('games');

var disableForm = function(message) {
  //disable ability to resubmit
  $('.field').prop('disabled', true);
  $('button').html('Please wait');
  $('div.input').append('<p class="wait">' + message + '</p>');
  // Prevent default form submit
  return false;
};

var stateRedirect = function(num) {
  var STATE_PATHS = ['pending', 'input', 'vote', 'results'];
  Router.go('/' + STATE_PATHS[num]);
};

var playerID = '';

//set playerID if new player; get playerID if old player
if (!sessionStorage.getItem('currentPlayerID')) {
  var count = 10;
  while (count > 0) {
    playerID += Math.floor(Math.random() * 10);
    count -= 1;
  }
  sessionStorage.setItem('currentPlayerID', playerID);
} else {
  playerID = sessionStorage.getItem('currentPlayerID');
}

Template.input.helpers({
  photos: function() {
    var game = Games.findOne();
    if (game) {
      var photoID = game.photoID;
      return Photos.findOne({photoID: photoID});
    }
    return null;
  }
});

Template.input.events({
  'submit .new-caption': function(event) {
    var captions = Captions.find().fetch();
    var found = Boolean(_.findWhere(captions, {playerID: playerID}));
    console.log(found);

    var game = Games.findOne();
    var stateID = game.stateID;
    var atCorrectState = (!game || game.stateID === 1);
    console.log(atCorrectState);

    if (found && atCorrectState) {
      //disable ability to resubmit
      return disableForm('You already submitted a caption<br>Waiting for all submissions');
    } else if (found && !atCorrectState) {
      setTimeout(function() {
        stateRedirect(stateID);
      }, 3000);
      return disableForm('You already submitted a caption<br>Waiting for all submissions');
    } else {
      var caption = event.target.caption.value;
      var name = event.target.name.value;

      var playerObj = {
        playerID: playerID,
        name: name
      };

      //insert player into the Player collection
      Meteor.call('playersInsert', playerObj);

      //insert new caption into the Caption collection
      Meteor.call('captionsInsert', caption, playerID);

      //reset caption input field
      event.target.caption.value = '';
      event.target.name.value = '';

      return disableForm('Waiting for all submissions');
    }
  }
});
