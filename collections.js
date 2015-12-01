Groups = new Mongo.Collection('groups', {idGeneration: 'STRING'});

if (Groups.find().count() == 0) {
  Groups.insert({});
}
