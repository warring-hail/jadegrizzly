// prevent jshint errors on global variables
/* global Players: true, Photos: true, Captions: true, Games: true */

Players = new Meteor.Collection('players');
Photos = new Meteor.Collection('photos');
Captions = new Meteor.Collection('captions');
Games = new Meteor.Collection('games');

var playerID = '';
var gameID = Games.findOne()._id;

//set playerID if new player; get playerID if old player
if (!sessionStorage.getItem('currentPlayerID')) {
  (function() {
    var count = 10;
    while (count > 0) {
      playerID += Math.floor(Math.random() * 10);
      count -= 1;
    }
  })();
  sessionStorage.setItem('currentPlayerID', playerID);
} else {
  playerID = sessionStorage.getItem('currentPlayerID');
}
console.log('playerID:', playerID)


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
    console.log(captions)
    var found = false;

    _.each(captions, function(caption){
      if (caption.playerID === playerID) {
        found = true;
      }
    });

    var game = Games.findOne();
    var atCorrectState = true;
    console.log(game)
    if (game) {
      var stateID = game.stateID;
      console.log(stateID)
      if (stateID !== 1) {
        atCorrectState = false;
      }
    }

    console.log(found, atCorrectState)
    if (found === true && atCorrectState === true) {
      console.log('trying to cheat the game')
    //disable ability to resubmit
      $('input').prop('disabled', true);
      $('textarea').prop('disabled', true);
      $('button').prop('disabled', true);
      $('button').html('Please wait');
      $('div.input').append('<p class="wait">You already submitted a caption<br>Waiting for all submissions</p>');
      return false;
    } else if (found === true && atCorrectState === false) {
      $('input').prop('disabled', true);
      $('textarea').prop('disabled', true);
      $('button').prop('disabled', true);
      $('button').html('Please wait');
      $('div.input').append('<p class="wait">You already submitted a caption<br>Waiting for all submissions</p>');

      setTimeout(function(){
        //called from global master file
        stateRedirect(stateID);
      }, 1500);

      return false;
    } else {
      console.log('first pass')
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

      //disable ability to resubmit
      $('input').prop('disabled', true);
      $('textarea').prop('disabled', true);
      $('button').prop('disabled', true);
      $('button').html('Please wait');
      $('div.input').append('<p class="wait">Waiting for all submissions</p>');

      // Prevent default form submit
      return false;
    }
  }
});
