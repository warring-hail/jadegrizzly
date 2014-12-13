// set up forced routing for users based off of the Game state status in the collection
Tracker.autorun(function() {
  var gameInfo = Games.findOne();
  var host = Session.get('host');

  if (gameInfo) {
    if (!host) {
      Router.go('/s' + gameInfo.stateID);
    }
  }
});
