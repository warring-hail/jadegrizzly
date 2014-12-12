Template.start.events({
  'click .start-game': function(event) {
    var gameId = Session.get('currentGameId');
    if (gameId) {
      Games.remove(gameId, function(err, id) {
        if (err) { console.log('An error occured:', err); }
      });
    }

    var numPhotos = Photos.find().count();

    // TODO: don't choose a photoID we've already (or at least recently) seen
    var photoID = Math.floor(Math.random() * numPhotos);
    var stateID = 1;
    Session.set('host', true);
    var gameObj = {
      photoID: photoID,
      stateID: stateID
    };

    Games.insert(gameObj, function(err, id) {
      if (err) { console.log('An error occured:', err); }
      Session.set('currentGameId', id);
    });

    Router.go('/navigate');
  }
});
