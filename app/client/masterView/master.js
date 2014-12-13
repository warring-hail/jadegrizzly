// set up forced routing for users based off of the Game state status in the collection
var stateRedirect = function(num) {
  var STATE_PATHS = ['pending', 'input', 'vote', 'results'];
  Router.go('/' + STATE_PATHS[num]);
};

Tracker.autorun(function() {
  var gameInfo = Games.findOne();
  var host = Session.get('host');

  if (gameInfo) {
    if (!host) {
      Router.go('/s' + gameInfo.stateID);
    }
  }
});
