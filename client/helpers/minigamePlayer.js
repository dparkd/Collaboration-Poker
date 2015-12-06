Template.minigamePlayer.helpers({
  'gamePlay': function() {
    var obj = Groups.findOne({});
    if (obj.game) {
      if (obj.game.state === 'minigame') {
        return true
      } else {
        return false
      }
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

Template.minigamePlayer.events({
  'click #enterAnswer': function(e) {

    Meteor.call('minigameSubmit');
  }
})