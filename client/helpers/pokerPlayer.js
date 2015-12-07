Template.pokerPlayer.helpers({
  'player': function() {
    var obj = PokerGame.findOne({});

    return obj[Session.get('group')];
  },

  'pokerTurn': function() {
    var obj = PokerGame.findOne({});

    if (obj.currentPlayer === Session.get('group')) {
      return true
    } else {
      return false
    }
  },

});

Template.pokerPlayer.events({
  'click #enterAnswer': function(e) {

    Meteor.call('pokerSubmit');
  },

  'click .deal-card': function(event) {
    Meteor.call('dealCard');
  },

  'click .btn-poker': function(eve) {
    var userAction = $(eve.currentTarget).data('action');

    if (userAction === 'fold') {
      Meteor.call('fold', Meteor.user()._id);
    }
  }
})