Groups = new Mongo.Collection('groups', {idGeneration: 'STRING'});

// Insert only 1 group if the collection is empty. . . dirty little hack 
if (Groups.find().count() == 0) {
  Groups.insert({});
}

// Create a game collection 
Game = new Mongo.Collection('game', {idGeneration: 'STRING'});
