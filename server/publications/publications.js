Meteor.publish("userDirectory", function() {
  return Meteor.users.find({});
});

Meteor.publish("groupDirectory", function() {
  return Groups.find();
});

Meteor.publish("poker", function() {
  return PokerGame.find();
});