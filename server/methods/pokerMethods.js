var resetBoard = function() {
  var poker = PokerGame.findOne();
  var group = Groups.findOne()._id;

  // reset the game state
  Groups.update(group, {$set: {'game.state': 'dealCards'}});


  // Reset the poker
  PokerGame.update(poker._id, {$set: {
    cards: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10],
    'group1.card': "",  
    'group2.card': "",  
    'playcards.card1': "", 
    'playcards.card2': "",
    'minigame.card1.winner': "",
    'minigame.card2.winner': "",
    'minigame.state': "card1",
    'poker.cardState': "start",
    'poker.currentPlayer': "group1",
    'poker.betAmt': 0,
    'poker.pot': 0,
    'poker.players': ['group1', 'group2'],
    'poker.startPlayer': "group1"
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
  'fold': function(group) {
    var poker = PokerGame.findOne();

    // object to remove the player
    var player = {};
    var players = poker.poker.players;
    var playerIndex = players.indexOf(group);
    if (playerIndex > -1) {
      players.splice(playerIndex, 1);
    }

    player['poker.players'] = players;

    PokerGame.update(poker._id, {$set: player});

    resetBoard();
  },

  // Betting method and function
  'bet': function(userGroup, amount) {
    var poker = PokerGame.findOne();
    var betAmt = {};
    var pot = {};

    // remove chips from the user
    var chips = {};
    chips[userGroup+'.chips'] = -amount;
    PokerGame.update(poker._id, {$inc: chips});
    
    if (poker.poker.currentPlayer === 'group1') {
      PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group2'}});

      betAmt['poker.betAmt'] = parseInt(amount);
      pot['poker.pot'] = parseInt(amount);
      PokerGame.update(poker._id, {$set: betAmt});
      PokerGame.update(poker._id, {$inc: pot});
    } else {
      PokerGame.update(poker._id, {$set: {'poker.currentPlayer': 'group1'}});

      betAmt['poker.betAmt'] = parseInt(amount);
      pot['poker.pot'] = parseInt(amount);
      PokerGame.update(poker._id, {$set: betAmt});
      PokerGame.update(poker._id, {$inc: pot});
    }
  },

  // Calling the bet
  'call': function(userGroup) {
    var poker = PokerGame.findOne();

    // update the pot 
    var called = {}; 
    called['poker.pot'] = parseInt(poker.poker.betAmt);
    PokerGame.update(poker._id, {$inc: called});

    // remove chips from the person who called
    var chips = {};
    chips[userGroup+'.chips'] = -(poker.poker.betAmt);
    PokerGame.update(poker._id, {$inc: chips});

    // Reset the betting slot
    PokerGame.update(poker._id, {$set: {'poker.betAmt': 0}});

    // changing the poker state
    if (poker.poker.cardState === 'start') {
      PokerGame.update(poker._id, {$set: {'poker.cardState': 'card1'}});
    } else if (poker.poker.cardState === 'card1') {
      PokerGame.update(poker._id, {$set: {'poker.cardState': 'card2'}});
    } else {
      resetBoard();
      PokerGame.update(poker._id, {$set: {'poker.cardState': 'start'}});
    }
  },

  // Reseting cards for easy development 
  'resetCards': function() {
    var poker = PokerGame.findOne();
    var group = Groups.findOne()._id;

    // reset the game state
    Groups.update(group, {$set: {'game.state': 'dealCards'}});


    // Reset the poker
    PokerGame.update(poker._id, {$set: {
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
      'poker.currentPlayer': "group1",
      'poker.betAmt': 0,
      'poker.pot': 0,
      'poker.startPlayer': "group1"
    }});
  }
});





















