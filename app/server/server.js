/**
 * Create Collections
 */

/* global Players: true, Photos: true, Captions: true, Games: true,  */

Players = new Meteor.Collection('players');
Photos = new Meteor.Collection('photos');
Captions = new Meteor.Collection('captions');
Games = new Meteor.Collection('games');

/**
 * Restrict DB Access.  Currently allowing all types of actions.  
 */

Players.allow({
  insert: function (userId, doc) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  }
});


Photos.allow({
  insert: function (userId, doc) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  }
});

Captions.allow({
  insert: function (userId, doc) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  }
});

Games.allow({
  insert: function (userId, doc) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  }
});

/**
 * Server Methods
 */

Meteor.methods({
  playersUpsert: function(id, doc) {
    Players.upsert(id, doc);
  },

  photosUpsert: function(id, doc) {
    Photos.upsert(id, doc);
  },

  captionsUpsert: function(id, doc) {
    Captions.upsert(id, doc);
  },

  gamesUpsert: function(id, doc) {
    Games.upsert(id, doc);
  }

});
