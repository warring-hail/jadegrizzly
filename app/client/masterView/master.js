// set up forced routing for users based off of the Game state status in the collection
Tracker.autorun(function() {
  var gameData = Games.findOne();
  var host = Session.get('host');
  var statePaths = ['pending', 'input', 'vote', 'results'];

  if (gameData) {
    var stateNum = gameData.stateID;
    if (!host) {
      Router.go('/' + statePaths[stateNum]);
    }
  }
});
