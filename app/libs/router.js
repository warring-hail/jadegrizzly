// set default template for all routes
Router.configure({
  layoutTemplate: 'master'
});

// redirect from the root to the input view
Router.route('/', function() {
  this.render('pending');
});

// host views
Router.route('/start', function() {
  this.render('start');
});

Router.route('/navigate', function() {
  this.render('navigate');
});

// player views
Router.route('/pending', function() {
  this.render('pending');
});

Router.route('/s0', function() {
  Router.go('/pending');
});

Router.route('/input', function() {
  this.render('input');
});

Router.route('/s1', function() {
  Router.go('/input');
});

Router.route('/vote', function() {
  this.render('vote');
});

Router.route('/s2', function() {
  Router.go('/vote');
});

Router.route('/results', function() {
  this.render('results');
});

Router.route('/s3', function() {
  Router.go('/results');
});

// default route for invalid URL
Router.route(/\S+/i, function() {
  Router.go('/');
});
