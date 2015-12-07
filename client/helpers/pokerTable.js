Template.pokerTable.helpers({
});

Template.pokerTable.events({
  'click .btn-deal': function() {
    Meteor.call('dealCards');
  },

  'click .btn-reset': function() {
    Meteor.call('resetCards');
  }
})