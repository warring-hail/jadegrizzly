// Create collections

// prevent jshint errors on global variables
/* global Players: true, Photos: true, Captions: true, Games: true */

Players = new Meteor.Collection('players');
Photos = new Meteor.Collection('photos');
Captions = new Meteor.Collection('captions');
Games = new Meteor.Collection('games');

// Initialize dummy db data

Meteor.startup(function() {

  // Comment this line out if you don't want the DB to empty on server restart
  Meteor.call('clearCollections');

  Photos.insert({
    photoID: '0',
    path: 'img1.jpg'
  });
});

// Restrict DB Access.  Currently allowing all types of actions.

Players.allow({
  insert: function(userId, doc) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  }
});

Photos.allow({
  insert: function(userId, doc) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  }
});

Captions.allow({
  insert: function(userId, doc) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  }
});

Games.allow({
  insert: function(userId, doc) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  }
});

// Server methods, currently not performing any restrictions on db methods

Meteor.methods({
  playersInsert: function(doc) {
    Players.insert(doc);
  },

  photosUpsert: function(id, doc) {
    Photos.upsert(id, doc);
  },

  captionsUpsert: function(id, doc) {
    Captions.upsert(id, doc);
  },

  captionsInsert: function(caption, id) {
    Captions.insert({
      playerID: id,
      text: caption,
      upvoteCount: 0,
      downvoteCount: 0,
      upvoteUsers: [],
      downvoteUsers: []
    });
  },

  gamesUpsert: function(id, doc) {
    Games.upsert(id, doc);
  },

  // Function for clearing past data out of collections
  clearCollections: function() {
    var globalObject = global;
    for (var property in globalObject) {
      if (globalObject[property] instanceof Meteor.Collection) {
        globalObject[property].remove({});
      }
    }
  }
});
