/* global stateRedirect: true */
stateRedirect = function(num) {
  var STATE_PATHS = ['pending', 'input', 'vote', 'results'];
  Router.go('/' + STATE_PATHS[num]);
};

// set up forced routing for users based off of the Game state status in the collection
Tracker.autorun(function() {
  var stateNum = Games.findOne().stateID;
  var host = Session.get('host');

  if (stateNum) {
    if (!host) {
      stateRedirect(stateNum);
    }
  }
});
