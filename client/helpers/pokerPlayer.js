Template.pokerPlayer.helpers({
  'gamePlay': function() {
    var obj = Groups.findOne({});
    
    if (obj.game.state === 'poker') {
      return true
    } else {
      return false
    }
  },

  'gameReady': function() {
    var obj = Groups.findOne({});

    if (obj.game.ready) {
      return true
    } else {
      return false
    }
  },

  'pokerHand': function() {
    var obj = PokerGame.findOne({});

    return obj[Session.get('group')];
  }
});

Template.pokerPlayer.events({
  'click #enterAnswer': function(e) {

    Meteor.call('pokerSubmit');
  },

  'click .deal-card': function(event) {
    Meteor.call('dealCard');
  }
})