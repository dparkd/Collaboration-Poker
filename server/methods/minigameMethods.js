Meteor.methods({
  // Method to check if it's the right answer
  'checkAnswer': function(userChoice) {
    var obj = PokerGame.findOne({});
    var gameRoom = Groups.findOne()._id;

    // object to insert to pokergame
    var userWin = {};

    if (obj.minigame.answer === userChoice) {
      // See which group won
      userWin['minigame.'+obj.minigame.state+'.winner'] = Meteor.user().game.group;
      PokerGame.update(obj._id, {$set: userWin});
      Groups.update(gameRoom, {$set: {'game.state': 'chooseCard'} }, {multi: true});
    }
  },

  // User chooses a card
  'chooseCard': function(userCard) {
    var obj = PokerGame.findOne({});
    var gameRoom = Groups.findOne()._id;

    // object to insert to pokergame
    var cardObj = {};

    // cards array
    var pokerCards = obj.cards;
    var i = pokerCards.indexOf(userCard);
    if (i > -1) {
      pokerCards.splice(i, 1);
    }

    cardObj['playcards.'+obj.minigame.state] = userCard;
    cardObj['cards'] = pokerCards;
    PokerGame.update(obj._id, {$set: cardObj});

    if (obj.minigame.state == "card1") {
      PokerGame.update(obj._id, {$set: {'minigame.state': 'card2'}});
      Groups.update(gameRoom, {$set: {'game.state': 'minigame'} }, {multi: true});
    } else if (obj.minigame.state == "card2") {
      PokerGame.update(obj._id, {$set: {'minigame.state': 'poker'}});
      Groups.update(gameRoom, {$set: {'game.state': 'poker'} }, {multi: true});
    }
  }
});


// When minigame submits correct answer
  // 'minigameSubmit': function() {
  //   var gameRoom = Groups.findOne()._id;

  //   Groups.update(gameRoom, {$set: {'game.state': 'poker'} }, {multi: true});
  // },