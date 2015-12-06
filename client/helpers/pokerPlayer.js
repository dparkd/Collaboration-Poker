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
  }
});

Template.pokerPlayer.events({
  'click #enterAnswer': function(e) {

    Meteor.call('pokerSubmit');
  }
})