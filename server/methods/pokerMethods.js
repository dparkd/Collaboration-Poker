var resetBoard = function() {
  var poker = PokerGame.findOne();
  var group = Groups.findOne()._id;

  // reset the game state
  Groups.update(group, {$set: {'game.state': 'dealCards'}});


  // Reset the poker
  PokerGame.update(poker._id, {$set: {
    currentPlayer: 'group1', 
    cards: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10],
    'group1.card': "", 
    'group1.chips': "", 
    'group2.card': "", 
    'group2.chips': "", 
    'playcards.card1': "", 
    'playcards.card2': "",
    'minigame.card1.winner': "",
    'minigame.card2.winner': "",
    'minigame.state': "card1",
    'poker.cardState': "start",
    'poker.currentPlayer': "group1"
  }});
}

Meteor.methods({
  'removeCardFromHand': function(card) {
    var poker = PokerGame.findOne()._id;

    PokerGame.update(poker, {$pull: {cards: card}});
  },

  'dealCards': function() {
    var poker = PokerGame.findOne()._id;
    var obj = PokerGame.findOne({});
    var group = Groups.findOne()._id;

    for (var i = 1; i < 3; i++) {
      var pokerCards = obj.cards;
      var card = pokerCards[Math.floor(Math.random()*pokerCards.length)];
      var insCard = {};
      insCard['group'+i+'.card'] = card;
      insCard['group'+i+'.chips'] = 300;

      // Remove the card from the cards array 
      var ia = pokerCards.indexOf(card);
      if(ia > -1) {
        pokerCards.splice(ia, 1);
      }
      insCard['cards'] = pokerCards;

      PokerGame.update(poker, {$set: insCard, });
    }

    Groups.update(group, {$set: {'game.state': 'minigame'}});
    PokerGame.update(poker, {$set: {'poker.currentPlayer': 'group1'}});
    PokerGame.update(poker, {$set: {
      'poker.cardState': 'start',
    }})
  },

  // The next player method
  'nextPlayer': function() {
    var poker = PokerGame.findOne();

    if (poker.currentPlayer === 'group1') {
      PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group2'}});
    } else {
      PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group1'}});
    }
  },

  // Fold function
  'fold': function(userId) {
    resetBoard();
  },

  // Reseting cards for easy development 
  'resetCards': function() {
    var poker = PokerGame.findOne();
    var group = Groups.findOne()._id;

    // reset the game state
    Groups.update(group, {$set: {'game.state': 'dealCards'}});


    // Reset the poker
    PokerGame.update(poker._id, {$set: {
      currentPlayer: 'group1', 
      cards: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10],
      'group1.card': "", 
      'group1.chips': "", 
      'group2.card': "", 
      'group2.chips': "", 
      'playcards.card1': "", 
      'playcards.card2': "",
      'minigame.card1.winner': "",
      'minigame.card2.winner': "",
      'minigame.state': "card1",
      'poker.cardState': "start",
      'poker.currentPlayer': "group1"
    }});
  }
});





















