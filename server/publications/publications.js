Meteor.publish("userDirectory", function() {
  return Meteor.users.find({});
});

Meteor.publish("groupDirectory", function() {
  return Groups.find();
})