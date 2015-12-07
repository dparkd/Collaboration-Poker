Template.minigamePlayer.helpers({
  'myGroup': function() {
    return Session.get('group');
  }
});

Template.minigamePlayer.events({
  'click #enterAnswer': function(e) {

    Meteor.call('minigameSubmit');
  },

  'click .choice': function(ev) {
    var userChoice = $(ev.currentTarget).data('choice');

    Meteor.call('checkAnswer', userChoice);
  },

  'click .choose-card': function(ew) {
    var userCard = $(ew.currentTarget).data('card');
    ew.preventDefault();
    $('.modal-backdrop').remove();
    Meteor.call('chooseCard', userCard);
  }
})