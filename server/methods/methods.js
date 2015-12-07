Meteor.methods({
  'createGroup': function() {
  },

  // Join a group
  'joinGroup': function(gameRoom, gameType, gameGroup) {
    if (Meteor.user().game) {
      if (Meteor.user().game.group) {
        var $groupSet = {};
        $groupSet[Meteor.user().game.group + '.members.' + Meteor.user().game.role] = "";

        var userSet = {};
        userSet['game.group'] = "";
        userSet['game.role'] = "";
        
        Meteor.users.update(Meteor.userId(), {$unset: userSet}, {multi: true});
        Groups.update(gameRoom, {$unset: $groupSet}, {multi: true});
      }
    }

    // Variable setup for db
    var $groupSet = {};
    $groupSet[gameGroup + '.members.' + gameType] = Meteor.userId();
    var userSet = {};
    userSet['game.group'] = gameGroup;
    userSet['game.role'] = gameType;
    // inserting into the db
    Groups.update(gameRoom, {$set: $groupSet}, {multi: true});
    Meteor.users.update(Meteor.userId(), {$set: userSet}, {multi: true});
  },

  // When a User Logs Out
  'userLogout': function(gameRoom) {
    var $groupSet = {};
    $groupSet[Meteor.user().game.group + '.members.' + Meteor.user().game.role] = "";

    var userSet = {};
    userSet['game.group'] = "";
    userSet['game.role'] = "";
    
    Meteor.users.update(Meteor.userId(), {$unset: userSet}, {multi: true});
    Groups.update(gameRoom, {$unset: $groupSet}, {multi: true});
  },

  // Set the initial gamestate when the game is ready
  'gameReady': function() {
    var obj = Groups.findOne({});
    
    // Set the game state only when the game hasn't started
    if (obj.group1.members.poker && obj.group1.members.minigame) {
      Groups.update(obj._id, {$set: {'game.ready': true} }, {multi: true});
      Groups.update(obj._id, {$set: {'game.state': 'dealCards'} }, {multi: true});
    } else {
      return
    }
  },

  // When poker finishes
  'pokerSubmit': function() {
    var gameRoom = Groups.findOne()._id;

    Groups.update(gameRoom, {$set: {'game.state': 'minigame'} }, {multi: true});
  }
});


// When a user logs out of the window
UserStatus.events.on("connectionLogout", function(userId) { 
  var gameRoom = Groups.findOne()._id;

  var userObj = Meteor.users.findOne(userId.userId);

  var $groupSet = {};
  $groupSet[userObj.game.group+'.members.'+userObj.game.role] = "";

  var userSet = {};
  userSet['game.group'] = "";
  userSet['game.role'] = "";

  Meteor.users.update(userId.userId, {$unset: userSet}, {multi: true});
  Groups.update(gameRoom, {$unset: $groupSet}, {multi: true});
  Groups.update(gameRoom, {$set: {'game.ready': false} }, {multi: true});
});


