Meteor.methods({
  'createGroup': function() {
  },

  // Join a grou 
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

    var $groupSet = {};
    $groupSet[gameGroup + '.members.' + gameType] = Meteor.userId();

    var userSet = {};
    userSet['game.group'] = gameGroup;
    userSet['game.role'] = gameType;

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
  }
});

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
});

