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

  'click .deal-card': function(e) {
    Meteor.call('dealCard');
  },

  'click .btn-poker': function(e) {
    var userAction = $(e.currentTarget).data('action');

    if (userAction === 'fold') {
      Meteor.call('fold', Session.get('group'));
    }

    if (userAction === 'call') {
      Meteor.call('call', Meteor.user().game.group);
    }

    if (userAction === 'check') {
      Meteor.call('check');
    }
  },

  'click .submit-bet': function(e, template) {
    e.preventDefault();
    var betAmt = template.find('#betAmt').value;
    $('.modal-backdrop').remove();
    Meteor.call('bet', Meteor.user().game.group, betAmt);
  }, 
})