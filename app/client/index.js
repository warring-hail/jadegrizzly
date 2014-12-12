Meteor.startup(function() {
  Meteor.autorun(function() {
    var iconEl = document.createElement('link');
    iconEl.setAttribute('rel', 'img/icon');
    iconEl.setAttribute('href', '/img/favicon.ico');
    iconEl.setAttribute('type', 'image/x-icon');

    var headEl = document.getElementsByTagName('head')[0];
    headEl.appendChild(iconEl);
  })
});
