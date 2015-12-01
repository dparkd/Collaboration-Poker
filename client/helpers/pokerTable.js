Template.pokerTable.helpers({
  'users': function() {
    return Meteor.users.find();
  },

  'groups': function() {
    return Groups.findOne();
  }
});