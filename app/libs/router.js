// set default template for all routes
Router.configure({
  layoutTemplate: 'master'
});

// redirect from the root to the input view
Router.route('/', function() {
  this.render('input');
});

// handle routing for each view
Router.route('/start', function() {
  this.render('start');
});

Router.route('/navigate', function() {
  this.render('navigate');
});

Router.route('/input', function() {
  this.render('input');
});

Router.route('/vote', function() {
  this.render('vote');
});

Router.route('/results', function() {
  this.render('results');
});

// default route for invalid URL
Router.route(/\S+/i, function() {
  Router.go('/');
});
