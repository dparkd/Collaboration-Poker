Template.gameReady.helpers({
  'gameReady': function() {
    var obj = Groups.findOne({});
    
    if (obj.group1.members.poker && obj.group1.members.minigame) {
      return true
    } else {
      return false
    }
  }
})