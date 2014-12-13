// prevent jshint errors on global variables
/* global Players: true, Photos: true, Captions: true, Games: true */

Players = new Meteor.Collection('players');
Photos = new Meteor.Collection('photos');
Captions = new Meteor.Collection('captions');
Games = new Meteor.Collection('games');

var disableSubmit = function(){
  //disable ability to resubmit
  $('field').prop('disabled', true);
  $('button').html('Please wait');
  $('div.input').append('<p class="wait">Waiting for all submissions</p>');
  // Prevent default form submit
  return false;
};

var disableRepeat = function(){
  $('field').prop('disabled', true);
  $('button').html('Please wait');
  $('div.input').append('<p class="wait">You already submitted a caption<br>Waiting for all submissions</p>');
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

    var game = Games.findOne();
    var atCorrectState = (game.stateID === 1);

    if (found && atCorrectState) {
      //disable ability to resubmit
      disableRepeat();
    } else if (found && !atCorrectState) {
      disableRepeat();

      setTimeout(function() {
        stateRedirect(stateID);
      }, 1500);
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

      disableSubmit();
    }
  }
});
