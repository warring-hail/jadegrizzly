/* global Template */

var NUM_PHOTOS = 3;

Template.host.events({
  'click .start-game': function(event) {
    var photoID = Math.floor(Math.random() * 3);

    var gameObj = {
      stateID: 0,
      photoID: photoID
    };

    Meteor.call('clearCollections');
  }
});
