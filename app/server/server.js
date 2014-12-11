// Create collections

// prevent jshint errors on global variables
/* global Players: true, Photos: true, Captions: true, Games: true */

Players = new Meteor.Collection('players');
Photos = new Meteor.Collection('photos');
Captions = new Meteor.Collection('captions');
Games = new Meteor.Collection('games');


// Function for clearing past data out of collections

var clearCollections = function() {
  var globalObject = global;
  for (var property in globalObject) {
      if(globalObject[property] instanceof Meteor.Collection){
          globalObject[property].remove({});
      }
  }
};

// Initialize dummy db data

Meteor.startup(function(){

  // Comment this line out if you don't want the DB to empty on server restart
  clearCollections();

  Players.insert({
      playerID: '1h3k4l5j6h',
      name: 'dwayne'
    });
  Players.insert({
      playerID: 'k3k4l3l4l3',
      name: 'diane'
    });
  Players.insert({
      playerID: '2k3j4v5n6n',
      name: 'alfonso'
    });
  Players.insert({
      playerID: '374829dhfj',
      name: 'robert'
    });
  Players.insert({
      playerID: 'quwpeui4u3',
      name: 'fred'
    });

  Captions.insert(
    {
      playerID: '1h3k4l5j6h',
      text: ['most cutting thing you can say is "who\'s this clown?"',
      ' because it implies they\'re a) a clown & b) not even one of the better-known clowns'].join(''),
      upvoteCount: 1,
      downvoteCount: 3,
      upvoteUsers: ['1h3k4l5j6h'],
      downvoteUsers: []
    });
  Captions.insert(
    {
      playerID: 'k3k4l3l4l3',
      text: 'How much for the horse tornado? Sir, that\'s a carousel. I must have it.',
      upvoteCount: 2,
      downvoteCount: 2,
      upvoteUsers: ['k3k4l3l4l3', 'quwpeui4u3'],
      downvoteUsers: ['1h3k4l5j6h', '374829dhfj']
    });
    Captions.insert( 
    {
      playerID: '2k3j4v5n6n',
      text: 'Sick of having to go to 2 different huts to buy pizza & sunglasses.',
      upvoteCount: 3,
      downvoteCount: 0,
      upvoteUsers: ['k3k4l3l4l3', 'quwpeui4u3', '1h3k4l5j6h'],
      downvoteUsers: []
    });

  Photos.insert(
    { 
      photoID: '1',
      path: 'img1.jpg',
    });
  Photos.insert({
      photoID: '2',
      path: 'img2.jpg'
    });
    Photos.insert({
      photoID: '3',
      path: 'img3.jpg' 
    });

  Games.insert(
    { 
      stateID: '0',
      photoID: '1'
    }
  );

});

// Restrict DB Access.  Currently allowing all types of actions.  

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

// Server methods, currently not performing any restrictions on db methods

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
